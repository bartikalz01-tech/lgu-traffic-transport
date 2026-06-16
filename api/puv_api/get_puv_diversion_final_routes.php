<?php

require_once '../../backend/PublicTransportCoordination.php';

header("Content-Type: application/json");

$groupId = $_GET['puv_group_id'] ?? null;

try {

  $ptc = new PublicTransportCoordination();

  $route = $ptc->getPuvDiversionRoute(
    $groupId
  );

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