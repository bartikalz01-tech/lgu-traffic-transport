<?php 
require_once '../backend/Roads.php';

header('Content-Type: application/json');

$roads = new Roads();
$data= $roads->viewRoadsData();

echo json_encode($data);
?>