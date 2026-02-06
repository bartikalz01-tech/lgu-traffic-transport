<?php
require '../backend/Accidents.php';

header('Content-type: application/json');

$accidents = new Accidents();

$accidentId = (int) ($_GET['accident_id'] ?? 0);

if(!$accidentId) {
  echo json_encode([
    'success' => false,
    'message' => 'Invalid accident ID'
  ]);
  exit;
}

$data = $accidents->headerAccidentDetails($accidentId);

echo json_encode([
  'success' => true,
  'data' => $data
]);
?>