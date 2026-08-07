<?php
require_once '../../backend/RoadMapStatus.php';

header("Content-Type: application/json");

$road = new RoadMapStatus();

echo json_encode($road->trafficTrendLogs());

?>