<?php
require_once '../backend/config.php';
require_once '../backend/dijkstra.php';

header("Content-Type: application/json");

$conn = (new config())->conn(); 

$start = $_GET['start'] ?? null;
$end = $_GET['end'] ?? null;

if(!$start || !$end) {
  echo json_encode(["error" => "Missing parameters"]);
  exit;
}

$graph = buildGraph($conn);

$result = dijkstra($graph, $start, $end);

echo json_encode($result);

?>