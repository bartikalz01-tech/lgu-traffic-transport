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

/*
|--------------------------------------------------------------------------
| OSRM REQUEST
|--------------------------------------------------------------------------
*/

$ch = curl_init();

curl_setopt_array($ch, [
  CURLOPT_URL => $url,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_TIMEOUT => 15,
  CURLOPT_CONNECTTIMEOUT => 10,
  CURLOPT_HTTPHEADER => [
    'User-Agent: LGU-Traffic-Transport/1.0'
  ]
]);

$response = curl_exec($ch);

$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);

curl_close($ch);

if ($response === false) {
  echo json_encode([
    "error" => "OSRM request failed",
    "message" => $curlError
  ]);
  exit;
}

if ($httpCode !== 200) {
  echo json_encode([
    "error" => "OSRM request failed",
    "http_code" => $httpCode
  ]);
  exit;
}

/*
|--------------------------------------------------------------------------
| DECODE OSRM RESPONSE
|--------------------------------------------------------------------------
*/

$data = json_decode($response, true);

if (!$data) {
  echo json_encode([
    "error" => "Invalid OSRM response"
  ]);
  exit;
}

if (!isset($data['routes'][0])) {
  echo json_encode([
    "error" => "No route found"
  ]);
  exit;
}

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