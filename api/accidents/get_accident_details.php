<?php
require_once '../../backend/Accidents.php';

header("Content-Type: application/json");

$accidents = new Accidents();

echo json_encode($accidents->getAccidentDetails());

?>