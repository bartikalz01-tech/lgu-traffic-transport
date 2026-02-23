<?php
require_once __DIR__ . '/config.php';

class InsertViolationCase extends config {
  
  public function insertViolation( $publicViolationId, $roadId, $violationType, $violationDescription, $dateOfViolation, $timeOfViolation) {
    $conn = $this->conn();
    $sql = "
      INSERT INTO violations_cases 
      (public_violation_id, road_id, violation_type, violation_description, date_of_violation, time_of_violation)
      VALUES 
      (:public_violation_id, :road_id, :violation_type, :violation_description, :date_of_violation, :time_of_violation)
    ";
    $data = $conn->prepare($sql);

    $data->execute([
      ':public_violation_id' => $publicViolationId,
      ':road_id' => $roadId,
      ':violation_type' => $violationType,
      ':violation_description' => $violationDescription,
      ':date_of_violation' => $dateOfViolation,
      ':time_of_violation' => $timeOfViolation
    ]);

    return $conn->lastInsertId();
  }

}

?>