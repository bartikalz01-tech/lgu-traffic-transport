<?php
require_once '../../backend/Emergencies.php';

header("Content-Type: application/json");

$emergencies = new Emergencies();

$data = $emergencies->getPendingEmergenciesLocation();

echo json_encode($data);

?>