<?php

require_once 'config.php';

class Violations extends config {

  public function insertViolationReport($data) {

    $conn = $this->conn();

    $publicViolationId =
      'VIO-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));

    try {

      $conn->beginTransaction();

      $subjectType = $data['subject_type'] ?? 'Unknown';

      $vehicleId = null;
      $personId = null;

      if ($subjectType === 'Vehicle') {

        $plateNumber =
          strtoupper(
            trim(
              $data['plate_number'] ?? ''
            )
          );

        $vehicleType =
          $data['vehicle_type'] ?? null;


        if ($plateNumber === '') {

          throw new Exception(
            "Plate number is required for vehicle violations."
          );

        }

        $vehicleSql = "
          SELECT vehicle_id
          FROM vehicles
          WHERE plate_number = :plate_number
          LIMIT 1
        ";

        $vehicleStmt =
          $conn->prepare($vehicleSql);

        $vehicleStmt->execute([
          ':plate_number' => $plateNumber
        ]);

        $vehicle =
          $vehicleStmt->fetch(PDO::FETCH_ASSOC);


        // -----------------------------------------------
        // Vehicle already exists
        // -----------------------------------------------

        if ($vehicle) {

          $vehicleId =
            (int)$vehicle['vehicle_id'];

        } else {

          $insertVehicleSql = "
            INSERT INTO vehicles (
              plate_number,
              vehicle_type
            )
            VALUES (
              :plate_number,
              :vehicle_type
            )
          ";

          $insertVehicleStmt =
            $conn->prepare(
              $insertVehicleSql
            );

          $insertVehicleStmt->execute([

            ':plate_number' =>
              $plateNumber,

            ':vehicle_type' =>
              $vehicleType

          ]);

          $vehicleId =
            (int)$conn->lastInsertId();

        }

      }

      if ($subjectType !== 'Vehicle') {
        $vehicleId = null;
      }

      $sql = "
        INSERT INTO violation_reports (
          public_violation_id,
          road_id,
          vehicle_id,
          person_id,
          subject_type,
          violation_type,
          violation_datetime,
          location_details,
          description
        )
        VALUES (
          :public_violation_id,
          :road_id,
          :vehicle_id,
          :person_id,
          :subject_type,
          :violation_type,
          :violation_datetime,
          :location_details,
          :description
        )
      ";


      $stmt = $conn->prepare($sql);

      $stmt->execute([

        ':public_violation_id' =>
          $publicViolationId,

        ':road_id' =>
          $data['road_id'],

        ':vehicle_id' =>
          $vehicleId,

        ':person_id' =>
          $personId,

        ':subject_type' =>
          $subjectType,

        ':violation_type' =>
          $data['violation_type'],

        ':violation_datetime' =>
          $data['violation_datetime'],

        ':location_details' =>
          $data['location_details'] ?? null,

        ':description' =>
          $data['description'] ?? null

      ]);


      $violationReportId = $conn->lastInsertId();

      if (!empty($data['evidence'])) {

        $evidenceSql = "
          INSERT INTO violation_evidence (
            violation_id,
            evidence_type,
            file_name,
            file_path
          )
          VALUES (
            :violation_id,
            :evidence_type,
            :file_name,
            :file_path
          )
        ";

        $evidenceStmt =
          $conn->prepare(
            $evidenceSql
          );


        $filename =
          $data['evidence'];

        $filepath =
          'violation_evidence/snapshots/'
          . $filename;


        $evidenceStmt->execute([

          ':violation_id' =>
            $violationReportId,

          ':evidence_type' =>
            'CCTV_Snapshot',

          ':file_name' =>
            $filename,

          ':file_path' =>
            $filepath

        ]);

      }

      $conn->commit();

      return [
        'success' =>
          true,

        'violation_id' =>
          $violationReportId,

        'public_violation_id' =>
          $publicViolationId,

        'vehicle_id' =>
          $vehicleId,

        'person_id' =>
          $personId,

        'subject_type' =>
          $subjectType
      ];


    } catch (PDOException $e) {

      if (
        $conn->inTransaction()
      ) {

        $conn->rollBack();

      }

      error_log(
        "[VIOLATION] Database error: "
        . $e->getMessage()
      );

      throw new Exception(
        "Database insert failed: "
        . $e->getMessage()
      );

    } catch (Exception $e) {

      if (
        $conn->inTransaction()
      ) {

        $conn->rollBack();

      }

      throw $e;

    }

  }

  public function getViolationDetails() {
    $conn = $this->conn();
    $sql = "
      SELECT
        vr.violation_id,
        vr.public_violation_id,
        r.road_name,
        vr.violation_type,
        vr.violation_datetime,
        vr.location_details,
        vr.plate_number,
        vr.vehicle_type,
        vr.description,
        vr.status,
        ve.file_name,
        ve.file_path

      FROM violation_reports vr

      LEFT JOIN roads r
        ON vr.road_id = r.road_id

      LEFT JOIN violation_evidence ve
        ON vr.violation_id = ve.violation_id

      ORDER BY vr.created_at DESC
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function violationReportApi() {
    $conn = $this->conn();
    $sql = "
      SELECT
        vr.violation_id,
        vr.public_violation_id,
        r.road_name,
        vr.violation_type,
        vr.violation_datetime,
        vr.location_details,
        vr.plate_number,
        vr.vehicle_type,
        vr.description,
        vr.status,
        ve.file_name,
        ve.file_path

      FROM violation_reports vr

      LEFT JOIN roads r
        ON vr.road_id = r.road_id

      LEFT JOIN violation_evidence ve
        ON vr.violation_id = ve.violation_id
      
      WHERE vr.status = 'Verified'

      ORDER BY vr.created_at DESC
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function updateViolationStatus($violationId, $status) {

    $conn = $this->conn();

    $allowedStatuses = [
      'Pending Review',
      'First Offense',
      'Second Offense',
      'Third Offense'
    ];

    if (!in_array($status, $allowedStatuses, true)) {

      throw new Exception(
        "Invalid violation status."
      );

    }

    $sql = "
      UPDATE violation_reports
      SET status = :status
      WHERE violation_id = :violation_id
    ";

    $stmt = $conn->prepare($sql);

    $stmt->execute([
      ':status' =>
        $status,

      ':violation_id' =>
        $violationId
    ]);

    if ($stmt->rowCount() === 0) {

      throw new Exception(
        "Violation report not found or status was unchanged."
      );

    }

    return [
      'success' => true,
      'violation_id' => $violationId,
      'status' => $status
    ];
  }
}

?>