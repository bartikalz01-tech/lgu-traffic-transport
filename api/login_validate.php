<?php
require_once '../backend/LoginValidation.php';

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
}

echo json_encode($result);

?>