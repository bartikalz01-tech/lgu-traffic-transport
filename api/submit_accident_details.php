<?php 
require_once '../backend/config.php';
require_once '../backend/InsertAccidentCase.php';
require_once '../backend/InsertPeopleInvolved.php';
require_once '../backend/InsertVehicles.php';
require_once '../backend/InsertAccidentPeoples.php';
require_once '../backend/InsertAccidentVehicles.php';

header("Content-Type: application/json");

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data || !isset($data['accident'])) {
  echo json_encode([
    "success" => false,
    "message" => "Invalid JSON payload",
    "received" => $raw
  ]);
  exit;
}

$config = new config();
$conn = $config->conn();

try {
  $conn->beginTransaction();

  $accidentObj = new InsertAccidentCase();
  $accident_id = $accidentObj->insertAccident(
    $data['accident']['public_accident_id'],
    $data['accident']['road_id'],
    $data['accident']['accident_type'],
    $data['accident']['accident_description'],
    $data['accident']['status_of_accident'],
    $data['accident']['time_of_accident'],
    $data['accident']['date_of_accident']
  );

  $peopleObj = new InsertPeopleInvolved();
  $accidentPeopleObj = new InsertAccidentPeoples();

  $peopleMap = [];

  foreach($data['people'] as $p) {
    $people_id = $peopleObj->insertPeople(
      $p['full_name'],
      $p['contact_num'],
      $p['address']
    );

    $peopleMap[$p['full_name']] = $people_id;

    $accidentPeopleObj->insertAccidentPeoples(
      $accident_id,
      $people_id,
      $p['role'],
      $p['status_level']
    );
  }

  $vehiclesObj = new InsertVehicles();
  $accidentVehicleObj = new InsertAccidentVehicles();

  foreach($data['vehicles'] as $v) {
    if(!isset($peopleMap[$v['driver_name']])) {
      throw new Exception("Driver not found: " . $v['driver_name']);
    }

    $driver_people_id = $peopleMap[$v['driver_name']];

    $vehicle_id = $vehiclesObj->insertVehicles(
      $v['vehicle_name'],
      $v['plate_number']
    );

    $accidentVehicleObj->insertAccidentVehicles(
      $accident_id,
      $driver_people_id,
      $vehicle_id,
      $v['damage_level']
    );
  }

  $conn->commit();

  echo json_encode(["success" => true]);

} catch(Exception $e) {
  $conn->rollBack();
  echo json_encode([
    "success" => false,
    "message" => $e->getMessage()
  ]);
}

?>