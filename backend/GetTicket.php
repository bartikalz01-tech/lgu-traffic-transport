<?php
require_once 'config.php';

class GetTicket extends config {

  public function getAccidentTicketDetails($accidentId) {
  $conn = $this->conn();

  $sql = "
    SELECT
      t.ticket_id,
      t.public_ticket_id,
      t.reported_by,
      t.issued_date,
      a.accident_id,
      a.public_accident_id,
      a.accident_description,
      a.date_of_accident,
      sr.status_id,
      sr.status_definition,
      r.road_name
    FROM tickets t
    INNER JOIN accident_cases a
      ON t.accident_id = a.accident_id
    LEFT JOIN status_of_reports sr
      ON a.status_id = sr.status_id
    LEFT JOIN roads r
      ON a.road_id = r.road_id
    WHERE a.accident_id = :accident_id
  ";

  $stmt = $conn->prepare($sql);
  $stmt->bindValue(':accident_id', $accidentId, PDO::PARAM_INT);
  $stmt->execute();

  return $stmt->fetch(PDO::FETCH_ASSOC);
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

  public function getFullTicketData($accidentId) {
    return [
      'ticket' => $this->getAccidentTicketDetails($accidentId),
      'entities' => $this->entitiesInvolvedAccident($accidentId)
    ];
  }

}

?>