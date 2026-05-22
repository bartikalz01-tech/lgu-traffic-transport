<?php
require_once '../../backend/PublicTransportCoordination.php';

header("Content-Type: application/json");

$puvGroups = new PublicTransportCoordination();

try {
  $data = $puvGroups->getPuvGroups();

  echo json_encode([
    "status" => "success",
    "data" => $data
  ]);
} catch(Exception $e) {
  echo json_encode([
    "status" => "error",
    "message" => $e->getMessage()
  ]);
}

?>