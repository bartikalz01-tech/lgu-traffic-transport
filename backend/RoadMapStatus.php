<?php
require_once 'config.php';

class RoadMapStatus extends config{

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

      WHERE r.road_id iN (8, 9, 11)
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
    $sql = "
      SELECT
        rtl.traffic_log_id,
        rtl.road_id,
        r.road_name,
        rtl.vehicle_flow,
        rtl.avg_speed,
        rtl.traffic_level,
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

    if(!empty($_GET['road_id']) && $_GET['road_id'] != "all") {
      $sql .= " AND rtl.road_id = ?";
      $params[] = $_GET['road_id'];
    }

    $sql .= " ORDER BY rtl.recorded_at DESC";

    $stmt = $conn->prepare($sql);
    $stmt->execute($params);

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
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

    $sql = "
        SELECT
            HOUR(rtl.recorded_at) AS traffic_hour,

            AVG(rtl.vehicle_flow) AS avg_vehicle_flow,

            AVG(rtl.avg_speed) AS avg_speed,

            AVG(
                CASE
                    WHEN LOWER(rtl.traffic_level) = 'high' THEN 3
                    WHEN LOWER(rtl.traffic_level) = 'moderate' THEN 2
                    WHEN LOWER(rtl.traffic_level) = 'low' THEN 1
                    ELSE 0
                END
            ) AS congestion_points,

            COUNT(*) AS recorded_count
    ";

    // Selected road mode
    if ($roadId !== 'all' && !empty($roadId)) {

        $sql .= ",
            rtl.road_id,
            r.road_name
        ";
    }

    $sql .= "
        FROM road_traffic_logs rtl

        INNER JOIN roads r
            ON rtl.road_id = r.road_id

        WHERE 1=1
    ";

    $params = [];

    // Date filtering
    if (!empty($_GET['start_date'])) {

        $sql .= " AND DATE(rtl.recorded_at) >= ?";
        $params[] = $_GET['start_date'];
    }

    if (!empty($_GET['end_date'])) {

        $sql .= " AND DATE(rtl.recorded_at) <= ?";
        $params[] = $_GET['end_date'];
    }

    // Road filtering
    if ($roadId !== 'all' && !empty($roadId)) {

        $sql .= " AND rtl.road_id = ?";
        $params[] = $roadId;
    }

    // Grouping
    if ($roadId !== 'all' && !empty($roadId)) {

        $sql .= "
            GROUP BY
                rtl.road_id,
                r.road_name,
                HOUR(rtl.recorded_at)
        ";

    } else {

        $sql .= "
            GROUP BY
                HOUR(rtl.recorded_at)
        ";
    }

    $sql .= "
        ORDER BY
            traffic_hour ASC
    ";

    try {

        $stmt = $conn->prepare($sql);
        $stmt->execute($params);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);

    } catch (PDOException $e) {

      error_log(
          "Peak Hour SQL Error: " . $e->getMessage()
      );

      throw $e;
  }
  }
}

?>