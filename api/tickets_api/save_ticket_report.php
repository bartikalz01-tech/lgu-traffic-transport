<?php

header('Content-Type: application/json; charset=utf-8');

require_once '../../backend/Tickets.php';

try {

    /*
    ============================================================
    READ JSON REQUEST
    ============================================================
    */

    $rawInput = file_get_contents("php://input");

    $data = json_decode(
        $rawInput,
        true
    );


    /*
    ============================================================
    VALIDATE JSON
    ============================================================
    */

    if (
        $data === null &&
        json_last_error() !== JSON_ERROR_NONE
    ) {

        throw new Exception(
            "Invalid JSON request."
        );

    }


    /*
    ============================================================
    CREATE TICKET SERVICE
    ============================================================
    */

    $tickets = new Tickets();


    /*
    ============================================================
    SAVE PERSON + NOTES
    ============================================================
    */

    $result =
        $tickets->saveTicketPersonAndNotes(
            $data
        );


    /*
    ============================================================
    SUCCESS RESPONSE
    ============================================================
    */

    echo json_encode([

        'success' =>
            true,

        'message' =>
            'Ticket report details saved successfully.',

        'ticket_id' =>
            $result['ticket_id'],

        'person_id' =>
            $result['person_id'],

        'first_name' =>
            $result['first_name'],

        'middle_name' =>
            $result['middle_name'],

        'last_name' =>
            $result['last_name'],

        'contact_number' =>
            $result['contact_number'],

        'address' =>
            $result['address'],

        'notes' =>
            $result['notes']

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