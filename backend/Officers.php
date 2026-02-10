<?php
require_once 'config.php';

class Officers extends config{

  public function getAllOfficers() {
    $conn = $this->conn();
    $sql = "
      SELECT officer_id, officer_name FROM officers
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }
  
  public function assignedOfficerToAccident($accidentId, $officerId) {
    $conn = $this->conn();
    $sql = "
      UPDATE accident_cases
      SET officer_id = :officer_id
      WHERE accident_id = :accident_id
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bindValue(':officer_id', $officerId, PDO::PARAM_INT);
    $stmt->bindValue(':accident_id', $accidentId, PDO::PARAM_INT);

    return $stmt->execute();
  }
}

?>