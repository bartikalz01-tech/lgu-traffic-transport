<?php
require_once 'config.php';

class RoadMapEvents extends config{
  public function getEvents() {
    $conn = $this->conn();
    $sql = "SELECT * FROM road_events";

    $stmt = $conn->prepare($sql);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }
}

?>