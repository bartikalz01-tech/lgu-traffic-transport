<?php
require_once '../backend/Diversion.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

$start = $data['startRoad'];
$end = $data['endRoad'];
//$date = $data['scheduleDate'];
$points = $data['points'];

$diversion = new Diversion();

$diversion_id = $diversion->createDiversion($start, $end);

$diversion->insertRouteDetails($diversion_id, $points);

echo json_encode([
  "status" => "success",
  "diversion_id" => $diversion_id
]);

?>