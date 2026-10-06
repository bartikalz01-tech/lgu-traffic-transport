<?php
require_once 'backend/AuditLogs.php';

session_start();

$userId = $_SESSION['user_id'] ?? null;
$userName = $_SESSION['full_name'] ?? 'Unknown user';

if($userId !== null) {
  try {
    $auditLogs = new AuditLogs();

    $auditLogs->createLog(
      $userId,
      'LOGOUT',
      'Authentication',
      'User',
      $userId,
      null,
      $userName . ' logged out of the system'
    );
  } catch(Exception $e) {
    error_log(
      "[AUDIT_LOG] Logout audit failed: "
      . $e->getMessage()
    );
  }
}

$_SESSION = [];

if (ini_get("session.use_cookies")) {

  $params = session_get_cookie_params();

  setcookie(
    session_name(),
    '',
    time() - 42000,
    $params["path"],
    $params["domain"],
    $params["secure"],
    $params["httponly"]
  );
}

session_destroy();

header("Location: index.php");
exit;

?>