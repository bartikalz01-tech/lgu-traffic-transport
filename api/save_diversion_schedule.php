<?php
require_once '../backend/DiversionSchedule.php';

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
  echo json_encode([
    "status" => "error",
    "message" => "Invalid JSON input"
  ]);
  exit;
}

$diversion_id = $data['diversion_id'] ?? null;
$start = $data['start_datetime'] ?? null;
$end = $data['end_datetime'] ?? null;

if (!$diversion_id || !$start || !$end) {
  echo json_encode([
    "status" => "error",
    "message" => "Missing fields"
  ]);
  exit;
}

$schedule = new DiversionSchedule();
$result = $schedule->createSchedule($diversion_id, $start, $end);

echo json_encode([
  "status" => $result ? "success" : "error"
]);

?>