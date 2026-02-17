<?php
require_once '../backend/config.php';
require_once '../backend/InsertVehicles.php';
require_once '../backend/InsertAccidentVehicles.php';

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if(!$data) {
  echo json_encode([
    "success" => false,
    "message" => "Invalid Vehicle Data"
  ]);
  exit;
}

try {
  $config = new config();
  $conn = $config->conn();
  $conn->beginTransaction();

  $vehicleObj = new InsertVehicles();
  $accidentVehicleObj = new InsertAccidentVehicles();

  $vehicleId = $vehicleObj->insertVehicles(
    $data['vehicle_name'],
    $data['vehicle_type'],
    $data['plate_number']
  );

  $accidentVehicleId = $accidentVehicleObj->insertAccidentVehicles(
    $data['accident_id'],
    $data['people_id'],
    $vehicleId,
    $data['damage_level']
  );

  $conn->commit();

  echo json_encode([
    "success" => true
  ]);
} catch(Exception $e) {
  $conn->rollBack();
  echo json_encode([
    "success" => false,
    "message" => $e->getMessage()
  ]);
}

?>