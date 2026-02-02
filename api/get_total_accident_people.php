<?php 
require_once '../backend/AccidentPeoples.php';

$accidentPeoples = new AccidentPeoples();

$result = $accidentPeoples->getTotalAccidentPeoples(9);

echo $result['total_people'];
?>