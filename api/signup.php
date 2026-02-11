<?php
require_once '../backend/InsertUser.php';

header('Content-type: application/json');

if($_SERVER['REQUEST_METHOD'] === 'POST') {
  
  $data = json_decode(file_get_contents("php://input"), true);

  $full_name = $data['full_name'];
  $email = $data['email'];
  $pass = $data['pass'];
  $role = $data['role'];

  $insertUser = new InsertUser();

  $userId = $insertUser->insertUser($full_name, $email, $pass, $role);

  echo json_encode([
    "status" => "success",
    "user_id" => $userId
  ]);
}

?>