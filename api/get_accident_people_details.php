<?php
require_once '../backend/AccidentPeoples.php';

header('Content-type: application/json');

$accidentId = (int) ($_GET['accident_id'] ?? 0);

$accidentPeoplesDetails = new AccidentPeoples();

if(!$accidentId) {
  echo json_encode([
    'success' => false,
    'message' => 'Invalid accident ID'
  ]);
  exit;
}

$data = $accidentPeoplesDetails->getPeopleAccidentDetails($accidentId);

echo json_encode([
  'success' => true,
  'data' => $data
]);

?>