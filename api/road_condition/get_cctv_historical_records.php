<?php

require_once '../../backend/RoadMapStatus.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {

  http_response_code(405);

  echo json_encode([
    'success' => false,
    'message' => 'Invalid request method.'
  ]);

  exit;
}

try {

  $filters = [
    'camera_name' => $_GET['camera_name'] ?? 'all',
    'start_date'  => $_GET['start_date'] ?? '',
    'end_date'=> $_GET['end_date'] ?? '',
    'search' => $_GET['search'] ?? ''
  ];

  $roadMapStatus = new RoadMapStatus();

  $records =
    $roadMapStatus->getCctvHistoricalRecords(
      $filters
    );

  echo json_encode([
    'success' => true,
    'records' => $records
  ]);

} catch (Throwable $error) {

  http_response_code(500);

  echo json_encode([
    'success' => false,
    'message' =>
      'Failed to load CCTV historical records.'
  ]);
}

?>