<?php

require_once '../../backend/Ptc.php';

header('Content-Type: application/json');

try {

  $input = json_decode(
    file_get_contents("php://input"),
    true
  );

  if (!$input) {

    throw new Exception(
      "Invalid request data."
    );

  }

  $ptc = new Ptc();

  $result =
    $ptc->insertPuvLocations($input);

  echo json_encode($result);

} catch (Exception $e) {

  http_response_code(500);

  echo json_encode([
    'success' => false,
    'message' => $e->getMessage()
  ]);

}