<?php
require_once '../backend/Diversion.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if(!$data) {
  echo json_encode([
    "status" => "error",
    "message" => "Invalid payload"
  ]);
}

$diversion = new Diversion();

try {
  $diversionId = $diversion->createDiversion(
    $data['start_road_id'],
    $data['end_road_id'],
    $data['route_config'],
    $data['distance'],
    $data['vehicle_per_min'],
    $data['avg_speed']
  );

  $diversion->insertRouteDetails(
    $diversionId,
    $data['points']
  );

  echo json_encode([
    "status" => "success",
    "diversion_id" => $diversionId
  ]);
} catch(Exception $e) {
  echo json_encode([
    "status" => "error",
    "message" => $e->getMessage()
  ]);
}

?>