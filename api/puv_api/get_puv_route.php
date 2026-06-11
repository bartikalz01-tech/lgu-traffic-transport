<?php
require_once "../../backend/PublicTransportCoordination.php";

header("Content-Type: application/json");

try {
  $puvGroupId = $_GET['puv_group_id'] ?? null;

  $ptc = new PublicTransportCoordination();

  $route = $ptc->getPuvCurrentRoute($puvGroupId);

  echo json_encode([
    "status" => "success",
    "data" => $route
  ]);
} catch(Exception $e) {
  echo json_encode([
    "status" => "error",
    "message" => $e->getMessage()
  ]);
}

?>