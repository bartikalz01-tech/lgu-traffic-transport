<?php
require_once '../../backend/PublicTransportCoordination.php';

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

try {
  $ptc = new PublicTransportCoordination();

  $ptc->insertPuvRoute(
    $data["puv_group_id"],
    $data["destination_name"],
    $data["exit_node_id"],
    $data["route_json"],
    $data["route_type"],
    $data["route_signature"]
  );

  echo json_encode([
    "status" => "success"
  ]);
} catch(Exception $e) {
   echo json_encode([
    "status" => "error",
    "message" => $e->getMessage()
  ]);
}
?>