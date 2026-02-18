<?php
require_once '../backend/AccidentPeoples.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

$accidentPplId = $data['accident_ppl_id'] ?? null;

if(!$accidentPplId) {
  echo json_encode([
    "success" => false,
  ]);
  exit;
}

try {
  $delete = new AccidentPeoples();
  $deletePpl = $delete->deleteAccidentPeople($accidentPplId);

  echo json_encode([
    "success" => $deletePpl
  ]);

} catch(Exception $e) {
  echo json_encode([
    "success" => false,
    "error" => $e->getMessage()
  ]);
}

?>