<?php
require_once '../backend/RoadMapStatus.php';

header('Content-type: application/json');

$roadMap = new RoadMapStatus();
$data = $roadMap->roadStatusMap();

$grouped = [];

foreach($data as $row) {
  $road_id = $row['road_id'];

  if(!isset($grouped[$road_id])) {
    $grouped[$road_id] = [
      "road_id" => $road_id,
      "road_name" => $row['road_name'],
      "traffic_level" => $row['traffic_level'] ?? "low",
      "coordinates" => []
    ];
  }

  $grouped[$road_id]["coordinates"][] = [
    (float)$row['latitude'],
    (float)$row['longtitude']
  ];
}

echo json_encode(array_values($grouped));

?>