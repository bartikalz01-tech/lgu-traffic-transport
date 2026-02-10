<?php
require_once '../backend/Officers.php';

header('Content-type: application/json');

$officers = new Officers();

$data = $officers->getAllOfficers();

echo json_encode($data);
?>