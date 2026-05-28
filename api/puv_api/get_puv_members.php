<?php
require_once '../../backend/PublicTransportCoordination.php';

header("Content-Type: application/json");

try {

  if(empty($_GET['puv_group_id'])) {
    throw new Exception("PUV Group ID is requried");
  }

  $puvGroupId = $_GET['puv_group_id'];

  $ptc = new PublicTransportCoordination();

  $members = $ptc->getPuvMembersByGroup($puvGroupId);

  echo json_encode([
    "status" => "success",
    "data" => $members
  ]);

} catch(Exception $e) {
  echo json_encode([
    "status" => "error",
    "message" => $e->getMessage()
  ]);
}



?>