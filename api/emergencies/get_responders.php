<?php
require_once '../../backend/Emergencies.php';

header("Content-Type: application/json");

$type = $_GET['type'] ?? '';

$emergencies = new Emergencies();

$data = $emergencies->getResponders($type);

echo json_encode($data);

?>