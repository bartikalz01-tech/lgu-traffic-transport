<?php

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

$results = [];

foreach ($highTrafficRoads as $road) {
  $road_id = $road['road_id'];

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

  $points = $routing->formatOSRMToPoints($osrm);

  $path = $result['path'];

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
    continue;
  }

  $results[] = [
    "traffic_road_id" => $road_id,
    "start_node_roads" => $startNodeRoads,
    "end_node_roads" => $endNodeRoads,
    "start_road" => $startRoad,
    "end_road" => $endRoad,
    "path" => $result['path'],
    "distance" => $result['distance'],
    //"coords" => $coords,
    "points" => $points
  ];
}

echo json_encode([
  "status" => "success",
  "data" => $results
]);

/*echo json_encode([
  "status" => "success",
  "data" => [
    "diversion_id" => $diversion_id,
    "distance" => $result['distance'],
    "points_count" => count($points)
  ]
]);*/

/*require_once '../backend/Routing.php';
require_once '../backend/Diversion.php';

$routing = new Routing();
$diversion = new Diversion();

// 🔹 1. GET HIGH TRAFFIC ROADS
$highRoads = $routing->getHighTrafficRoads();

foreach ($highRoads as $road) {

  $road_id = $road['road_id'];

  // 🔹 GET ALL NODES OF ROAD
  $nodes = $routing->getNodesFromRoad($road_id);

  if (count($nodes) < 1) continue;

  // 🔹 FLATTEN nodes into list
  $nodeList = [];
  foreach ($nodes as $n) {
    $nodeList[] = $n['start_node'];
    $nodeList[] = $n['end_node'];
  }

  // remove duplicates
  $nodeList = array_values(array_unique($nodeList));

  if (count($nodeList) < 2) continue;

  // 🔹 PICK ENTRY & EXIT NODE
  $start = null;
  $end   = null;

  foreach($nodes as $n) {
    $start = $n['start_node'];
    $end   = $n['end_node']; 
    break;
  }

  // 🔹 BUILD GRAPH (avoid high)
  $graph = $routing->buildGraph(true);

  // 🔹 FIND DIVERSION
  $result = $routing->dijkstra($graph, $start, $end);

  if ($result['distance'] === INF || count($result['path']) < 2) continue;

  $path = $result['path'];

  // 🔹 COORDS
  $fullCoords = $routing->getCoordsFromPath($path);

  $coords = [
    $fullCoords[0],
    $fullCoords[count($fullCoords) - 1]
  ];

  // 🔹 OSRM
  $osrm = $routing->getOSRMRoute($coords);
  if (!$osrm) continue;

  $points = $routing->formatOSRMToPoints($osrm);

  // 🔹 GET START/END ROAD PROPERLY
  $path = $result['path'];

  $startRoad = $routing->getRoadBetweenNodes($path[0], $path[1]);
  $endRoad   = $routing->getRoadBetweenNodes(
    $path[count($path)-2],
    $path[count($path)-1]
  );

  if (!$startRoad || !$endRoad) continue;

  // 🔹 SAVE (ONLY ONCE PER ROAD)
  $diversion_id = $diversion->createDiversion($startRoad, $endRoad, $result['distance']);

  $diversion->insertRouteDetails($diversion_id, $points);
}

echo "Auto diversion generated";


foreach ($highRoads as $road) {

  $road_id = $road['road_id'];

  // 🔹 2. GET NODES OF THAT ROAD
  $nodes = $routing->getNodesFromRoad($road_id);

  foreach ($nodes as $n) {

    $start = $n['start_node'];
    $end   = $n['end_node'];

    // 🔹 3. BUILD GRAPH (AVOID HIGH)
    $graph = $routing->buildGraph(true);

    // 🔹 4. FIND NEW ROUTE
    $result = $routing->dijkstra($graph, $start, $end);

    if ($result['distance'] === INF) continue;

    // 🔹 5. GET COORDS
    $coords = $routing->getCoordsFromPath($result['path']);

    // 🔹 6. OSRM
    $osrm = $routing->getOSRMRoute($coords);
    if (!$osrm) continue;

    $points = $routing->formatOSRMToPoints($osrm);

    $path = $result['path'];

    $startRoad = $routing->getRoadBetweenNodes($path[0], $path[1]);
    $endRoad   = $routing->getRoadBetweenNodes(
      $path[count($path)-2],
      $path[count($path)-1]
    );

    // 🔹 7. SAVE
    $diversion_id = $diversion->createDiversion($startRoad, $endRoad, $result['distance']);

    $diversion->insertRouteDetails($diversion_id, $points);
  }
}*/





/*$highRoads = $routing->getHighTrafficRoads();

$results = [];

foreach($highRoads as $road) {
  $road_id = $road['road_id'];

  $nodes = $routing->getNodesFromRoad($road_id);

  if(count($nodes) < 1) continue;

  $entry= null;
  $exit = null;

  foreach($nodes as $n) {
    $startNode = $n['start_node'];
    $endNode = $n['end_node'];

    if($routing->getConnectedRoads($startNode) > 1) {
      $entry = $startNode;
    }

    if($routing->getConnectedRoads($endNode) > 1) {
      $exit = $endNode;
    }
  }

  if(!$entry || !$exit) continue;

  $graph = $routing->buildGraph(true);

  $result = $routing->dijkstra($graph, $entry, $exit);

  if($result['distance'] === INF || count($result['path']) < 2) continue;

  $coords = $routing->getCoordsFromPath($result['path']);

  $osrm = $routing->getOSRMRoute($coords);
  if(!$osrm) continue;

  $points = $routing->formatOSRMToPoints($osrm);

  // Will delete later

  $path = $result['path'];

  $startRoad = $routing->getRoadBetweenNodes($path[0], $path[1]);
  $endRoad = $routing->getRoadBetweenNodes(
    $path[count($path) - 2],
    $path[count($path) - 1]
  );

  if(!$startRoad || !$endRoad) continue;

  $diversion_id = $diversion->createDiversion(
    $startRoad,
    $endRoad,
    $result['distance']
  );

  $diversion->insertRouteDetails($diversion_id, $points);

  // end of that logic

  $results[] = [
    "road_id" => $road_id,
    "entry" => $entry,
    "exit" => $exit,
    "distance" => $result['distance'],
    "coords" => $coords,
    "points" => $points
  ];
}

// HERE NEXUS THE RETURNED JSON_ENCODE I WANT THIS RESULT

echo json_encode([
  "status" => "success",
  "data" => $results
]);*/
