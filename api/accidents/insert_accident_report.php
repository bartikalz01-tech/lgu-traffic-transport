<?php
require_once '../../backend/Accidents.php';

header("Content-Type: application/json");

try {

  if($_SERVER['REQUEST_METHOD'] !== "POST") {
    http_response_code(405);
  
    echo json_encode([
      'success' => false,
      'message' => 'Method not allowed.'
    ]);

    exit;
  }

  $data = json_decode(file_get_contents('php://input'), true);

  if(!$data) {
    http_response_code(400);

    echo json_encode([
      'success' => false,
      'message' => 'Invalid request data.'
    ]);

    exit;
  }

   $requiredFields = [
    'road_id',
    'accident_date',
    'accident_time',
    'accident_type'
  ];

  foreach($requiredFields as $field) {
    if(!isset($data[$field]) || trim((string)$data[$field]) === '') {
      http_response_code(400);

      echo json_encode([
        'success' => false,
        'message' => "Missing required field: $field"
      ]);

      exit;
    }
  }

  $data['specific_location'] = $data['specific_location'] ?? null;

  $data['snapshot_filename'] = $data['snapshot_filename'] ?? null;

  $accidents = new Accidents();

  $result = $accidents->insertAccidentReport($data);

  echo json_encode([
    'success' => true,
    'message' => 'Accident report successfully inserted.',
    'accident_id' => $result['accident_id'],
    'public_accident_id' => $result['public_accident_id']
  ]);

} catch(Exception $e) {
  http_response_code(500);

  echo json_encode([
    'success' => false,
    'message' => $e->getMessage()
  ]);
}

?>