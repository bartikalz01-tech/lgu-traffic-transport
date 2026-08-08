<?php
require_once '../../backend/RoadMapStatus.php';

header("Content-Type: application/json");

try {

  $roadMapStatus = new RoadMapStatus();

  echo json_encode(
    $roadMapStatus->averageSpeedHistoryLogs()
  );

} catch (Exception $e) {

  http_response_code(500);

  echo json_encode([
    "error" => $e->getMessage()
  ]);
}

?>