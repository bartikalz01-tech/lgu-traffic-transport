<?php
require_once 'config.php';

class AuditLogs extends config {

  public function createLog(
    $userId, 
    $action, 
    $module, 
    $entityType = null, 
    $entityId = null,
    $publicReference = null,
    $description = null
  ) {

    $conn = $this->conn();

    $sql = "
      INSERT INTO audit_logs (
        user_id,
        action,
        module,
        entity_type,
        entity_id,
        public_reference,
        description
      ) VALUES (
        :user_id,
        :action,
        :module,
        :entity_type,
        :entity_id,
        :public_reference,
        :description 
      )
    ";

    $stmt = $conn->prepare($sql);

    $stmt->execute([
      ':user_id' => $userId,
      ':action' => $action,
      ':module' => $module,
      ':entity_type' => $entityType,
      ':entity_id' => $entityId,
      ':public_reference' => $publicReference,
      ':description' => $description
    ]);

    return [
      'success' => true,
      'audit_log' => $conn->lastInsertId()
    ];

  }

  public function getAuditLogs() {
    $conn = $this->conn();

    $sql = "
      SELECT
        al.audit_id,
        al.user_id,
        u.full_name,
        u.role,
        al.action,
        al.module,
        al.entity_type,
        al.entity_id,
        al.public_reference,
        al.description,
        al.created_at
      FROM audit_logs al
      LEFT JOIN users u
        ON al.user_id = u.user_id
      ORDER BY al.created_at DESC;
    ";

    $stmt = $conn->prepare($sql);

    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

}


?>