<?php
require_once '../backend/Officers.php';

header('Content-type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if(!isset($data['accident_id'], $data['officer_id'])) {
  echo json_encode([
    "success" => false,
    "message" => "Invalid officer data"
  ]);
  exit;
}

$assignOfficer = new Officers();

$success = $assignOfficer->assignedOfficerToAccident(
  $data['accident_id'],
  $data['officer_id']
);

echo json_encode([
  "success" => $success
]);
?>