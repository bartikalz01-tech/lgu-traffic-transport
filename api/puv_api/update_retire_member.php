<?php
require_once '../../backend/PublicTransportCoordination.php';

header("Content-Type: application/json");

try {
  $data = json_decode(file_get_contents("php://input"), true);

  if(!isset($data['personnel_id']) || empty($data['personnel_id'])) {
    echo json_encode([
      "status" => "error",
      "message" => "Personnel Id id requried"
    ]);
    exit;
  }

  $ptc = new PublicTransportCoordination();

  $ptc->updateRetireMember($data['personnel_id']);

  echo json_encode([
    "status" => "success",
    "message" => "Personnel retired successfully"
  ]);

} catch(Exception $e) {
  echo json_encode([
    "status" => "error",
    "message" => $e->getMessage()
  ]);
}

?>