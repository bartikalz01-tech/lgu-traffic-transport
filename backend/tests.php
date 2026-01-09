<?php
require 'Roads.php';

$config = new config();
$config->conn();

$roads = new Roads();
$roads->viewRoadsData();

if($config->pdo) {
  echo "Database Connected <br>";
} else {
  echo "Database not connected";
}

if($roads) {
  echo "Success";
} else {
  echo "Nothing";
}

?>