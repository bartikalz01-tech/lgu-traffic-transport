<?php

require_once '../../backend/Routing.php';

header('Content-Type: application/json');

try {

  $data = json_decode(
    file_get_contents("php://input"),
    true
  );

  $latitude = $data['latitude'] ?? null;
  $longitude = $data['longitude'] ?? null;
  $destination = trim(
    $data['destination'] ?? ''
  );

  if(
    !$latitude ||
    !$longitude ||
    empty($destination)
  ) {
    echo json_encode([
      'status' => 'error',
      'message' => 'Missing required fields'
    ]);
    exit;
  }

  $routing = new Routing();

  $routes =
    $routing->buildDefaultRouteSuggestions(
      $latitude,
      $longitude,
      $destination
    );

  echo json_encode([
    'status' => 'success',
    'routes' => $routes
  ]);

} catch(Exception $e) {

  echo json_encode([
    'status' => 'error',
    'message' => $e->getMessage()
  ]);

}