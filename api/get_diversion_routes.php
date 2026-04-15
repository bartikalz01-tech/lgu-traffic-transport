<?php
require_once '../backend/Diversion.php';

header('Content-Type: application/json');

$diversion = new Diversion();

if(!isset($_GET['diversion_id'])) {
  echo json_encode([
    "status" => "error",
    "message" => "Missing ID"
  ]);
  exit;
}

$id = $_GET['diversion_id'];

try {
  $data = $diversion->getDiversionRoutesDetails($id);

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