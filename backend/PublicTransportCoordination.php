<?php
require_once 'config.php';

class PublicTransportCoordination extends config {

  public function insertPuvGroup($puvGroupName, $puvGroupAddress, $puvGroupVehicleType, $lat, $lng) {
    $conn = $this->conn();
    $sql = "
      INSERT INTO puv_groups (puv_group_name, puv_group_address, puv_vehicle_type, latitude, longitude)
      VALUES (:puv_group_name, :puv_group_address, :puv_vehicle_type, :lat, :lng)
    ";

    $stmt = $conn->prepare($sql);

    $stmt->bindParam(':puv_group_name', $puvGroupName);
    $stmt->bindParam(':puv_group_address', $puvGroupAddress);
    $stmt->bindParam(':puv_vehicle_type', $puvGroupVehicleType);
    $stmt->bindParam(':lat', $lat);
    $stmt->bindParam(':lng', $lng);

    try {
      $stmt->execute();
      return $conn->lastinsertId();
    } catch(PDOException $e) {
      throw new Exception("Database insert failed");
    }
  }

  public function getPuvGroups() {
    $conn = $this->conn();
    $sql = "
      SELECT
        puv_group_id,
        puv_group_name,
        puv_group_address,
        puv_vehicle_type,
        latitude,
        longitude
      FROM puv_groups
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  } 

}

?>