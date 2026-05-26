<?php
require_once '../../backend/Diversion.php';

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if(!$data) {
  echo json_encode([
    "success" => false,
    "message" => "Invalid Payload"
  ]);
  exit;
}

try {
  $diversions = new Diversion();

  $conn = $diversions->conn();

  $conn->beginTransaction();

  $diversion_id = $data['diversion_id'] ?? null;

  if(!$diversion_id) {
    echo json_encode([
      "success" => false,
      "message" => "Missing diversion_id" 
    ]);
    exit;
  }

  $diversions->deleteDiversionDetails($diversion_id);
  $diversions->deleteDiversion($diversion_id);

  $conn->commit();

  echo json_encode([
    "success" => true,
    "message" => "Diversion deleted successfully"
  ]);
  
} catch(Exception $e) {
   if(isset($conn)) {
      $conn->rollBack();
    }

  echo json_encode([
    "success" => false,
    "message" => $e->getMessage()
  ]);
}

?>