<?php
require_once 'config.php';

class Ptc extends config {

  public function insertPuvGroupPending($data) {

    $conn = $this->conn();

    $conn->beginTransaction();

    $sql = "
      INSERT INTO puv_groups (
        group_name, 
        puv_type, 
        representative_name, 
        contact_number,
        email_address
      ) VALUES (
        :group_name,
        :puv_type,
        :representative_name,
        :contact_number,
        :email_address 
      )
    ";

    $stmt = $conn->prepare($sql);

    $stmt->bindParam(':group_name', $data['group_name']);
    $stmt->bindParam(':puv_type', $data['puv_type']);
    $stmt->bindParam(':representative_name', $data['representative_name']);
    $stmt->bindParam(':contact_number', $data['contact_number']);
    $stmt->bindParam(':email_address', $data['email_address']);

    try {
      $stmt->execute();

      $puvGroupId = $conn->lastInsertId();

      $meetingDate = !empty($data['meeting_date']) ? $data['meeting_date'] : null;

      $meetingTime = !empty($data['meeting_time']) ? $data['meeting_time'] : null;

      $scheduleSql = "
        INSERT INTO puv_coordination_meetings(
          puv_group_id,
          meeting_date,
          meeting_time
        ) VALUES (
          :puv_group_id,
          :meeting_date,
          :meeting_time
        )
      ";

      $scheduleStmt = $conn->prepare($scheduleSql);

      $scheduleStmt->bindParam(':puv_group_id', $puvGroupId, PDO::PARAM_INT);
      $scheduleStmt->bindParam(':meeting_date', $meetingDate);
      $scheduleStmt->bindParam(':meeting_time', $meetingTime);

      $scheduleStmt->execute();

      $conn->commit();

      return [
        'success' => true,
        'puv_group_id' => $puvGroupId,
      ];

    } catch(PDOException $e) {
      
      if($conn->inTransaction()) {
        $conn->rollBack();
      }

      error_log(
        "Database error: " .
        $e->getMessage()
      );

      throw new Exception("Database insert failed");
    }
  }

  public function insertPuvLocations($data) {

    $conn = $this->conn();

    $conn->beginTransaction();

    try {
      
      $puvGroupId = (int)$data['puv-group-id'];

      if(!empty($data['vehicle_staging'])) {

        $vehicle = $data['vehicle_staging'];

        $roadId = null;

        if(!empty($vehicle['road_name'])) {

          $roadSql = "
            SELECT road_id
            FROM roads
            WHERE road_name = :road_name
            LIMIT 1
          ";

          $roadStmt = $conn->prepare($roadSql);

          $roadStmt->execute([
            'road_name' => $vehicle['road_name']
          ]);

          $road = $roadStmt->fetch(PDO::FETCH_ASSOC);

          if($road) {
            $roadId = $road['road_id'];
          }
        }

        $vehicleSql = "
          INSERT INTO puv_locations (
            puv_group_id,
            road_id,
            location_type,
            location_name,
            latitude,
            longitude
          )
          VALUES (
            :puv_group_id,
            :road_id,
            'Vehicle Staging',
            :location_name,
            :latitude,
            :longitude
          )
        ";

        $vehicleStmt = $conn->prepare($vehicleSql);

        $vehicleStmt->execute([
          ':puv_group_id' => $puvGroupId,
          ':road_id' => $roadId,
          'location_name' =>$vehicle['location_name'],
          'latitude' => $vehicle['latitude'],
          'longitude' => $vehicle['longitude']
        ]);
      }

      if(!empty($data['passenger_loading'])) {

        foreach($data['passenger_loading'] as $loadingArea) {
          $roadId = null;

          if(!empty($loadingArea['road_name'])) {
            $roadSql = "
              SELECT road_id
              FROM roads
              WHERE road_name = :road_name
              LIMIT 1
            ";

            $roadStmt = $conn->prepare($roadSql);

            $roadStmt->execute([
              ':road_name' => $loadingArea['road_name']
            ]);

            $road = $roadStmt->fetch(PDO::FETCH_ASSOC);

            if($road) {
              $roadId = $road['road_id'];
            }
          }

          $loadingSql = "
            INSERT INTO puv_locations (
              puv_group_id,
              road_id,
              location_type,
              location_name,
              latitude,
              longitude
            ) VALUES (
              :puv_group_id,
              :road_id,
              'Passenger Loading',
              :location_name,
              :latitude,
              :longitude
            )
          ";

          $loadingStmt = $conn->prepare($loadingSql);

          $loadingStmt->execute([
            ':puv_group_id' => $puvGroupId,
            ':road_id' => $roadId,
            ':location_name' => $loadingArea['location_name'],
            ':latitude' => $loadingArea['latitude'],
            ':longitude' => $loadingArea['longitude']
          ]);
        }
      }

      $conn->commit();

      return ['success' => true];

    } catch(PDOException $e) {
      if ($conn->inTransaction()) {
        $conn->rollBack();
      }

      error_log("PUV Location database error: " . $e->getMessage());

      throw new Exception("Failed to save PUV locations.");
    }
  }

  public function getPuvGroups() {
    $conn = $this->conn();
    $sql = "
      SELECT
        puvg.puv_group_id,
        puvg.group_name,
        puvg.puv_type,
        puvg.representative_name,
        puvg.contact_number,
        puvg.email_address,
        puvg.destination_name,
        puvg.status,
        puvg.created_at,
        puvg.updated_at,

        pcm.puv_meeting_id,
        pcm.meeting_date,
        pcm.meeting_time,
        pcm.meeting_status,

        pc.clearance_id,
        pc.clearance_number,
        pc.clearance_status,
        pc.issued_date,
        pc.expiration_date
      
      FROM puv_groups puvg

      LEFT JOIN puv_coordination_meetings pcm
        ON puvg.puv_group_id = pcm.puv_group_id

      LEFT JOIN puv_clearance pc
        ON puvg.puv_group_id = pc.puv_group_id

      ORDER BY puvg.created_at DESC
    ";

    $stmt = $conn->prepare($sql);

    $stmt->execute();

    $groups = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $locationSql = "
      SELECT
        pl.puv_location_id,
        pl.puv_group_id,
        pl.road_id,
        r.road_name,
        pl.location_type,
        pl.location_name,
        pl.latitude,
        pl.longitude
      FROM puv_locations pl

      LEFT JOIN roads r
        ON pl.road_id = r.road_id

      WHERE pl.puv_group_id = :puv_group_id
      ORDER BY pl.puv_location_id ASC
    ";

    $locationStmt = $conn->prepare($locationSql);

    foreach ($groups as &$group) {

      $locationStmt->execute([
        ':puv_group_id' => $group['puv_group_id']
      ]);

      $group['locations'] = $locationStmt->fetchAll(PDO::FETCH_ASSOC);
    }

    return $groups;
  }

}

?>