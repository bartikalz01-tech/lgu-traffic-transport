<?php
require_once 'config.php';

class AccidentVehicles extends config {
  
  public function getTotalAccidentVehicles($accident_id) {
    $conn = $this->conn();
    $sql = "
      SELECT COUNT(*) AS total_vehicles
      FROM accident_vehicles
      WHERE accident_id = :accident_id
    ";

    $data = $conn->prepare($sql);
    $data->bindParam(':accident_id', $accident_id, PDO::PARAM_INT);
    $data->execute();

    return $data->fetch(PDO::FETCH_ASSOC);
  }
}
?>