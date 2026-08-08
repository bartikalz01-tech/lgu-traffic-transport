<?php
require_once '../../backend/RoadMapStatus.php';

header("Content-Type: application/json");

try {

  $roadMapStatus = new RoadMapStatus();

  $result = $roadMapStatus->peakHourAnalyticsLogs();

  echo json_encode($result);

} catch (Exception $e) {

  http_response_code(500);

  echo json_encode([
    "error" => true,
    "message" => $e->getMessage()
  ]);
}

?>