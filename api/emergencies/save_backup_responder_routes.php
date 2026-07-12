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

$emergencyId = $data["emergency_id"] ?? null;
$responders  = $data["responders"] ?? [];

if(!$emergencyId || empty($responders)) {
  echo json_encode([
    "status" => "error",
    "message" => "Missing required fields"
  ]);
  exit;
}

try {
  $emergencies = new Emergencies();

  foreach($responders as $responder) {
    $routeJson = json_encode($responder["route"]);

    $emergencies->saveEmergencyRoutes(
      $emergencyId,
      $responder["responder_id"],
      $responder["distance"],
      $responder["eta"],
      $routeJson,
      1
    );
  }

  echo json_encode([
    "status" => "success",
    "message" => "Backup Responders Deployed"
  ]);

} catch(Exception $e) {
  echo json_encode([
    "status"=>"error",
    "message"=>$e->getMessage()
  ]);
}

?>