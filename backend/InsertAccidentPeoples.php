<?php
require_once __DIR__ . '/config.php';

class InsertAccidentPeoples extends config{
  
  public function insertAccidentPeoples($accident_id, $people_id, $role, $status_level) {
    $conn = $this->conn();
    $sql = "INSERT INTO accident_peoples (accident_id, people_id, role, status_level) VALUES (:accident_id, :people_id, :role, :status_level)";

    $data = $conn->prepare($sql);
    $data->execute([
      ':accident_id' => $accident_id,
      ':people_id' => $people_id,
      ':role' => $role,
      ':status_level' => $status_level
    ]);

    return $conn->lastInsertId();
  }
}

?>