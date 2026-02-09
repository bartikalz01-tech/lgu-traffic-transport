<?php
require_once '../backend/AccidentVehicles.php';

header('Content-type: application/json');

$accidentId = (int) ($_GET['accident_id'] ?? 0);

$accidentVehiclesDetails = new AccidentVehicles();

if(!$accidentId) {
  echo json_encode([
    'success' => false,
    'message' => 'Invalid accident ID'
  ]);
  exit;
}

$data = $accidentVehiclesDetails->getAccidentVehiclesDetails($accidentId);

echo json_encode([
  'success' => true,
  'data' => $data
]);

?>