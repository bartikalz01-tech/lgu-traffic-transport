<?php
require_once '../backend/Diversion.php';

header("Content-Type: application/json");

// 🔴 ADD THIS (VERY IMPORTANT)
error_reporting(0);
ini_set('display_errors', 0);

if(!isset($_GET['diversion_id'])) {
  echo json_encode([
    "status" => "error",
    "message" => "Missing diversion_id"
  ]);
  exit;
}

$id = $_GET['diversion_id'];

$diversion = new Diversion();

try {
  $data = $diversion->getDiversionActiveDetails($id);

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