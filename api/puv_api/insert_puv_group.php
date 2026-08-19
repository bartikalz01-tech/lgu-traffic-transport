<?php
require_once '../../backend/Ptc.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if(!$data) {
  echo json_encode([
    "status" => "error",
    "message" => "Invalide payload"
  ]);
  exit;
}

if(
  empty($data['group_name']) ||
  empty($data['puv_type']) ||
  empty($data['representative_name']) ||
  empty($data['contact_number'])
) {

  echo json_encode([
    "status" => "error",
    "message" => "Missing required fields"
  ]);

  exit;
}

$puvGroup = new Ptc();


try {
  $result = $puvGroup->insertPuvGroupPending($data);

  echo json_encode([
    "status" => "success",
    "puv_group_id" => $result['puv_group_id']
  ]);
} catch(Exception $e) {
  echo json_encode([
    "status" => "error",
    "message" => $e->getMessage()
  ]);
}

?>