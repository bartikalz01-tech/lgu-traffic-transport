<?php
require_once '../../backend/RoadMapStatus.php';

header("Content-Type: application/json");

$roadStatus = new RoadMapStatus();

$data = $roadStatus->roadStatusCctv();

echo json_encode($data);

?>