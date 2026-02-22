<?php
require_once '../backend/GetTicket.php';

header("Content-Type: application/json");

$accidentId = (int) ($_GET['accident_id'] ?? 0);

$ticket = new GetTicket();

if(!$accidentId) {
  echo json_encode([
    "success" => false,
    "message" => "Ticket details not fetched"
  ]);
  exit;
}

$accidentTckDetails = $ticket->getAccidentTicketDetails($accidentId);

echo json_encode([
  "success" => true,
  "data" => $accidentTckDetails
]);

?>