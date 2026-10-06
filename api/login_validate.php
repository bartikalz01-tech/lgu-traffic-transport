<?php
require_once '../backend/LoginValidation.php';
require_once '../backend/AuditLogs.php';

session_start();

header('Content-Type: application/json');

if($_SERVER['REQUEST_METHOD'] !== 'POST') {
  echo json_encode([
    'status' => 'error',
    'message' => 'Invalid request method'
  ]);
  exit;
}

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if(empty($email) || empty($password)) {
  echo json_encode([
    'status' => 'error',
    'message' => 'Email and Password are required'
  ]);
  exit;
}

$login = new LoginValidation();
$result = $login->validateLogin($email, $password);

if($result['status'] === 'success') {
  session_regenerate_id(true);

  $user = $result['user'];

  $_SESSION['user_id'] = $user['user_id'];
  $_SESSION['email'] = $user['email'];
  $_SESSION['role'] = $user['role'];
  $_SESSION['full_name'] = $user['full_name'];

  $_SESSION['login-time'] = time();

  try {
    $auditLogs = new AuditLogs();

    $auditLogs->createLog(
      $user['user_id'],
      'LOGIN',
      'Authentication',
      'User',
      $user['user_id'],
      null,
      $user['full_name'] . ' logged into the system'
    );
  } catch(Exception $e) {
    error_log(
      "[AUDIT LOG] Login audit failed: "
      . $e->getMessage()
    );
  }
}

echo json_encode($result);

?>