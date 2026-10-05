<?php
require_once 'config.php';

class RoadMapStatus extends config{

  public function insertCctvHistoricalRecord($data) {

    $conn = $this->conn();

    $sql = "
      INSERT INTO cctv_historical_records (
        camera_name,
        recording_filename,
        recording_from,
        recording_to,
        duration_seconds
      )
      VALUES (
        :camera_name,
        :recording_filename,
        :recording_from,
        :recording_to,
        :duration_seconds
      )
    ";

    $stmt = $conn->prepare($sql);

    $stmt->execute([
      ':camera_name' =>
        $data['camera_name'],

      ':recording_filename' =>
        $data['recording_filename'],

      ':recording_from' =>
        $data['recording_from'],

      ':recording_to' =>
        $data['recording_to'],

      ':duration_seconds' =>
        (int)$data['duration_seconds']
    ]);

    return [
      'success' => true,
      'cctv_record_id' => $conn->lastInsertId()
    ];
  }

  public function roadStatusCctv() {
    $conn =  $this->conn();
    $sql = "
      SELECT
        r.road_id,
        r.road_name,
        r.video_filename,
        r.camera_name,

        rts.vehicle_flow,
        rts.avg_speed,
        rts.traffic_level,
        rts.updated_at
      
      FROM roads r

      LEFT JOIN road_traffic_status rts
      ON r.road_id = rts.road_id

      WHERE r.road_id IN (1, 2, 3, 4)
      AND r.video_filename IS NOT NULL

      ORDER BY r.road_id
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function roadStatusMap() {
    $conn = $this->conn();
    $sql = "
      SELECT
          r.road_id,
          r.road_name,
          rc.latitude,
          rc.longtitude,
          rc.point_order,
          rts.traffic_level
      FROM roads r
      JOIN road_coordinates rc ON r.road_id = rc.road_id
      LEFT JOIN road_traffic_status rts ON r.road_id = rts.road_id
      ORDER BY r.road_id, rc.point_order;
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function roadDiversionCoordinates($road_id) {
    $conn = $this->conn();
    $sql = "
      SELECT latitude, longtitude FROM road_coordinates
      WHERE road_id = :road_id
      ORDER BY point_order;
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':road_id', $road_id);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }


  public function trafficTrendAndCongestionFrequencyLogs() {

    $conn = $this->conn();

    // ==========================================================
    // REPORT INTERVAL
    // ==========================================================

    $interval = (int)($_GET['interval'] ?? 1);

    $allowedIntervals = [1, 2, 4, 6, 12, 24];

    if (!in_array($interval, $allowedIntervals, true)) {
        $interval = 1;
    }


    // ==========================================================
    // SQL
    // ==========================================================

    $sql = "
      SELECT
        rtl.road_id,
        r.road_name,

        DATE(rtl.recorded_at) AS record_date,

        FLOOR(
            HOUR(rtl.recorded_at) / $interval
        ) * $interval AS interval_hour,

        AVG(rtl.vehicle_flow) AS vehicle_flow,

        AVG(rtl.avg_speed) AS avg_speed,

        rtl.traffic_level,

        COUNT(*) AS record_count

      FROM road_traffic_logs rtl

      INNER JOIN roads r
          ON rtl.road_id = r.road_id

      WHERE 1 = 1
    ";

    $params = [];


    // ==========================================================
    // DATE RANGE
    // ==========================================================

    if (!empty($_GET['start_date'])) {

        $sql .= "
            AND DATE(rtl.recorded_at) >= ?
        ";

        $params[] = $_GET['start_date'];
    }


    if (!empty($_GET['end_date'])) {

        $sql .= "
            AND DATE(rtl.recorded_at) <= ?
        ";

        $params[] = $_GET['end_date'];
    }


    // ==========================================================
    // ROAD FILTER
    // ==========================================================

    if (
        !empty($_GET['road_id']) &&
        $_GET['road_id'] !== 'all'
    ) {

        $sql .= "
            AND rtl.road_id = ?
        ";

        $params[] = $_GET['road_id'];
    }


    // ==========================================================
    // GROUP BY
    // ==========================================================

    $sql .= "
        GROUP BY
            rtl.road_id,
            r.road_name,
            DATE(rtl.recorded_at),
            FLOOR(
                HOUR(rtl.recorded_at) / $interval
            )
    ";


    // ==========================================================
    // ORDER
    // ==========================================================

    $sql .= "
      ORDER BY
        record_date ASC,
        interval_hour ASC,
        rtl.road_id ASC
    ";


    // ==========================================================
    // EXECUTE
    // ==========================================================

    $stmt = $conn->prepare($sql);

    $stmt->execute($params);


    // ==========================================================
    // BUILD REPORT RESULTS
    // ==========================================================

    $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);


    foreach ($logs as &$log) {
      /*
      * Reconstruct the beginning of the time bucket.
      *
      * Example:
      *
      * interval = 1
      * 08:00
      *
      * interval = 4
      * 08:00
      * 12:00
      * 16:00
      *
      * interval = 24
      * 00:00
      */

      $hour = (int)$log['interval_hour'];

      $log['recorded_at'] =
        sprintf(
          '%s %02d:00:00',
          $log['record_date'],
          $hour
        );


      /*
        * Convert numeric values to proper numbers.
        */

      $log['vehicle_flow'] =
        (float)$log['vehicle_flow'];

      $log['avg_speed'] =
        (float)$log['avg_speed'];

      $log['record_count'] =
        (int)$log['record_count'];


      /*
        * Remove internal grouping fields from
        * the response.
        */

      unset($log['record_date']);
      unset($log['interval_hour']);
    }

    unset($log);


    return $logs;
  }

  public function averageSpeedHistoryLogs() {
    $conn = $this->conn();
    $sql = "
      SELECT
        rtl.traffic_log_id,
        rtl.road_id,
        r.road_name,
        rtl.avg_speed,
        rtl.recorded_at
      FROM road_traffic_logs rtl
      INNER JOIN roads r
        ON rtl.road_id = r.road_id
      WHERE 1=1
    ";

    $params = [];

    if(!empty($_GET['start_date'])) {
      $sql .= " AND DATE(rtl.recorded_at) >= ?";
      $params[] = $_GET['start_date']; 
    }

    if(!empty($_GET['end_date'])) {
      $sql .= " AND DATE(rtl.recorded_at) <= ?";
      $params[] = $_GET['end_date']; 
    }

    if(!empty($_GET['road_id']) && $_GET['road_id'] !== "all") {
      $sql .= " AND rtl.road_id = ?";
      $params[] = $_GET['road_id'];
    }

    $sql .= "
      ORDER BY rtl.recorded_at DESC
    ";

    $stmt = $conn->prepare($sql);

    $stmt->execute($params);

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function peakHourAnalyticsLogs() {

    $conn = $this->conn();

    $roadId = $_GET['road_id'] ?? 'all';

    $where = "WHERE 1=1";
    $params = [];

    if (!empty($_GET['start_date'])) {
        $where .= " AND DATE(rtl.recorded_at) >= ?";
        $params[] = $_GET['start_date'];
    }

    if (!empty($_GET['end_date'])) {
        $where .= " AND DATE(rtl.recorded_at) <= ?";
        $params[] = $_GET['end_date'];
    }

    if ($roadId !== 'all' && !empty($roadId)) {
        $where .= " AND rtl.road_id = ?";
        $params[] = $roadId;
    }

    /*
     * First get the hourly traffic averages.
     */
    $sql = "

        SELECT
            HOUR(rtl.recorded_at) AS traffic_hour,

            AVG(rtl.vehicle_flow) AS avg_vehicle_flow,

            AVG(rtl.avg_speed) AS avg_speed,

            COUNT(*) AS recorded_count,

            r.road_id,
            r.road_name

        FROM road_traffic_logs rtl

        INNER JOIN roads r
            ON rtl.road_id = r.road_id

        $where

        GROUP BY
            HOUR(rtl.recorded_at)

        ORDER BY
            traffic_hour ASC
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute($params);

    $hourlyData = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($hourlyData)) {
        return [
            "peak" => null,
            "lowest" => null,
            "hourly_data" => []
        ];
    }

    /*
     * Find the hour with the highest vehicle flow.
     */
    $peakHour = $hourlyData[0];

    /*
     * Find the hour with the lowest vehicle flow.
     */
    $lowestHour = $hourlyData[0];

    foreach ($hourlyData as $hour) {

        if (
            (float)$hour['avg_vehicle_flow']
            >
            (float)$peakHour['avg_vehicle_flow']
        ) {
            $peakHour = $hour;
        }

        if (
            (float)$hour['avg_vehicle_flow']
            <
            (float)$lowestHour['avg_vehicle_flow']
        ) {
            $lowestHour = $hour;
        }
    }

    return [
        "peak" => $peakHour,
        "lowest" => $lowestHour,
        "hourly_data" => $hourlyData
    ];
  }

  public function getCctvHistoricalRecords($filters = []) {

    $conn = $this->conn();

    $sql = "
      SELECT
        cctv_record_id,
        camera_name,
        recording_filename,
        recording_from,
        recording_to,
        duration_seconds,
        created_at
      FROM cctv_historical_records
      WHERE 1=1
    ";

    $params = [];

    if (!empty($filters['camera_name']) && $filters['camera_name'] !== 'all') {

      $sql .= "
        AND camera_name = ?
      ";

      $params[] = $filters['camera_name'];
    }

    if (!empty($filters['start_date'])) {

      $sql .= "
        AND DATE(recording_from) >= ?
      ";

      $params[] = $filters['start_date'];
    }

    if (!empty($filters['end_date'])) {

      $sql .= "
        AND DATE(recording_to) <= ?
      ";

      $params[] = $filters['end_date'];
    }

    if (!empty($filters['search'])) {

      $sql .= "
        AND (
          camera_name LIKE ?
          OR recording_filename LIKE ?
        )
      ";

      $search = '%' . $filters['search'] . '%';

      $params[] = $search;
      $params[] = $search;
    }

    $sql .= "
      ORDER BY recording_from DESC
    ";

    $stmt = $conn->prepare($sql);

    $stmt->execute($params);

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }
}

?>