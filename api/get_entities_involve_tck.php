<?php
require_once '../backend/GetTicket.php';

header('Content-Type: application/json');

$accidentId = (int) ($_GET['accident_id'] ?? 0);

$ticketEntity = new GetTicket();

if(!$accidentId) {
  echo json_encode([
    'success' => false,
    'message' => 'Invalid accident id'
  ]);
  exit;
}

$data = $ticketEntity->entitiesInvolvedAccident($accidentId);

echo json_encode([
  'success' => true,
  'data' => $data
]);

?>