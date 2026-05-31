<?php

require_once '../../backend/PublicTransportCoordination.php';

header('Content-Type: application/json');

try {

  if(empty($_GET['group_id'])) {
    throw new Exception("Group ID is required");
  }

  $groupId = $_GET['group_id'];

  $ptc = new PublicTransportCoordination();

  $vehicles = $ptc->getVehiclesByGroup(
    $groupId
  );

  echo json_encode([
    "status" => "success",
    "data" => $vehicles
  ]);

} catch(Exception $e) {

  echo json_encode([
    "status" => "error",
    "message" => $e->getMessage()
  ]);
}

?>