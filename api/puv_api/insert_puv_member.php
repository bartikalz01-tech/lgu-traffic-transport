<?php
require_once '../../backend/PublicTransportCoordination.php';

header("Content-Type: application/json");

try {
  $data = json_decode(file_get_contents("php://input"), true);

  $requiredFields = [
    'puv_group_id',
    'first_name',
    'last_name',
    'birth_date',
    'contact_number',
    'personnel_type',
    'verification_status'
  ];

  foreach($requiredFields as $field) {
    if(empty($data[$field])) {
      throw new Exception("$field is required");
    }
  }

  $ptc = new PublicTransportCoordination();

  $personnelId = $ptc->insertPuvMember(
    $data['first_name'],
    $data['middle_name'] ?? null,
    $data['last_name'],
    $data['birth_date'],
    $data['contact_number'],
    $data['license_number'] ?? null,
    $data['license_type'] ?? null,
    $data['personnel_type'],
    $data['verification_status']
  );

  $ptc->insertPuvGroupMember(
    $data['puv_group_id'],
    $personnelId
  );

  echo json_encode([
    "status" => "success",
    "message" => "PUV added successfully"
  ]);
} catch(Exception $e) {
  echo json_encode([
    "status" => "error",
    "message" => $e->getMessage()
  ]);
}

?>