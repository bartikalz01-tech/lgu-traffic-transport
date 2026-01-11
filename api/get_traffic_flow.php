<?php
  require '../backend/TrafficFlow.php';

  header('Content-type: application/json');

  $traffics = new TrafficFlow();
  $data = $traffics->trafficFlow();

  echo json_encode($data);
?>