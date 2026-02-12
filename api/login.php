<?php
require_once '../backend/LoginValidation.php';

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

echo json_encode($result);

?>