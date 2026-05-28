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

  public function insertPuvMember(
    $firstName, 
    $middleName, 
    $lastName, 
    $birthDate, 
    $contactNumber, 
    $licenseNumber,
    $licenseType,
    $personnelType,
    $verificationStatus
  ) {

    $conn = $this->conn();
    $sql = "
      INSERT INTO puv_personnel(
        first_name, 
        middle_name, 
        last_name, 
        birth_date, 
        contact_number, 
        license_number, 
        license_type, 
        personnel_type, 
        verification_status
      )
      VALUES (
        :first_name,
        :middle_name,
        :last_name,
        :birth_date,
        :contact_num,
        :license_num,
        :license_type,
        :personnel_type,
        :verification_status
      )
    ";

    $stmt = $conn->prepare($sql);

    $stmt->bindParam(':first_name', $firstName);
    $stmt->bindParam(':middle_name', $middleName);
    $stmt->bindParam(':last_name', $lastName);
    $stmt->bindParam(':birth_date', $birthDate);
    $stmt->bindParam(':contact_num', $contactNumber);
    $stmt->bindParam(':license_num', $licenseNumber);
    $stmt->bindParam(':license_type', $licenseType);
    $stmt->bindParam(':personnel_type', $personnelType);
    $stmt->bindParam(':verification_status', $verificationStatus);

    $stmt->execute();

    return $conn->lastInsertId();
  }

  public function insertPuvGroupMember($puvGroupId, $personnelId) {
    $conn = $this->conn();
    $sql = "
      INSERT INTO puv_group_members(puv_group_id, personnel_id)
      VALUES (:puv_group_id, :personnel_id)
    ";

    $stmt = $conn->prepare($sql);

    $stmt->bindParam(':puv_group_id', $puvGroupId);
    $stmt->bindParam(':personnel_id', $personnelId);

    $stmt->execute();

    return true;
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

  public function getPuvMembersByGroup($puvGroupId) {
    $conn = $this->conn();
    $sql = "
      SELECT
        pgm.puv_member_id,
        pp.personnel_id,
        CONCAT(
          pp.first_name, ' ',
          IFNULL(pp.middle_name, ''), ' ',
          pp.last_name
        ) AS full_name,
        pp.personnel_type,
        pp.verification_status
      FROM puv_group_members pgm

      INNER JOIN puv_personnel pp
      ON pgm.personnel_id = pp.personnel_id

      WHERE pgm.puv_group_id = :puv_group_id

      ORDER BY pgm.created_at DESC
    ";

    $stmt = $conn->prepare($sql);

    $stmt->bindParam(':puv_group_id', $puvGroupId);

    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

}

?>