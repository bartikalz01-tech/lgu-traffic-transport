<?php
require_once 'config.php';

class DiversionSchedule extends config {
  
  public function createSchedule($diversion_id, $start, $end) {
    $conn = $this->conn();

    $sql = "
      INSERT INTO diversion_schedule
      (diversion_id, start_datetime, end_datetime, status)
      VALUES (:diversion_id, :start, :end, 'scheduled')
    ";

    $stmt = $conn->prepare($sql);

    return $stmt->execute([
      ':diversion_id' => $diversion_id,
      ':start' => $start,
      ':end' => $end
    ]);
  } 
}

?>