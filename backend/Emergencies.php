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

  public function getAssignedEmergenciesLocation() {
    $conn = $this->conn();
    $sql = "
      SELECT
        e.emergency_id,
        e.type,
        e.latitude,
        e.longitude,
        e.status,
        e.reported_date,
        r.road_name
      FROM emergencies e
      LEFT JOIN roads r ON e.road_id = r.road_id
      WHERE e.status IN ('assigned')
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

  public function getBackupsResponders($emergencyId) {
    $conn = $this->conn();
    $emergencySql = "
      SELECT type
      FROM emergencies
      WHERE emergency_id = :emergency_id
    ";

    $stmt = $conn->prepare($emergencySql);

    $stmt->execute([
      ':emergency_id' => $emergencyId
    ]);

    $emergency = $stmt->fetch(PDO::FETCH_ASSOC);

    if(!$emergency) {
      return [];
    }

    $emergencyType = $emergency["type"];

    if($emergencyType === "accident") {
      $allowedTypes = ["police"];
    } else if($emergencyType === "fire") {
      $allowedTypes = ["fire", "police", "hospital"];
    } else {
      $allowedTypes = [$emergencyType];
    }

    $placeholders = implode(",", array_fill(0, count($allowedTypes), "?"));

    $sql = "
      SELECT
        e.emergency_id,
        e.type,

        e.latitude AS emergency_lat,
        e.longitude AS emergency_lng,

        r.responder_id,
        r.responder_name,
        r.responder_address,

        r.type AS responder_type,

        r.latitude AS responder_lat,
        r.longitude AS responder_lng
      FROM responders r

      INNER JOIN emergencies e 
        ON e.emergency_id = ?
      WHERE r.type IN ($placeholders)
      
      AND 
        r.responder_id NOT IN (
          SELECT responder_id
          FROM emergency_routes
          WHERE emergency_id = ?
        )
      
      ORDER BY
        FIELD(r.type, 'fire', 'police', 'hospital'),
        r.responder_name  
    ";

    $stmt = $conn->prepare($sql);

    $params = [];

    $params[] = $emergencyId;

    foreach($allowedTypes as $type) {
      $params[] = $type;
    }

    $params[] = $emergencyId;

    $stmt->execute($params);

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
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
        er.distance,
        er.eta,
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

  public function getEmergencyCounts() {
    $conn = $this->conn();
    $sql = "
      SELECT
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
        SUM(CASE WHEN status = 'assigned' THEN 1 ELSE 0 END) AS assigned
      FROM emergencies
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute();

    return $stmt->fetch(PDO::FETCH_ASSOC);
  }

}

?>