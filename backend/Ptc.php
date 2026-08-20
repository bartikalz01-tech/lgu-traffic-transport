<?php
require_once 'config.php';

class Ptc extends config {

  public function insertPuvGroupPending($data) {

    $conn = $this->conn();

    $conn->beginTransaction();

    $sql = "
      INSERT INTO puv_groups (
        group_name, 
        puv_type, 
        representative_name, 
        contact_number,
        email_address
      ) VALUES (
        :group_name,
        :puv_type,
        :representative_name,
        :contact_number,
        :email_address 
      )
    ";

    $stmt = $conn->prepare($sql);

    $stmt->bindParam(':group_name', $data['group_name']);
    $stmt->bindParam(':puv_type', $data['puv_type']);
    $stmt->bindParam(':representative_name', $data['representative_name']);
    $stmt->bindParam(':contact_number', $data['contact_number']);
    $stmt->bindParam(':email_address', $data['email_address']);

    try {
      $stmt->execute();

      $puvGroupId = $conn->lastInsertId();

      $meetingDate = !empty($data['meeting_date']) ? $data['meeting_date'] : null;

      $meetingTime = !empty($data['meeting_time']) ? $data['meeting_time'] : null;

      $scheduleSql = "
        INSERT INTO puv_coordination_meetings(
          puv_group_id,
          meeting_date,
          meeting_time
        ) VALUES (
          :puv_group_id,
          :meeting_date,
          :meeting_time
        )
      ";

      $scheduleStmt = $conn->prepare($scheduleSql);

      $scheduleStmt->bindParam(':puv_group_id', $puvGroupId, PDO::PARAM_INT);
      $scheduleStmt->bindParam(':meeting_date', $meetingDate);
      $scheduleStmt->bindParam(':meeting_time', $meetingTime);

      $scheduleStmt->execute();

      $conn->commit();

      return [
        'success' => true,
        'puv_group_id' => $puvGroupId,
      ];

    } catch(PDOException $e) {
      
      if($conn->inTransaction()) {
        $conn->rollBack();
      }

      error_log(
        "Database error: " .
        $e->getMessage()
      );

      throw new Exception("Database insert failed");
    }
  }

  public function getPuvGroups() {
    $conn = $this->conn();
    $sql = "
      SELECT
        puvg.puv_group_id,
        puvg.puv_type,
        puvg.representative_namne,
        puvg.contact_number,
        puvg.email_address,
        puv
    ";
  }

}

?>