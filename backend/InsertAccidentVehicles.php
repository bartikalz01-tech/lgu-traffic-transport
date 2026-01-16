<?php
require_once __DIR__ . '/config.php';

class InsertAccidentVehicles extends config{

  public function insertAccidentVehicles($accident_id, $people_id, $vehicle_id, $damage_level){
    $conn = $this->conn();
    $sql = "INSERT INTO accident_vehicles (accident_id, people_id, vehicle_id, damage_level) VALUES (:accident_id, :people_id, :vehicle_id, :damage_level)";

    $data = $conn->prepare($sql);
    $data->execute([
      ':accident_id' => $accident_id,
      ':people_id' => $people_id,
      ':vehicle_id' => $vehicle_id,
      ':damage_level' => $damage_level
    ]);

    return $conn->lastInsertId();
  }
}
