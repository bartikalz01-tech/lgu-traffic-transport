<?php
require_once '../backend/Diversion.php';

header("Content-Type: application/json");

$diversion = new Diversion();

try {
  $data = $diversion->activeDiversions();

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