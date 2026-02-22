<?php
require_once 'config.php';

class InsertTicket extends config {

  public function insertTicket($publicTicketId, $accidentId, $statusId, $reportedBy) {
    $conn = $this->conn();
    $sql = "
      INSERT INTO tickets (public_ticket_id, accident_id, status_id, reported_by)
      VALUES (:public_ticket_id, :accident_id, :status_id, :reported_by)
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute([
      ':public_ticket_id' => $publicTicketId,
      ':accident_id' => $accidentId,
      ':status_id' => $statusId,
      ':reported_by' => $reportedBy
    ]);

    return $conn->lastInsertId();
  }
}
?>