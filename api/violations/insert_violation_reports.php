<?php

require_once '../../backend/Violations.php';

header('Content-Type: application/json');

try {

    $input = file_get_contents("php://input");

    $data = json_decode($input, true);

    if (!$data) {
        throw new Exception(
            "Invalid or empty JSON request."
        );
    }


    $violations = new Violations();

    $result =
        $violations->insertViolationReport($data);


    echo json_encode($result);


} catch (Exception $error) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => $error->getMessage()
    ]);
}

?>