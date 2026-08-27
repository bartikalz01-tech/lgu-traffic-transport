<?php

header('Content-Type: application/json');

require_once '../../backend/Tickets.php';

try {

  if ($_SERVER['REQUEST_METHOD'] !== 'POST') {

    throw new Exception(
      "Invalid request method."
    );

  }


  $input =
    json_decode(
      file_get_contents('php://input'),
      true
    );


  if (!is_array($input)) {

    throw new Exception(
      "Invalid request data."
    );

  }


  $tickets =
    new Tickets();


  $result =
    $tickets->createTicket(
      $input
    );


  echo json_encode([
    'success' => true,
    'message' =>
      'Violation ticket created successfully.',
    'ticket' =>
      $result
  ]);


} catch (Exception $e) {

  http_response_code(400);

  echo json_encode([

    'success' => false,

    'message' =>
      $e->getMessage()

  ]);

}

?>