<?php
require_once 'config.php';

class InsertTicket extends config {

  public function insertTicket($publicTicketId, $accidentId, $statusId) {
    $conn = $this->conn();
    $sql = "
      INSERT INTO tickets (public_ticket_id, accident_id, status_id)
      VALUES (:public_ticket_id, :accident_id, :status_id)
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute([
      ':public_ticket_id' => $publicTicketId,
      ':accident_id' => $accidentId,
      ':status_id' => $statusId
    ]);

    return $conn->lastInsertId();
  }
}
?>