<?php
require_once '../backend/Accidents.php';

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$accidentId = $data['accident_id'] ?? null;

if(!$accidentId) {
  echo json_encode([
    "success" => false,
  ]);
  exit;
}

try {
  $delete = new Accidents();
  $deleteAccidentItem = $delete->deleteAccidentitem($accidentId);

  echo json_encode([
    "success" => $deleteAccidentItem
  ]);
} catch(Exception $e) {
  echo json_encode([
    "success" => false,
    "error" => $e->getMessage()
  ]);
}

?>