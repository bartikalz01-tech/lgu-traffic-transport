<?php 
require_once '../backend/Accidents.php';
require_once '../backend/AccidentPeoples.php';
require_once '../backend/AccidentVehicles.php';

header('Content-type: application/json');

$accidents = new Accidents();
$accidentPeoples = new AccidentPeoples();
$accidentVehicles = new AccidentVehicles();

$accidentCases = $accidents->getAccidentCases();

$data = [];

foreach($accidentCases as $accident) {

  $accident_id = (int) $accident['accident_id'];

  $peopleData = $accidentPeoples->getTotalAccidentPeoples($accident_id);
  $vehicleData = $accidentVehicles->getTotalAccidentVehicles($accident_id);

  $data[] = [
    'accident_id' => $accident_id,
    'public_accident_id' => $accident['public_accident_id'],
    'road_name' => $accident['road_name'],
    'accident_type' => $accident['accident_type'],
    'status_of_investigation' => $accident['status_of_investigation'],
    'date_of_accident' => $accident['date_of_accident'],
    'time_of_accident' => $accident['time_of_accident'],
    'total_people' => (int) ($peopleData['total_people'] ?? 0),
    'total_vehicles' => (int) ($vehicleData['total_vehicles'] ?? 0)
  ];
}

echo json_encode([
  'success' => true,
  'data' => $data
]);
?>