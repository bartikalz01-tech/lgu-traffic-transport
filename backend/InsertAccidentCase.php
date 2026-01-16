<?php
require_once __DIR__ . '/config.php';

class InsertAccidentCase extends config {

  public function insertAccident($public_accident_id, $road_id, $accident_type, $accident_description, $status_of_accident, $time_of_accident, $date_of_accident) {
    $conn = $this->conn();
    $sql = "INSERT INTO `accident_cases`(`public_accident_id`, `road_id`, `accident_type`, `accident_description`, `status_of_accident`, `time_of_accident`, `date_of_accident`)
            VALUES (:public_accident_id, :road_id, :accident_type, :accident_description, :status_of_accident, :time_of_accident, :date_of_accident)";
    $data = $conn->prepare($sql);

    $data->execute([
      ':public_accident_id' => $public_accident_id,
      ':road_id' => $road_id,
      ':accident_type' => $accident_type,
      ':accident_description' => $accident_description,
      ':status_of_accident' => $status_of_accident,
      ':time_of_accident' => $time_of_accident,
      ':date_of_accident' => $date_of_accident
    ]);

    return $conn->lastInsertId();
  }
}
?>