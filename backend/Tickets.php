<?php
require_once 'config.php';

class Tickets extends config {

  public function getVerifiedViolations() {

    $conn = $this->conn();

    $sql = "
      SELECT

        vr.violation_id,
        vr.public_violation_id,

        r.road_name,

        vr.vehicle_id,
        vr.person_id,
        vr.subject_type,

        v.plate_number,
        v.vehicle_type,

        vr.violation_type,
        vr.violation_datetime,
        vr.location_details,
        vr.description,

        vr.verification_status,
        vr.offense_level,

        ve.cloudinary_url

      FROM violation_reports vr

      LEFT JOIN roads r
        ON vr.road_id = r.road_id

      LEFT JOIN vehicles v
        ON vr.vehicle_id = v.vehicle_id

      LEFT JOIN violation_evidence ve
        ON vr.violation_id = ve.violation_id

      WHERE vr.verification_status = 'Verified'

      ORDER BY vr.created_at DESC
    ";

    $stmt = $conn->prepare($sql);

    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }


  public function getAvailableOfficers() {

    $conn = $this->conn();

    $sql = "
      SELECT

        officer_id,
        officer_name,
        contact_number,
        status

      FROM officers

      WHERE status = 'Available'

      ORDER BY officer_name ASC
    ";

    $stmt = $conn->prepare($sql);

    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function createTicket($data) {

    $conn = $this->conn();

    try {

      $conn->beginTransaction();


      /*
      ============================================================
      VALIDATE REQUIRED DATA
      ============================================================
      */

      $violationId =
        isset($data['violation_id'])
          ? (int)$data['violation_id']
          : 0;

      $officerId =
        isset($data['officer_id'])
          ? (int)$data['officer_id']
          : 0;

      $issuedAt =
        !empty($data['issued_at'])
          ? $data['issued_at']
          : date('Y-m-d H:i:s');

      $dueDate =
        !empty($data['due_date'])
          ? $data['due_date']
          : null;

      $notes =
        !empty($data['notes'])
          ? trim($data['notes'])
          : null;


      if ($violationId <= 0) {

        throw new Exception(
          "A violation report must be selected."
        );

      }


      if ($officerId <= 0) {

        throw new Exception(
          "An officer must be assigned."
        );

      }


      if (empty($dueDate)) {

        throw new Exception(
          "Due date is required."
        );

      }


      /*
      ============================================================
      CHECK VIOLATION
      ============================================================
      */

      $violationSql = "
        SELECT
          violation_id,
          verification_status

        FROM violation_reports

        WHERE violation_id = :violation_id

        FOR UPDATE
      ";

      $violationStmt =
        $conn->prepare($violationSql);

      $violationStmt->execute([
        ':violation_id' => $violationId
      ]);

      $violation =
        $violationStmt->fetch(PDO::FETCH_ASSOC);


      if (!$violation) {

        throw new Exception(
          "Violation report not found."
        );

      }


      /*
      Only VERIFIED violations can
      become tickets.
      */

      if (
        $violation['verification_status']
        !== 'Verified'
      ) {

        throw new Exception(
          "Only verified violation reports can be issued as tickets."
        );

      }


      /*
      ============================================================
      PREVENT DUPLICATE TICKET
      ============================================================
      */

      $existingTicketSql = "
        SELECT ticket_id

        FROM tickets

        WHERE violation_id = :violation_id

        LIMIT 1
      ";

      $existingTicketStmt =
        $conn->prepare(
          $existingTicketSql
        );

      $existingTicketStmt->execute([
        ':violation_id' => $violationId
      ]);

      $existingTicket =
        $existingTicketStmt->fetch(
          PDO::FETCH_ASSOC
        );


      if ($existingTicket) {

        throw new Exception(
          "A ticket has already been created for this violation."
        );

      }


      /*
      ============================================================
      LOCK OFFICER
      ============================================================
      */

      $officerSql = "
        SELECT
          officer_id,
          officer_name,
          contact_number,
          status

        FROM officers

        WHERE officer_id = :officer_id

        FOR UPDATE
      ";

      $officerStmt =
        $conn->prepare($officerSql);

      $officerStmt->execute([
        ':officer_id' => $officerId
      ]);

      $officer =
        $officerStmt->fetch(
          PDO::FETCH_ASSOC
        );


      if (!$officer) {

        throw new Exception(
          "Selected officer was not found."
        );

      }


      /*
      Make sure the officer is
      STILL available.

      This is important because another
      user could have assigned the officer
      after the dropdown was loaded.
      */

      if ($officer['status'] !== 'Available') {

        throw new Exception(
          "The selected officer is no longer available."
        );

      }


      /*
      ============================================================
      GENERATE PUBLIC TICKET ID
      ============================================================
      */

      $publicTicketId =
        'TKT-' .
        date('Ymd') .
        '-' .
        strtoupper(
          substr(
            uniqid(),
            -6
          )
        );


      /*
      ============================================================
      INSERT TICKET
      ============================================================
      
      person_id is intentionally NULL.
      It will be populated later.
      */

      $ticketSql = "
        INSERT INTO tickets (

          public_ticket_id,
          violation_id,
          person_id,
          officer_id,
          issued_at,
          due_date,
          notes

        )

        VALUES (

          :public_ticket_id,
          :violation_id,
          NULL,
          :officer_id,
          :issued_at,
          :due_date,
          :notes

        )
      ";

      $ticketStmt =
        $conn->prepare($ticketSql);

      $ticketStmt->execute([

        ':public_ticket_id' =>
          $publicTicketId,

        ':violation_id' =>
          $violationId,

        ':officer_id' =>
          $officerId,

        ':issued_at' =>
          $issuedAt,

        ':due_date' =>
          $dueDate,

        ':notes' =>
          $notes

      ]);


      $ticketId =
        (int)$conn->lastInsertId();


      /*
      ============================================================
      UPDATE OFFICER STATUS
      ============================================================
      
      Officer is now handling this ticket.
      */

      $updateOfficerSql = "
        UPDATE officers

        SET
          status = 'Assigned'

        WHERE officer_id = :officer_id
      ";

      $updateOfficerStmt =
        $conn->prepare(
          $updateOfficerSql
        );

      $updateOfficerStmt->execute([
        ':officer_id' => $officerId
      ]);


      /*
      ============================================================
      COMMIT
      ============================================================
      */

      $conn->commit();


      return [

        'success' =>
          true,

        'ticket_id' =>
          $ticketId,

        'public_ticket_id' =>
          $publicTicketId,

        'violation_id' =>
          $violationId,

        'person_id' =>
          null,

        'officer_id' =>
          $officerId,

        'officer_name' =>
          $officer['officer_name'],

        'issued_at' =>
          $issuedAt,

        'due_date' =>
          $dueDate,

        'notes' =>
          $notes

      ];


    } catch (PDOException $e) {

      if ($conn->inTransaction()) {
        $conn->rollBack();
      }

      error_log(
        "[TICKET] Database error: "
        . $e->getMessage()
      );

      throw new Exception(
        "Failed to create ticket."
      );


    } catch (Exception $e) {

      if ($conn->inTransaction()) {
        $conn->rollBack();
      }

      throw $e;
    }

  }

}

?>