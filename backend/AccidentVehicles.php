<?php
require_once 'config.php';

class AccidentVehicles extends config {
  
  public function getTotalAccidentVehicles($accident_id) {
    $conn = $this->conn();
    $sql = "
      SELECT COUNT(*) AS total_vehicles
      FROM accident_vehicles
      WHERE accident_id = :accident_id
    ";

    $data = $conn->prepare($sql);
    $data->bindParam(':accident_id', $accident_id, PDO::PARAM_INT);
    $data->execute();

    return $data->fetch(PDO::FETCH_ASSOC);
  }

  public function getAccidentVehiclesDetails($accidentId) {
    $conn = $this->conn();
    $sql = "
      SELECT
          av.accident_vehicle_id,
          a.accident_id,
          p.full_name,
          v.plate_number,
          v.vehicle_type,
          v.vehicle_name,
          av.damage_level
      FROM accident_vehicles av
      LEFT JOIN accident_cases a ON av.accident_id = a.accident_id
      LEFT JOIN people_involved p on av.people_id = p.people_id
      LEFT JOIN vehicle_reported v on av.vehicle_id = v.vehicle_id
      WHERE a.accident_id = :accident_id
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':accident_id', $accidentId, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function deleteAccidentVehicles($accidentVehicleId) {
    $conn = $this->conn();
    $conn->beginTransaction();

    try {
      $getSql = "
        SELECT vehicle_id
        FROM accident_vehicles
        WHERE accident_vehicle_id = :accident_vehicle_id
      ";

      $stmt = $conn->prepare($getSql);
      $stmt->execute([
        ':accident_vehicle_id' => $accidentVehicleId
      ]);

      $row = $stmt->fetch(PDO::FETCH_ASSOC);

      if(!$row) {
        $conn->rollBack();
        return false;
      }

      $vehicleId = $row['vehicle_id'];

      $deleteAccidentVehicleSql = "
        DELETE FROM accident_vehicles
        WHERE accident_vehicle_id = :accident_vehicle_id
      ";

      $stmt = $conn->prepare($deleteAccidentVehicleSql);
      $stmt->execute([
        ':accident_vehicle_id' => $accidentVehicleId
      ]);

      $deleteVehicleSql = "
        DELETE FROM vehicle_reported
        WHERE vehicle_id = :vehicle_id
      ";

      $stmt = $conn->prepare($deleteVehicleSql);
      $stmt->execute([
        'vehicle_id' => $vehicleId
      ]);

      $conn->commit();

      return true;
    } catch(Exception $e) {
      $conn->rollBack();
      throw $e;
      return false;
    }
  }
}
?>