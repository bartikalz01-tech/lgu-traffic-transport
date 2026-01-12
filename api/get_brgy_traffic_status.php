<?php
  require '../backend/BarangayTrafficStatus.php';

  header('Content-type: application/json');

  $barangayTrafficStatus = new BarangayTrafficStatus();
  $data = $barangayTrafficStatus->barangayTrafficStatus();

  echo json_encode($data);
?>