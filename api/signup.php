<?php
/*require_once '../backend/InsertUser.php';

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
}*/

require_once '../backend/InsertUser.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid request method"
    ]);
    exit;
}

try {

    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {
        throw new Exception("Invalid JSON data received.");
    }

    $full_name = $data['full_name'] ?? null;
    $email = $data['email'] ?? null;
    $pass = $data['pass'] ?? null;
    $role = $data['role'] ?? null;

    if (!$full_name || !$email || !$pass || !$role) {
        throw new Exception("Missing required signup fields.");
    }

    $insertUser = new InsertUser();

    $userId = $insertUser->insertUser(
        $full_name,
        $email,
        $pass,
        $role
    );

    echo json_encode([
        "status" => "success",
        "user_id" => $userId
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}

?>