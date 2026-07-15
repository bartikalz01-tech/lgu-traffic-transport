<?php
require_once '../../backend/Diversion.php';

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if(!$data) {
  echo json_encode([
    "status" => "error",
    "message" => "Invalid Payload"
  ]);
  exit;
}

try {

  $diversions = new Diversion();

  $conn = $diversions->conn();

  $conn->beginTransaction();

  $diversion_id = $data['diversion_id'] ?? null;
  $route_config = $data['route_config'] ?? null;
  $route_signature = $data['route_signature'] ?? null;
  $distance = $data['distance'] ?? null;
  $points = $data['points'] ?? [];

  /*if(!$diversion_id || !$route_config || !$route_signature || !$distance || empty($points)) {
    echo json_encode([
      "success" => false,
      "message" => "Missing required fields"
    ]);
    exit;
  }*/

  if(!$diversion_id) {
    echo json_encode([
      "success" => false,
      "message" => "Missing diversion id."
    ]);
    exit;
  }

  $diversions->updateDiversion(
    $diversion_id,
    $route_config,
    $route_signature,
    $distance
  );

  if(!empty($points)) {
    $diversions->deleteDiversionDetails($diversion_id);

    $diversions->insertRouteDetails($diversion_id, $points);
  }

  $conn->commit();

  echo json_encode([
    "success" => true,
    "message" => "Diversion updated successfully"
  ]);

} catch(Exception $e) {

  if(isset($conn)) {
    $conn->rollBack();
  }

  echo json_encode([
    "success" => false,
    "message" => $e->getMessage()
  ]);
}

?>