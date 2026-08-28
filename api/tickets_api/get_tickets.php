<?php

header('Content-Type: application/json');

require_once '../../backend/Tickets.php';

try {

  if ($_SERVER['REQUEST_METHOD'] !== 'GET') {

    throw new Exception(
      "Invalid request method."
    );

  }


  $tickets =
    new Tickets();


  $result =
    $tickets->getTickets();


  echo json_encode([

    'success' =>
      true,

    'tickets' =>
      $result

  ]);


} catch (PDOException $e) {

  http_response_code(500);

  error_log(
    "[TICKETS] Database error: "
    . $e->getMessage()
  );

  echo json_encode([

    'success' =>
      false,

    'message' =>
      'Failed to retrieve tickets.'

  ]);


} catch (Exception $e) {

  http_response_code(400);

  echo json_encode([

    'success' =>
      false,

    'message' =>
      $e->getMessage()

  ]);

}

?>