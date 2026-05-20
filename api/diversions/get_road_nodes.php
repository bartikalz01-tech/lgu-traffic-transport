<?php
require_once '../../backend/Routing.php';

header('Content-Type: application/json');

$nodes = new Routing();

//$data = $nodes->getNodes();

echo json_encode([
  "status" => "success",
  "data" => $nodes->getNodes()
]);

?>