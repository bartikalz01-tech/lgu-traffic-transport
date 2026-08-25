<?php

require_once '../backend/config.php';

header('Content-Type: text/plain');

try {

    $config = new config();

    $pdo = $config->conn();

    echo "DATABASE CONNECTION SUCCESS";

} catch (Throwable $error) {

    echo "DATABASE CONNECTION FAILED\n\n";
    echo $error->getMessage();

}

?>