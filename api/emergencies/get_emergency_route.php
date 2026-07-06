<?php
require_once '../../backend/config.php';
//require_once '../backend/dijkstra.php';
require_once '../../backend/Emergencies.php';
require_once '../../backend/Roads.php';

header("Content-Type: application/json");

$emergency_id = $_GET['emergency_id'] ?? null;
$responder_id = $_GET['responder_id'] ?? null;

if (!$emergency_id || !$responder_id) {
  echo json_encode(["error" => "Missing Parameters"]);
  exit;
}

$emergencies = new Emergencies();
$roads = new Roads();
$conn = (new config())->conn();

$emergency = $emergencies->getEmergencyById($emergency_id);
$responder = $emergencies->getRespondersById($responder_id);

$start = $responder['longitude'] . ',' . $responder['latitude'];
$end = $emergency['longitude'] . ',' . $emergency['latitude'];

$url = "https://router.project-osrm.org/route/v1/driving/$start;$end?overview=full&geometries=geojson";

$response = file_get_contents($url);

if(!$response) {
  echo json_encode(["error" => "ORSM request failed"]);
  exit;
}

$data = json_decode($response, true);

$route = [];

$coordinates = $data['routes'][0]['geometry']['coordinates'];

foreach($coordinates as $coord) {
  $route[] = [
    'lat' => $coord[1],
    'lng' => $coord[0]
  ];
}


echo json_encode([
  "distance" => $data['routes'][0]['distance'],
  "eta" => $data['routes'][0]['duration'],
  "route" => $route
]);

?>