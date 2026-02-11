<?php
require_once 'config.php';

class StatusOfReports extends config{
  
  public function getStatus() {
    $conn = $this->conn();
    $sql = "
      SELECT status_id, status_definition FROM status_of_reports
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function assignStatus($accidentId, $statusId) {
    $conn = $this->conn();
    $sql = "
      UPDATE accident_cases
      SET status_id = :status_id
      WHERE accident_id = :accident_id
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bindValue(':status_id', $statusId, PDO::PARAM_INT);
    $stmt->bindValue(':accident_id', $accidentId, PDO::PARAM_INT);

    return $stmt->execute();
  }
}

?>