<?php
require_once '../../backend/AuditLogs.php';

header("Content-Type: application/json");

$auditLogs = new AuditLogs();

$getAuditLogs = $auditLogs->getAuditLogs();

echo json_encode($getAuditLogs);

?>