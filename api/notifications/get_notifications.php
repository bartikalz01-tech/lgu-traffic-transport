<?php

require_once '../../backend/Notifications.php';

header("Content-Type: application/json");

try {

  $notifications = new Notifications();

  $result = $notifications->getNotifications();

  http_response_code(200);

  echo json_encode($result);

} catch (Exception $e) {

  http_response_code(500);

  echo json_encode([
    'success' => false,
    'message' => $e->getMessage()
  ]);

}

?>