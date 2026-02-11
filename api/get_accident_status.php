<?php
require_once '../backend/StatusOfReports.php';

header('Content-type: application/json');

$status = new StatusOfReports();

$data = $status->getStatus();

echo json_encode($data);

?>