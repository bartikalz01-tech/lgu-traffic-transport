<?php
require_once '../../backend/PublicTransportCoordination.php';

header('Content-Type: application/json');

try {
  $data = json_decode(file_get_contents("php://input"), true);

  $personnelId = $data['personnel_id'];
  $groupId = $data['puv_group_id'];

  $vehicleNumber = trim($data['vehicle_number']);

  $plateNumber = trim($data['plate_number']);

  $ptc = new PublicTransportCoordination();

  $vehicle = $ptc->getVehicleByNumberAndPlate($groupId, $vehicleNumber, $plateNumber);

  if($vehicle) {
    $vehicleId = $vehicle['vehicle_id'];
  } else {
    $vehicleId = $ptc->insertPuvVehicle($groupId, $vehicleNumber, $plateNumber);
  }

  $ptc->assignVehicleToMember($personnelId, $vehicleId);

  echo json_encode([
    "status" => "success",
    "message" => "Vehicle assigned successfully"
  ]);
} catch(Exception $e) {
  echo json_encode([
    "status" => "error",
    "message" => $e->getMessage() 
  ]);
}

?>