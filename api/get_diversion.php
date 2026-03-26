<?php
require_once '../backend/RoadMapStatus.php';

header('Content-Type: application/json');

$road_id = $_GET['road_id'];

$diversion = new RoadMapStatus();

$data = $diversion->roadDiversionCoordinates($road_id);

echo json_encode($data);
?>