<?php
require_once '../backend/StatusOfReports.php';

header('Content-type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if(!isset($data['accident_id'], $data['status_id'])) {
  echo json_encode([
    'success' => false,
    'message' => 'status data did not sent'
  ]);
  exit;
}

$assignStatus = new StatusOfReports();

$success = $assignStatus->assignStatus(
  $data['accident_id'],
  $data['status_id']
);

echo json_encode([  
  "success" => $data
]);

?>