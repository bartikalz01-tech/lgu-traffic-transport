<?php
require 'BarangayTrafficStatus.php';

$config = new config();
$config->conn();

//$roads = new Roads();
//$roads->viewRoadsData();

$barangayTrafficStatus = new BarangayTrafficStatus();
$barangayTrafficStatus->barangayTrafficStatus();

if($config->pdo) {
  echo "Database Connected <br>";
} else {
  echo "Database not connected";
}

if($barangayTrafficStatus) {
  echo "Success";
} else {
  echo "Nothing";
}

?>