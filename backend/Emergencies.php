<?php
require_once 'config.php';

class Emergencies extends config {

  public function getEmergenciesLocation() {
    $conn = $this->conn();
    $sql = "SELECT type, latitude, longitude FROM emergencies";

    $stmt = $conn->prepare($sql);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

}

?>