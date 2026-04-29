<?php
require_once '../backend/config.php';
require_once '../backend/dijkstra.php';
require_once '../backend/Emergencies.php';
require_once '../backend/Roads.php';

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
  "duration" => $data['routes'][0]['duration'],
  "route" => $route
]);

/*$startRoad = $roads->getNearestRoad(
  $responder['latitude'],
  $responder['longitude']
);

$endRoad = $roads->getNearestRoad(
  $emergency['latitude'],
  $emergency['longitude']
);

$graph = buildGraph($conn);

$result = dijkstra(
  $graph,
  $startRoad['road_id'],
  $endRoad['road_id']
);

$coords = $roads->getRoadPathCoordinates($result['path']);

$grouped = [];

foreach ($coords as $c) {
  $grouped[$c['road_id']][] = [
    'lat' => (float)$c['latitude'],
    'lng' => (float)$c['longtitude']
  ];
}

// Build ordered route
$route = [];
$prevPoint = null;

foreach ($result['path'] as $roadId) {
  $points = $grouped[$roadId] ?? [];

  if (empty($points)) continue;

  if ($prevPoint) {
    $first = $points[0];
    $last = end($points);

    $distFirst = hypot(
      $first['lat'] - $prevPoint['lat'],
      $first['lng'] - $prevPoint['lng']
    );

    $distLast = hypot(
      $last['lat'] - $prevPoint['lat'],
      $last['lng'] - $prevPoint['lng']
    );

    if ($distLast < $distFirst) {
      $points = array_reverse($points);
    }
  }

  foreach ($points as $p) {
    $route[] = $p;
  }

  $prevPoint = end($points);
}

echo json_encode([
  "path" => $result['path'],
  "distance" => $result['distance'],
  "route" => $route
]);
*/

?>