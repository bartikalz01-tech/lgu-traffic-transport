<?php
require_once '../backend/Diversion.php';

header("Content-Type: application/json");

$diversion = new Diversion();
$data = $diversion->getAllDiversionsWithStatus();

$summary = [
  'active' => 0,
  'scheduled' => 0,
  'resolved' => 0
];

foreach($data as $d) {
  if(isset($summary[$d['status']])) {
    $summary[$d['status']]++;
  }
}

echo json_encode($summary);

?>