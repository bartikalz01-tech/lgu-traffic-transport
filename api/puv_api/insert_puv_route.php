<?php
require_once "../../backend/PublicTransportCoordination.php";

header("Content-Type: application/json");

try {
  $data = json_decode(file_get_contents("php://input"), true);

  $puvGroupId = $data['puv_group_id'] ?? null;
  $destinationName = $data['destination_name'] ?? '';
  $exitNodeId = $data['exit_node_id'] ?? null;
  $routeType = $data['route_type'] ?? 'current';

  $routeJson = json_encode(
    $data['route_json'],
    JSON_UNESCAPED_UNICODE
  );

  $ptc = new PublicTransportCoordination();

  $ptc->insertPuvRoute($puvGroupId, $destinationName, $exitNodeId, $routeJson, $routeType);

  echo json_encode([
    'status' => 'success',
    'message' => 'Route saved successfully'
  ]);

} catch(Exception $e) {

  echo json_encode([
    'status' => 'error',
    'message' => $e->getMessage()
  ]);
}

?>