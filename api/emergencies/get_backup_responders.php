<?php
require_once "../../backend/Emergencies.php";

header("Content-Type: application/json");

$emergencyId = $_GET["emergency_id"] ?? null;

if(!$emergencyId) {
  echo json_encode([]);
  exit;
}

$emergency = new Emergencies();

echo json_encode(
  $emergency->getBackupsResponders($emergencyId)
);

?>