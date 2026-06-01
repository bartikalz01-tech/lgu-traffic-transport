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

  public function insertPuvVehicle($puvGroupId, $vehicleNumber, $plateNumber) {
    $conn = $this->conn();
    $sql = "
      INSERT INTO puv_vehicles(puv_group_id, vehicle_number, plate_number)
      VALUES (:puv_group_id, :vehicle_number, :plate_number)
    ";

    $stmt = $conn->prepare($sql);

    $stmt->bindParam(':puv_group_id', $puvGroupId);
    $stmt->bindParam(':vehicle_number', $vehicleNumber);
    $stmt->bindParam(':plate_number', $plateNumber);

    $stmt->execute();

    return $conn->lastInsertId();
  }

  public function assignVehicleToMember($personnelId, $vehicleId) {

    $conn = $this->conn();

    try {
      $conn->beginTransaction();

      $closeSql = "
        UPDATE puv_vehicle_assignments
        SET ended_at = NOW()
        WHERE personnel_id = :personnel_id
        AND ended_at IS NULL
      ";

      $closeStmt = $conn->prepare($closeSql);

      $closeStmt->bindParam(':personnel_id', $personnelId);

      $closeStmt->execute();


      $assignSql = "
        INSERT INTO puv_vehicle_assignments(
          personnel_id,
          vehicle_id,
          assigned_at
        )
        VALUES (:personnel_id, :vehicle_id, NOW())
      ";

      $assignStmt = $conn->prepare($assignSql);

      $assignStmt->bindParam(
        ':personnel_id',
        $personnelId
      );

      $assignStmt->bindParam(
        ':vehicle_id',
        $vehicleId
      );

      $assignStmt->execute();

      $conn->commit();

      return true;

    } catch(Exception $e) {
      $conn->rollBack();

      throw $e;
    }
  }

  public function updateRetireMember($personnelId) {

    $conn = $this->conn();
    
    try {
      $conn->beginTransaction();

      $retireSql = "
        UPDATE puv_personnel
        SET verification_status = 'retired'
        WHERE personnel_id = :personnel_id
      ";

      $retireStmt = $conn->prepare($retireSql);

      $retireStmt->bindParam(':personnel_id', $personnelId);

      $retireStmt->execute();

      //End Active vehicle assignment
      $assignmetnSql = "
        UPDATE puv_vehicle_assignments
        SET ended_at = NOW()
        WHERE personnel_id = :personnel_id
        AND ended_at IS NULL
      ";

      $assignmentStmt = $conn->prepare($assignmetnSql);
      $assignmentStmt->bindParam(':personnel_id', $personnelId);
      $assignmentStmt->execute();

      $conn->commit();

      return true;

    } catch(Exception $e) {

      $conn->rollBack();

      throw $e;
    }

  }

  public function getVehiclesByGroup($groupId) {
    $conn = $this->conn();
    $sql = "
      SELECT
        vehicle_id,
        vehicle_number,
        plate_number
      FROM puv_vehicles
      WHERE puv_group_id = :puv_group_id
      ORDER BY vehicle_number
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':puv_group_id', $groupId);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function getPuvGroups() {
    $conn = $this->conn();
    $sql = "
      SELECT
        pg.puv_group_id,
        pg.puv_group_name,
        pg.puv_group_address,
        pg.puv_vehicle_type,
        pg.latitude,
        pg.longitude,
        COUNT(pgm.puv_member_id) AS total_members

      FROM puv_groups pg

      LEFT JOIN puv_group_members pgm
      ON pg.puv_group_id = pgm.puv_group_id

      GROUP BY
        pg.puv_group_id,
        pg.puv_group_name,
        pg.puv_group_address,
        pg.puv_vehicle_type,
        pg.latitude,
        pg.longitude
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute(); 

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  } 

  public function getPuvMembersByGroup($puvGroupId) {
    $conn = $this->conn();
    $sql = "
      SELECT
        pgm.puv_group_id,
        pp.personnel_id,

        pp.first_name,
        pp.middle_name,
        pp.last_name,

        pp.birth_date,
        pp.contact_number,

        pp.license_number,
        pp.license_type,

        CONCAT(
          pp.first_name, ' ',
          IFNULL(pp.middle_name, ''), ' ',
          pp.last_name
        ) AS full_name,

        pp.personnel_type,
        pp.verification_status,

        pv.vehicle_id,
        pv.vehicle_number,
        pv.plate_number

      FROM puv_group_members pgm

      INNER JOIN puv_personnel pp
      ON pgm.personnel_id = pp.personnel_id

      LEFT JOIN puv_vehicle_assignments pva
      ON pp.personnel_id = pva.personnel_id
      AND pva.ended_at IS NULL

      LEFT JOIN puv_vehicles pv
      ON pva.vehicle_id = pv.vehicle_id

      WHERE pgm.puv_group_id = :puv_group_id

      ORDER BY pgm.created_at DESC
    ";

    $stmt = $conn->prepare($sql);

    $stmt->bindParam(':puv_group_id', $puvGroupId);

    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function getVehicleByNumberAndPlate($groupId, $vehicleNumber, $plateNumber) {
    $conn = $this->conn();

    $sql = "
      SELECT vehicle_id
      FROM puv_vehicles
      WHERE puv_group_id = :group_id
      AND vehicle_number = :vehicle_number
      AND plate_number = :plate_number
      LIMIT 1
    ";

    $stmt = $conn->prepare($sql);

    $stmt->bindParam(':group_id', $groupId);
    $stmt->bindParam(':vehicle_number', $vehicleNumber);
    $stmt->bindParam(':plate_number', $plateNumber);

    $stmt->execute();

    return $stmt->fetch(PDO::FETCH_ASSOC);
  }

}

?>