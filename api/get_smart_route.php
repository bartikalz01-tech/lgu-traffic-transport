<?php
require_once '../backend/RoadConnections.php';

header('Content-Type: application/json');

$start = $_GET['start'];
$end = $_GET['end'];

$conn = new RoadConnections();

$route = $conn->findRoute($start, $end);

echo json_encode($route);

?>