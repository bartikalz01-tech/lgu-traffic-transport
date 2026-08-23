<?php
require_once '../../backend/Violations.php';

header("Content-Type: application/json");

$violations = new Violations();

echo json_encode($violations->violationReportApi());

?>