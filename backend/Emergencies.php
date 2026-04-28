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

}

?>