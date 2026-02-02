<?php
require_once 'config.php';

class AccidentPeoples extends config {

  public function getTotalAccidentPeoples($accident_id) {
    $conn = $this->conn();
    $sql = "
      SELECT COUNT(*) AS total_people 
      FROM accident_peoples
      WHERE accident_id = :accident_id
    ";

    $data = $conn->prepare($sql);
    $data->bindParam(':accident_id', $accident_id, PDO::PARAM_INT);
    $data->execute();

    return $data->fetch(PDO::FETCH_ASSOC);
  }
}
?>