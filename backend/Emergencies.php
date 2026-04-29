<?php
require_once 'config.php';

class Emergencies extends config {

  public function getEmergenciesLocation() {
    $conn = $this->conn();
    $sql = "
      SELECT
        e.emergency_id,
        e.type,
        e.latitude,
        e.longitude,
        e.status,
        r.road_name
      FROM emergencies e
      LEFT JOIN roads r ON e.road_id = r.road_id
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function getResponders($type) {
    $conn = $this->conn();
    $sql = "
      SELECT * FROM responders WHERE type = :type
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':type', $type);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function getEmergencyById($id) {
    $conn = $this->conn();
    $sql = "SELECT * FROM emergencies WHERE emergency_id = :id";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':id', $id);
    $stmt->execute();

    return $stmt->fetch(PDO::FETCH_ASSOC);
  }

  public function getRespondersById($id) {
    $conn = $this->conn();
    $sql = "SELECT * FROM responders WHERE responder_id = :id";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':id', $id);
    $stmt->execute();

    return $stmt->fetch(PDO::FETCH_ASSOC);
  }

}

?>