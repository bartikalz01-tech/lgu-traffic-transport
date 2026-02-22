<?php
require_once 'config.php';

class GetTicket extends config {

  public function getAccidentTicketDetails($accidentId) {
    $conn = $this->conn();
    $sql = "
      SELECT
        t.public_ticket_id,
        a.accident_id,
        s.status_id,
        t.issued_date
      FROM tickets t
      LEFT JOIN accident_cases a
        ON t.accident_id = a.accident_id
      LEFT JOIN status_of_reports s
        ON t.status_id = s.status_id
      WHERE a.accident_id = :accident_id;
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bindValue(':accident_id', $accidentId, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function entitiesInvolvedAccident($accidentId) {
    $conn = $this->conn();
    $sql = "
      SELECT
        p.full_name,
        p.contact_num,
        p.address,
        ap.role,
        v.vehicle_name,
        v.plate_number
      FROM accident_cases a
      LEFT JOIN accident_peoples ap
        ON a.accident_id = ap.accident_id
      LEFT JOIN people_involved p
        ON ap.people_id = p.people_id
      LEFT JOIN accident_vehicles av
        ON av.accident_id = a.accident_id
        AND av.people_id = p.people_id
      LEFT JOIN vehicle_reported v
        ON av.vehicle_id = v.vehicle_id
      WHERE a.accident_id = :accident_id
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bindValue(':accident_id', $accidentId, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

}

?>