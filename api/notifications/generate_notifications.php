<?php

require_once '../../backend/Notifications.php';

header("Content-Type: application/json");

try {

    $notifications = new Notifications();

    $possibleAccidentResult =
        $notifications->createPossibleAccidentNotifications();

    $undispatchedResult =
        $notifications->createUndispatchedNotifications();

    http_response_code(200);

    echo json_encode([
        'success' => true,
        'possible_accidents' => $possibleAccidentResult,
        'undispatched_accidents' => $undispatchedResult
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);

}