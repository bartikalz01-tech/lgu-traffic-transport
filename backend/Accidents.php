<?php
require_once 'config.php';

class Accidents extends config {

  public function insertAccidentReport($data) {
    $conn = $this->conn();
    $publicAccidentId = 'ACC-' . date('Ymd') . '-' .  strtoupper(substr(uniqid(), -6));
    $sql = "
      INSERT INTO accident_cases (
        public_accident_id,
        road_id,
        accident_date,
        accident_time,
        accident_type,
        specific_location,
        snapshot_filename
      )
      VALUES (
        :public_accident_id,
        :road_id,
        :accident_date,
        :accident_time,
        :accident_type,
        :specific_location,
        :snapshot_filename
      )
    ";

    $stmt = $conn->prepare($sql);

    $stmt->bindParam(':public_accident_id', $publicAccidentId);

    $stmt->bindParam(':road_id', $data['road_id']);

    $stmt->bindParam(':accident_date', $data['accident_date']);

    $stmt->bindParam(':accident_time', $data['accident_time']);

    $stmt->bindParam(':accident_type', $data['accident_type']);

    $stmt->bindParam(':specific_location', $data['specific_location']);

    $stmt->bindParam(':snapshot_filename', $data['snapshot_filename']);

    try {
      $stmt->execute();

      return [
        'accident_id' => $conn->lastInsertId(),
        'public_accident_id' => $publicAccidentId
      ];
    } catch(PDOException $e) {
      throw new Exception("Database insert failed");
    }
  }
  
  public function getAccidentDetails() {
    $conn = $this->conn();
    $sql = "
      SELECT
        ac.accident_id,
        ac.public_accident_id,
        ac.road_id,
        r.road_name,
        ac.accident_date,
        ac.accident_time,
        ac.accident_type,
        ac.specific_location,
        ac.status,
        ac.snapshot_filename,
        ac.reported_at,
        ac.updated_at
      FROM accident_cases ac
      INNER JOIN roads r
        ON ac.road_id = r.road_id
      
      ORDER BY ac.reported_at DESC
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

}