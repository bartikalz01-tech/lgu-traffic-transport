<?php
require_once '../../backend/Routing.php';

header('Content-Type: application/json');

try {
  if(!isset($_GET['lat']) || !isset($_GET['lng'])) {
    throw new Exception('Latitude and Longtiude are required');
  }

  $lat = (float)$_GET['lat'];
  $lng = (float)$_GET['lng'];

  $routing = new Routing();

  $routes = $routing->generateDiversionSuggestions($lat, $lng);

  echo json_encode([
    'status' => 'success',
    'data' => $routes
  ]);

} catch(Exception $e) {
  echo json_encode([
    'status' => 'error',
    'message' => $e->getMessage()
  ]);
}

?>