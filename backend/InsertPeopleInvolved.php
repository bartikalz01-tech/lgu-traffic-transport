<?php
require_once __DIR__ . '/config.php';

class InsertPeopleInvolved extends config {
  
  public function insertPeople($full_name, $contact_num, $address) {
    $conn = $this->conn();
    $sql = "INSERT INTO people_involved (full_name, contact_num, address) VALUES (:full_name, :contact_num, :address)";

    $data = $conn->prepare($sql);
    $data->execute([
      ':full_name' => $full_name,
      ':contact_num' => $contact_num,
      ':address' => $address
    ]);

    return $conn->lastInsertId();
  }
}
?>