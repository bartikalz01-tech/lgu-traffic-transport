<?php
require_once '../../backend/Routing.php';

header('Content-Type: application/json');

try {
  /*if(!isset($_GET['lat']) || !isset($_GET['lng']) || !isset($_GET['destination'])) {
    throw new Exception('lat, lng and destination are required');
  }

  $lat = (float)$_GET['lat'];
  $lng = (float)$_GET['lng'];
  $destination = $_GET['destination'];

  $routing = new Routing();

  $routes = $routing->generateDiversionSuggestions($lat, $lng, $destination);

  echo json_encode([
    'status' => 'success',
    'data' => $routes
  ]);*/

  $routing = new Routing();

  $puvGroupId = $_GET['puv_group_id'] ?? null;

  if(!$puvGroupId) {
    echo json_encode([
      'status' => 'error',
      'message' => 'Missing PUV Group ID'
    ]);
    exit;
  }

  $route = $routing->generateDiversionToAssignedExit($puvGroupId);

  if(empty($route)) {
    echo json_encode([
      'status' => 'error',
      'message' => 'No Route Found'
    ]);
    exit;
  }

  echo json_encode([
    'status' => 'success',
    'route' => $route
  ]);

} catch(Exception $e) {
  echo json_encode([
    'status' => 'error',
    'message' => $e->getMessage()
  ]);
}

?>