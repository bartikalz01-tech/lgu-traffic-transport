<?php
require_once '../backend/config.php';
require_once '../backend/InsertPeopleInvolved.php';
require_once '../backend/InsertAccidentPeoples.php';

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if(!$data) {
  echo json_encode([
    "success" => false,
    "message" => "Invalid people data"
  ]);
  exit;
}

try {
  $config = new config();
  $conn = $config->conn();
  $conn->beginTransaction();

  $peopleObj = new InsertPeopleInvolved();
  $accidentPeopleObj = new InsertAccidentPeoples();

  $people_id = $peopleObj->insertPeople(
    $data['full_name'],
    $data['contact_num'],
    $data['address']
  );

  $accidentPeopleObj->insertAccidentPeoples(
    $data['accident_id'],
    $people_id,
    $data['role'],
    $data['status_level']
  );

  $conn->commit();

  echo json_encode([
    "success" => true
  ]);

} catch(Exception $e) {
  $conn->rollBack();
  echo json_encode([
    "success" => false,
    "message" => $e->getMessage()
  ]);
}

?>