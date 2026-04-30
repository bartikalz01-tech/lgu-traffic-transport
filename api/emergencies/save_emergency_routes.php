<?php
require_once '../../backend/Emergencies.php';

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if(!$data) {
  echo json_encode([
    "status" => "error",
    "message" => "No emergency routes data received"
  ]);
  exit;
}

$emergencyId = $data['emergency_id'] ?? null;
$responderId = $data['responder_id'] ?? null;
$distance = $data['distance'] ?? null;
$eta = $data['eta'] ?? null;
$route = $data['route'] ?? [];
$selected = 1;

if(
  !$emergencyId ||
  !$responderId ||
  !$distance ||
  !$eta ||
  empty($route)
) {
  echo json_encode([
    "status" => "error",
    "message" => "Missing required fields"
  ]);
  exit;
}

$routeJson = json_encode($route);

try {
  $emergencies = new Emergencies();

  $saveEmergencyRoute = $emergencies->saveEmergencyRoutes(
    $emergencyId,
    $responderId,
    $distance,
    $eta,
    $routeJson,
    $selected
  );

  echo json_encode([
    "status" => "success",
    "message" => "Emergency route saved successfully",
    "emergency_route_id" => $saveEmergencyRoute
  ]);
} catch(Exception $e) {
  echo json_encode([
    "status" => "error",
    "message" => $e->getMessage()
  ]);
}
?>