<?php
require_once '../../backend/Emergencies.php';

header("Content-Type: application/json");

$emergencies = new Emergencies();

$data = $emergencies->getEmergenciesLocation();

echo json_encode($data);

?>