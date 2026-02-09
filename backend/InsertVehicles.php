<?php
require_once __DIR__ . '/config.php';

class InsertVehicles extends config{

  public function insertVehicles($vehicle_name, $vehicle_type, $plate_number) {
    $conn = $this->conn();
    $sql = "INSERT INTO vehicle_reported (vehicle_name, vehicle_type, plate_number) VALUES (:vehicle_name, :vehicle_type, :plate_number)";

    $data = $conn->prepare($sql);
    $data->execute([
      ':vehicle_name' => $vehicle_name,
      ':vehicle_type' => $vehicle_type,
      ':plate_number' => $plate_number
    ]);

    return $conn->lastInsertId();
  }
}

?>