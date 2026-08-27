<?php

require_once '../../backend/Tickets.php';

header('Content-Type: application/json');

try {

  $tickets = new Tickets();

  $violations =
    $tickets->getVerifiedViolations();


  echo json_encode([

    'success' => true,

    'violations' => $violations

  ]);


} catch (Exception $e) {

  error_log(
    '[TICKET] Failed to retrieve verified violations: '
    . $e->getMessage()
  );

  http_response_code(500);

  echo json_encode([

    'success' => false,

    'message' =>
      'Failed to retrieve verified violation reports.'

  ]);

}
?>