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
$responders = $data['responders'] ?? [];

if(
  !$emergencyId ||
  empty($responders)
) {
  echo json_encode([
    "status" => "error",
    "message" => "Missing required fields"
  ]);
  exit;
}

try {

  $emergencies = new Emergencies();

  foreach($responders as $responder) {

    $responderId = $responder['responder_id'] ?? null;
    $distance = $responder['distance'] ?? null;
    $eta = $responder['eta'] ?? null;
    $route = $responder['route'] ?? [];
    $selected = 1;

    if(
      !$responderId ||
      !$distance ||
      !$eta ||
      empty($route)
    ) {
      continue;
    }

    $routeJson = json_encode($route);

    $emergencies->saveEmergencyRoutes(
      $emergencyId,
      $responderId,
      $distance,
      $eta,
      $routeJson,
      $selected
    );
  }

  $emergencies->updateEmergencyStatus(
    $emergencyId,
    'assigned'
  );

  echo json_encode([
    "status" => "success",
    "message" => "Emergency routes saved successfully"
  ]);

} catch(Exception $e) {

  echo json_encode([
    "status" => "error",
    "message" => $e->getMessage()
  ]);
}
?>