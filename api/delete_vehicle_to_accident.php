<?php
require_once '../backend/AccidentVehicles.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

$accidentVehicleId = $data['accident_vehicle_id'] ?? null;

if(!$accidentVehicleId) {
  echo json_encode([
    "success" => false
  ]);
  exit;
}

try {
  $delete = new AccidentVehicles();
  $deleteVehicles = $delete->deleteAccidentVehicles($accidentVehicleId);

  echo json_encode([
    "success" => $deleteVehicles
  ]);
} catch(Exception $e) {
  echo json_encode([
    "success" => false,
    "error" => $e->getMessage()
  ]);
}

?>