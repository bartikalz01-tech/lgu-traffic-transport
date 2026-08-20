<?php
require_once '../../backend/Ptc.php';

header('Content-Type: application/json');

try {

  $ptc = new Ptc();

  $groups = $ptc->getPuvGroups();

  echo json_encode([
    'success' => true,
    'data' => $groups
  ]);

} catch (Exception $e) {

  http_response_code(500);

  echo json_encode([
    'success' => false,
    'message' => $e->getMessage()
  ]);
}

?>