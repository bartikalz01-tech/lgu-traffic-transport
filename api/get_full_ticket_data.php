<?php
require_once '../backend/GetTicket.php';

if(!isset($_GET['accident_id'])) {
  echo json_encode([
    "error" => 'Missing accident_id',
  ]);
  exit;
}

header("Content-Type: application/json");

$accidentId = (int) ($_GET['accident_id'] ?? 0);

$getTicket = new GetTicket();
$data = $getTicket->getFullTicketData($accidentId);

echo json_encode([
  "success" => true,
  "data" => $data
]);
?>
