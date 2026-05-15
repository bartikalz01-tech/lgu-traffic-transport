<?php

/*error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../backend/Routing.php';
require_once '../backend/Diversion.php';

header('Content-Type: application/json');

$start = isset($_GET['start']) ? (int)$_GET['start'] : null;
$end   = isset($_GET['end']) ? (int)$_GET['end'] : null;

if (!$start || !$end) {
  echo json_encode([
    "status" => "error",
    "message" => "Invalid start or end"
  ]);
  exit;
}

$routing = new Routing();
$diversion = new Diversion();

$highTrafficRoads = $routing->getHighTrafficRoads();

// 🚫 true = avoid high traffic completely
$graph = $routing->buildGraph(true);

if (empty($graph)) {
  echo json_encode([
    "status" => "error",
    "message" => "Graph is empty"
  ]);
  exit;
}

$result = $routing->dijkstra($graph, $start, $end);

if (empty($result['path']) || $result['distance'] === INF) {
  echo json_encode([
    "status" => "error",
    "message" => "No route found"
  ]);
  exit;
}

$coords = $routing->getCoordsFromPath($result['path']);

$osrm = $routing->getOSRMRoute($coords);

if (!$osrm || empty($osrm['routes'])) {
  echo json_encode([
    "status" => "error",
    "message" => "OSRM Failed"
  ]);
  exit;
}

$path = $result['path'];

//$points = $routing->formatOSRMToPoints($osrm);
$points = $routing->formatCoordsWithRoads($path, $coords);

$startNodeRoads = $routing->getRoadsConnectedToNode($start);
$endNodeRoads = $routing->getRoadsConnectedToNode($end);

$startRoad = $routing->getRoadBetweenNodes(
  $path[0],
  $path[1]
);

$endRoad = $routing->getRoadBetweenNodes(
  $path[count($path) - 2],
  $path[count($path) - 1]
);

if(!$startRoad || !$endRoad) {
  echo json_encode([
    "status" => "error",
    "message" => "Invalid start/end roads"
  ]);
  exit;
}

$highTrafficIds = [];

foreach($highTrafficRoads as $road) {
  $highTrafficIds[] = $road['road_id'];
}

echo json_encode([
  "status" => "success",
  "data" => [
    "high_traffic_roads" => $highTrafficIds,
    "start_node_roads" => $startNodeRoads,
    "end_node_roads" => $endNodeRoads,
    "start_road" => $startRoad,
    "end_road" => $endRoad,
    "path" => $result['path'],
    "distance" => $result['distance'],
    "points" => $points
  ]
]);*/

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../backend/Routing.php';
require_once '../backend/Diversion.php';

header('Content-Type: application/json');

$start = isset($_GET['start']) ? (int)$_GET['start'] : null;
$end   = isset($_GET['end']) ? (int)$_GET['end'] : null;

if (!$start || !$end) {
  echo json_encode([
    "status" => "error",
    "message" => "Invalid start or end"
  ]);
  exit;
}

$routing = new Routing();
$diversion = new Diversion();

$highTrafficRoads = $routing->getHighTrafficRoads();

$routes = $routing->generateAlternativeRoutes($start, $end);

if (empty($routes)) {
  echo json_encode([
    "status" => "error",
    "message" => "No routes found"
  ]);
  exit;
}

$highTrafficIds = [];

foreach($highTrafficRoads as $road) {
  $highTrafficIds[] = $road['road_id'];
}

$finalRoutes = [];

foreach($routes as $index => $result) {

  $path = $result['path'];

  if(count($path) < 2) {
    continue;
  }

  $coords = $routing->getCoordsFromPath($path);

  /*$osrm = $routing->getOSRMRoute($coords);

  if(!$osrm || empty($osrm['routes'])) {
    continue;
  }*/
  $osrmDistance = $result['distance'] * 111;

  $points = $routing->formatCoordsWithRoads($path, $coords);

  $startNodeRoads = $routing->getRoadsConnectedToNode($start);

  $endNodeRoads = $routing->getRoadsConnectedToNode($end);

  $startRoad = $routing->getRoadBetweenNodes(
    $path[0],
    $path[1]
  );

  $endRoad = $routing->getRoadBetweenNodes(
    $path[count($path) - 2],
    $path[count($path) - 1]
  );

  $finalRoutes[] = [
    "plan_id" => $index + 1,

    "high_traffic_roads" => $highTrafficIds,

    "start_node_roads" => $startNodeRoads,

    "end_node_roads" => $endNodeRoads,

    "start_road" => $startRoad,

    "end_road" => $endRoad,

    "path" => $path,

    //"distance" => round($osrm['routes'][0]['distance'] / 1000, 2),
    "distance" => round($osrmDistance, 2),

    //"estimated_time" => round($osrm['routes'][0]['duration'] / 60, 1),
    "estimated_time" => round(($osrmDistance / 30) * 60, 1),

    "points" => $points
  ];
}

echo json_encode([
  "status" => "success",
  "total_routes" => count($finalRoutes),
  "data" => $finalRoutes
]);

?>