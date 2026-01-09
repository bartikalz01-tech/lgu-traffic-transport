<?php 
require '../backend/Roads.php';

header('Content-type: application/json');

$roads = new Roads();
$data= $roads->viewRoadsData();

echo json_encode($data);
?>