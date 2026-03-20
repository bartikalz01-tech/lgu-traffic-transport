<?php
require_once '../backend/RoadMapEvents.php';

header('Content-Type: application/json');

$events = new RoadMapEvents();
$data = $events->getEvents();

echo json_encode($data);

?>
