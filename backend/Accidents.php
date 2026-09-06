<?php
require_once 'config.php';

class Accidents extends config {

  public function insertAccidentReport($data) {
    $conn = $this->conn();

    try {

      $conn->beginTransaction();

      $sql = "
        SELECT
          accident_detection_id
        FROM accident_detections
        WHERE accident_detection_id = :accident_detection_id
        LIMIT 1
      ";

      $stmt = $conn->prepare($sql);

      $stmt->bindParam(':accident_detection_id', $data['accident_detection_id'], PDO::PARAM_INT);

      $stmt->execute();

      $detection = $stmt->fetch(PDO::FETCH_ASSOC);

      if(!$detection) {
        throw new Exception("Accident detection not found.");
      }

      $publicAccidentId = 'ACC-' . date('Ymd') . '-' .  strtoupper(substr(uniqid(), -6));

      $sql = "
        INSERT INTO accident_cases (
          public_accident_id,
          accident_detection_id,
          accident_type,
          specific_location
        ) VALUES (
          :public_accident_id,
          :accident_detection_id,
          :accident_type,
          :specific_location 
        )
      ";

      $stmt = $conn->prepare($sql);

      $stmt->bindValue(':public_accident_id', $publicAccidentId);

      $stmt->bindValue(':accident_detection_id', $data['accident_detection_id'], PDO::PARAM_INT);

      $stmt->bindValue(':accident_type', $data['accident_type']);

      $stmt->bindValue(':specific_location', $data['specific_location']);

      $stmt->execute();

      $accidentId = $conn->lastInsertId();

      $conn->commit();

      return [
        'success' => true,
        'accident_id' => $accidentId,
        'public_accident_id' => $publicAccidentId
      ];

    } catch(PDOException $e) {
      if ($conn->inTransaction()) {
        $conn->rollBack();
      }

      error_log(
        "[ACCIDENT] Database error: " .
        $e->getMessage()
      );

      throw new Exception("Database insert failed.");

    } catch(Exception $e) {

      if ($conn->inTransaction()) {
        $conn->rollBack();
      }

      throw $e;
    }

  }
  
  public function getAccidentDetails() {

    $conn = $this->conn();

    $sql = "
      SELECT
        ac.accident_id,
        ac.public_accident_id,

        ad.accident_detection_id,
        ad.road_id,
        r.road_name,
        r.camera_name,

        ad.detected_at,
        ad.snapshot_filename,

        ac.accident_type,
        ac.specific_location,
        ac.status,

        ae.recording_filename,
        ae.recording_from,
        ae.recording_to,

        ac.reported_at,
        ac.updated_at

      FROM accident_cases ac

      INNER JOIN accident_detections ad
        ON ac.accident_detection_id = ad.accident_detection_id

      INNER JOIN roads r
        ON ad.road_id = r.road_id

      LEFT JOIN accident_evidence ae
        ON ac.accident_id = ae.accident_id

      ORDER BY ac.reported_at DESC
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function accidentReportApi() {
    $conn = $this->conn();
    $sql = "
      SELECT
        ac.public_accident_id,
        r.road_name,
        ac.accident_date,
        ac.accident_time,
        ac.accident_type,
        ac.specific_location,
        ac.status,
        ac.reported_at,
        ac.updated_at
      FROM accident_cases ac

      LEFT JOIN roads r
        ON ac.road_id = r.road_id
      
      ORDER BY ac.reported_at DESC
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function getPossibleAccidents() {
    $conn = $this->conn();
    $sql = "
      SELECT
        ad.accident_detection_id,
        ad.road_id,
        r.road_name,
        r.camera_name,
        ad.detected_at,
        ad.snapshot_filename
      FROM accident_detections ad

      LEFT JOIN roads r
        ON ad.road_id = r.road_id

      ORDER BY ad.created_at DESC
      LIMIT 30
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

}