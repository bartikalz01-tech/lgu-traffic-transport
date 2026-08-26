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
            file_path,
            cloudinary_url
          )
          VALUES (
            :violation_id,
            :evidence_type,
            :file_name,
            :file_path,
            :cloudinary_url
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
          ':violation_id' => $violationReportId,

          ':evidence_type' => 'CCTV_Snapshot',

          ':file_name' => $filename,

          ':file_path' => $filepath,
          
          ':cloudinary_url' => $data['cloudinary_url'] ?? null
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

        vr.vehicle_id,
        vr.person_id,
        vr.subject_type,

        v.plate_number,
        v.vehicle_type,

        vr.violation_type,
        vr.violation_datetime,
        vr.location_details,
        vr.description,

        vr.verification_status,
        vr.offense_level,

        ve.cloudinary_url

      FROM violation_reports vr

      LEFT JOIN roads r
        ON vr.road_id = r.road_id

      LEFT JOIN vehicles v
        ON vr.vehicle_id = v.vehicle_id

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

        vr.vehicle_id,
        vr.person_id,
        vr.subject_type,

        v.plate_number,
        v.vehicle_type,

        vr.violation_type,
        vr.violation_datetime,
        vr.location_details,
        vr.description,

        vr.verification_status,
        vr.offense_level,

        ve.cloudinary_url

      FROM violation_reports vr

      LEFT JOIN roads r
        ON vr.road_id = r.road_id

      LEFT JOIN vehicles v
        ON vr.vehicle_id = v.vehicle_id

      LEFT JOIN violation_evidence ve
        ON vr.violation_id = ve.violation_id

      WHERE vr.verification_status = 'Verified'

      ORDER BY vr.created_at DESC
    ";

    $stmt = $conn->prepare($sql);

    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function updateVerificationStatus(
    $violationId,
    $verificationStatus
  ) {

    $conn = $this->conn();

    $allowedStatuses = [
      'Pending Review',
      'Verified',
      'Rejected'
    ];

    if (!in_array($verificationStatus, $allowedStatuses, true)) {
      throw new Exception("Invalid verification status.");
    }

    try {

      $conn->beginTransaction();

      /*
      * Get current violation.
      */
      $sql = "
        SELECT
          violation_id,
          vehicle_id,
          subject_type,
          violation_type,
          verification_status,
          offense_level

        FROM violation_reports

        WHERE violation_id = :violation_id

        FOR UPDATE
      ";

      $stmt = $conn->prepare($sql);

      $stmt->execute([
        ':violation_id' => $violationId
      ]);

      $violation = $stmt->fetch(PDO::FETCH_ASSOC);

      if (!$violation) {
        throw new Exception(
          "Violation report not found."
        );
      }


      /*
      * REJECTED
      */
      if ($verificationStatus === 'Rejected') {

        $updateSql = "
          UPDATE violation_reports

          SET
            verification_status = 'Rejected',
            offense_level = NULL

          WHERE violation_id = :violation_id
        ";

        $updateStmt = $conn->prepare($updateSql);

        $updateStmt->execute([
          ':violation_id' => $violationId
        ]);
      }


      /*
      * PENDING
      */
      elseif ($verificationStatus === 'Pending Review') {

        $updateSql = "
          UPDATE violation_reports

          SET
            verification_status = 'Pending Review'

          WHERE violation_id = :violation_id
        ";

        $updateStmt = $conn->prepare($updateSql);

        $updateStmt->execute([
          ':violation_id' => $violationId
        ]);
      }


      /*
      * VERIFIED
      */
      elseif ($verificationStatus === 'Verified') {

        $offenseLevel = null;


        /*
        * Only vehicles participate
        * in plate-based offense tracking.
        */
        if (
          $violation['subject_type'] === 'Vehicle' &&
          !empty($violation['vehicle_id'])
        ) {

          $historySql = "
            SELECT COUNT(*) AS verified_count

            FROM violation_reports

            WHERE vehicle_id = :vehicle_id

            AND violation_type = :violation_type

            AND verification_status = 'Verified'

            AND violation_id <> :violation_id
          ";

          $historyStmt =
            $conn->prepare($historySql);

          $historyStmt->execute([

            ':vehicle_id' =>
              $violation['vehicle_id'],

            ':violation_type' =>
              $violation['violation_type'],

            ':violation_id' =>
              $violationId
          ]);

          $history =
            $historyStmt->fetch(PDO::FETCH_ASSOC);

          $verifiedCount =
            (int)$history['verified_count'];


          if ($verifiedCount === 0) {

            $offenseLevel =
              'First Offense';

          } elseif ($verifiedCount === 1) {

            $offenseLevel =
              'Second Offense';

          } else {

            $offenseLevel =
              'Third Offense';
          }
        }


        /*
        * Save verification + offense together.
        */
        $updateSql = "
          UPDATE violation_reports

          SET
            verification_status = 'Verified',
            offense_level = :offense_level

          WHERE violation_id = :violation_id
        ";

        $updateStmt =
          $conn->prepare($updateSql);

        $updateStmt->execute([

          ':offense_level' =>
            $offenseLevel,

          ':violation_id' =>
            $violationId
        ]);

      }


      $conn->commit();


      return [
        'success' => true,
        'violation_id' => $violationId,
        'verification_status' => $verificationStatus,
        'offense_level' =>
          $offenseLevel ?? $violation['offense_level']
      ];


    } catch (PDOException $e) {

      if ($conn->inTransaction()) {
        $conn->rollBack();
      }

      error_log(
        "[VIOLATION] Verification error: "
        . $e->getMessage()
      );

      throw new Exception(
        "Failed to update violation verification."
      );

    } catch (Exception $e) {

      if ($conn->inTransaction()) {
        $conn->rollBack();
      }

      throw $e;
    }
  }
}

?>