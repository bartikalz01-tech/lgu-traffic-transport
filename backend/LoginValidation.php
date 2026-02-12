<?php
require 'config.php';

class LoginValidation extends config {

  public function validateLogin($email, $password) {
    $conn = $this->conn();
    $sql = "
      SELECT * FROM users where email = :email LIMIT 1
    ";
    $stmt = $conn->prepare($sql);

    $stmt->execute([
      ':email' => $email
    ]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if(!$user) {
      return [
        'status' => 'error',
        'message' => 'User not found'
      ];
    }

    if(!password_verify($password, $user['pass'])) {
      return [
        'status' => 'error',
        'message' => 'Invalid passowrd'
      ];
    }

    unset($user['pass']);

    return [
      'status' => 'success',
      'message' => 'Login Successful',
      'user' => $user
    ];
  }
}

?>