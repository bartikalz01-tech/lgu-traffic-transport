<?php

require_once '../../backend/Violations.php';

header('Content-Type: application/json');

if($_SERVER['REQUEST_METHOD'] !== 'POST') {

  http_response_code(405);

  echo json_encode([
    'success' => false,
    'message' => 'Invalid request method.'
  ]);

  exit;
}


$data = json_decode(
  file_get_contents('php://input'),
  true
);


if(!$data) {

  http_response_code(400);

  echo json_encode([
    'success' => false,
    'message' => 'Invalid request body.'
  ]);

  exit;
}


$violationId = $data['violation_id'] ?? null;
$status = trim($data['status'] ?? '');


if(!$violationId) {

  http_response_code(400);

  echo json_encode([
    'success' => false,
    'message' => 'Violation ID is required.'
  ]);

  exit;
}


if($status === '') {

  http_response_code(400);

  echo json_encode([
    'success' => false,
    'message' => 'Status is required.'
  ]);

  exit;
}


try {

  $violations = new Violations();

  $result =
    $violations->updateVerificationStatus(
      $violationId,
      $status
    );

  echo json_encode($result);

} catch(Throwable $error) {

  http_response_code(500);

  echo json_encode([
    'success' => false,
    'message' => $error->getMessage()
  ]);

}

?>