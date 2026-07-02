<?php
require_once '../../backend/Emergencies.php';

header("Content-Type: application/json");

$emergencies = new Emergencies();

echo json_encode(
  $emergencies->getEmergencyCounts()
);

?>