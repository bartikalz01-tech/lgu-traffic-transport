<?php
require_once '../../backend/PublicTransportCoordination.php';

header("Content-Type: application/json");

try {
  $data = json_decode(file_get_contents("php://input"), true);

  if(!isset($data['personnel_id']) || empty($data['personnel_id'])) {
    echo json_encode([
      "status" => "error",
      "message" => "Personnel ID is required"
    ]);
    exit;
  }

  $ptc = new PublicTransportCoordination();

  $ptc->updateMemberDetails(
    $data['personnel_id'],
    $data['first_name'],
    $data['middle_name'],
    $data['last_name'],
    $data['birth_date'],
    $data['contact_number'],
    $data['license_number'] ?? '',
    $data['license_type'] ?? ''
  );
  
  echo json_encode([
    "status" => "success",
    "message" => "Member updated successfully"
  ]);
  
} catch(Exception $e) {
  echo json_encode([
    "status" => "error",
    "message" => $e->getMessage()
  ]);
}


?>