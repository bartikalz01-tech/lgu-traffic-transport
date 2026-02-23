<?php
require_once '../backend/config.php';
require_once '../backend/InsertViolationCase.php';

header("Content-Type: application/json");

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data || !isset($data['violation'])) {
  echo json_encode([
    "success" => false,
    "message" => "Invalid JSON payload",
    "received" => $raw
  ]);
  exit;
}

$config = new config();
$conn = $config->conn();

try {
  $conn->beginTransaction();

  $violationObj = new InsertViolationCase();

  $violationId = $violationObj->insertViolation(
    $data['violation']['public_violation_id'],
    $data['violation']['road_id'],
    $data['violation']['violation_type'],
    $data['violation']['violation_description'],
    $data['violation']['date_of_violation'],
    $data['violation']['time_of_violation']
  );

  $conn->commit();

  echo json_encode(["success" => true]);

} catch(Exception $e) {
  $conn->rollBack();
  echo json_encode([
    "success" => false,
    "message" => $e->getMessage()
  ]);
}

?>