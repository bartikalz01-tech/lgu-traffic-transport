<?php

require_once '../../backend/Tickets.php';

header('Content-Type: application/json');

try {

  $tickets = new Tickets();

  $officers =
    $tickets->getAvailableOfficers();

  echo json_encode([

    'success' => true,

    'officers' => $officers

  ]);

} catch (Exception $e) {

  http_response_code(500);

  echo json_encode([

    'success' => false,

    'message' =>
      $e->getMessage()

  ]);

}