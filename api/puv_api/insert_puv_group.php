<?php
require_once '../../backend/PublicTransportCoordination.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if(!$data) {
  echo json_encode([
    "status" => "error",
    "message" => "Invalide payload"
  ]);
  exit;
}

if(
  empty($data['puv_group_name']) ||
  empty($data['puv_vehicle_type']) ||
  empty($data['latitude']) ||
  empty($data['longitude'])
) {

  echo json_encode([
    "status" => "error",
    "message" => "Missing required fields"
  ]);

  exit;
}

$puvGroup = new PublicTransportCoordination();

$latitude = (float)$data['latitude'];
$longitude = (float)$data['longitude'];

try {
  $puvGroupId = $puvGroup->insertPuvGroup(
    $data['puv_group_name'],
    $data['puv_group_address'],
    $data['puv_vehicle_type'],
    $latitude,
    $longitude
  );

  echo json_encode([
    "status" => "success",
    "puv_group_id" => $puvGroupId
  ]);
} catch(Exception $e) {
  echo json_encode([
    "status" => "error",
    "message" => $e->getMessage()
  ]);
}

?>