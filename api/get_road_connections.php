<?php
require_once '../backend/RoadMapStatus.php';

header('Content-Type: application/json');

$roadMap = new RoadMapStatus();

$data = $roadMap->getRoadConnection();

echo json_encode($data);

?>