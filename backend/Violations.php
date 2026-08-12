<?php

require_once 'config.php';

class Violations extends config {

  public function insertViolationReport($data) {

    $conn = $this->conn();

    $publicViolationId =
      'VIO-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));

    try {

      $conn->beginTransaction();

      // ----------------------------------------
      // 1. INSERT VIOLATION REPORT
      // ----------------------------------------

      $sql = "
        INSERT INTO violation_reports (
          public_violation_id,
          road_id,
          violation_type,
          violation_datetime,
          location_details,
          plate_number,
          vehicle_type,
          description
        )
        VALUES (
          :public_violation_id,
          :road_id,
          :violation_type,
          :violation_datetime,
          :location_details,
          :plate_number,
          :vehicle_type,
          :description
        )
      ";

      $stmt = $conn->prepare($sql);

      $stmt->bindParam(
        ':public_violation_id',
        $publicViolationId
      );

      $stmt->bindParam(
        ':road_id',
        $data['road_id']
      );

      $stmt->bindParam(
        ':violation_type',
        $data['violation_type']
      );

      $stmt->bindParam(
        ':violation_datetime',
        $data['violation_datetime']
      );

      $stmt->bindParam(
        ':location_details',
        $data['location_details']
      );

      $stmt->bindParam(
        ':plate_number',
        $data['plate_number']
      );

      $stmt->bindParam(
        ':vehicle_type',
        $data['vehicle_type']
      );

      $stmt->bindParam(
        ':description',
        $data['description']
      );

      $stmt->execute();

      $violationReportId = $conn->lastInsertId();


      // ----------------------------------------
      // 2. INSERT CCTV EVIDENCE
      // ----------------------------------------

      if (!empty($data['evidence'])) {

        $evidenceSql = "
          INSERT INTO violation_evidence (
            violation_report_id,
            evidence_type,
            file_name,
            file_path
          )
          VALUES (
            :violation_report_id,
            :evidence_type,
            :file_name,
            :file_path
          )
        ";

        $evidenceStmt = $conn->prepare($evidenceSql);

        $evidenceType = 'CCTV_Snapshot';

        $filename = $data['evidence'];

        $filepath = 'accident_snapshots/' . $filename;

        $evidenceStmt->bindParam(
          ':violation_report_id',
          $violationReportId
        );

        $evidenceStmt->bindParam(
          ':evidence_type',
          $evidenceType
        );

        $evidenceStmt->bindParam(
          ':file_name',
          $filename
        );

        $evidenceStmt->bindParam(
          ':file_path',
          $filepath
        );

        $evidenceStmt->execute();
      }


      // ----------------------------------------
      // 3. COMMIT
      // ----------------------------------------

      $conn->commit();


      return [
        'success' => true,
        'violation_report_id' => $violationReportId,
        'public_violation_id' => $publicViolationId
      ];

    } catch (PDOException $e) {

      if ($conn->inTransaction()) {
        $conn->rollBack();
      }

      // TEMPORARILY expose the real database error
      throw new Exception(
        "Database insert failed: " . $e->getMessage()
      );
    }
  }
}

?>