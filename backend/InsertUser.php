<?php
require_once 'config.php';

class InsertUser extends config{

  public function insertUser($full_name, $email, $pass, $role) {
    $conn = $this->conn();

    $hashedPassword = password_hash($pass, PASSWORD_DEFAULT);

    $sql = "
      INSERT INTO users (full_name, email, pass, role)
      VALUES (:full_name, :email, :pass, :role)
    ";

    $stmt = $conn->prepare($sql); 
    $stmt->execute([
      ':full_name' => $full_name,
      ':email' => $email,
      ':pass' => $hashedPassword,
      ':role' => $role
    ]);

    return $conn->lastInsertId();
  }
}

?>