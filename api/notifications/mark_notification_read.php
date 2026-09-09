<?php

require_once '../../backend/Notifications.php';

header("Content-Type: application/json");

try {

  $data = json_decode(
    file_get_contents("php://input"),
    true
  );

  $notificationId =
    $data['notification_id'] ?? null;


  if (!$notificationId) {

    http_response_code(400);

    echo json_encode([
      'success' => false,
      'message' => 'Notification ID is required.'
    ]);

    exit;
  }


  $notifications = new Notifications();

  $result =
    $notifications->markNotificationAsRead(
      $notificationId
    );


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