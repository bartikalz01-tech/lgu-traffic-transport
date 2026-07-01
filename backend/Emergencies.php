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
      WHERE e.status IN ('pending', 'assigned')
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function getPendingEmergenciesLocation() {
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
      WHERE e.status IN ('pending')
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

  public function saveEmergencyRoutes($emergencyId, $responderId, $distance, $eta, $routeJson, $selected) {
    $conn = $this->conn();
    $sql = "
      INSERT INTO emergency_routes (
        emergency_id,
        responder_id,
        distance,
        eta,
        route_json,
        selected
      )
      VALUES (
        :emergency_id,
        :responder_id,
        :distance,
        :eta,
        :route_json,
        :selected
      )
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute([
      ':emergency_id' => $emergencyId,
      ':responder_id' => $responderId,
      ':distance' => $distance,
      ':eta' => $eta,
      ':route_json' => $routeJson,
      ':selected' => $selected
    ]);

    return $conn->lastInsertId();
  }

  public function updateEmergencyStatus($emergencyId, $status) {
    $conn = $this->conn();
    $sql = "
      UPDATE emergencies
      SET status = :status
      WHERE emergency_id = :emergency_id 
    ";

    $stmt = $conn->prepare($sql);
    
    return $stmt->execute([
      ':status' => $status,
      ':emergency_id' => $emergencyId
    ]);
  }
  
  public function getAssignedRoutes() {
    $conn = $this->conn();
    $sql = "
      SELECT
        er.*,
        e.type,
        e.latitude AS emergency_lat,
        e.longitude AS emergency_lng,
        r.responder_name,
        r.responder_address,
        r.type as responder_type,
        r.latitude AS responder_lat,
        r.longitude AS responder_lng
      FROM emergency_routes er
      INNER JOIN emergencies e
        ON er.emergency_id = e.emergency_id
      INNER JOIN responders r
        ON er.responder_id = r.responder_id
      WHERE e.status = 'assigned'
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

}

?>