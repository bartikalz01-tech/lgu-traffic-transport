<?php
require_once '../../backend/PublicTransportCoordination.php';

header("Content-Type: application/json");

try {
  if(empty($_GET['puv_group_id'])) {
    throw new Exception("PUV group ID is required");
  }

  $puvGroupId = $_GET['puv_group_id'];

  $ptc = new PublicTransportCoordination();

  $retiredMembers = $ptc->getRetiredPuvMembers($puvGroupId);

  echo json_encode([
    "status" => "success",
    "data" => $retiredMembers
  ]);
} catch(Exception $e) {
  echo json_encode([
    "status" => "error",
    "message" => $e->getMessage()
  ]);
}


?>