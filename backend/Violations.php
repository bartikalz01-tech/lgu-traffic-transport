<?php
require_once 'config.php';

class Violations extends config {

  public function getViolationCase() {
    $conn = $this->conn();
    $sql = "
      SELECT
        v.violation_case_id,
        v.public_violation_id,
        r.road_name,
        v.violation_type,
        sr.status_definition,
        v.date_of_violation,
        v.time_of_violation
      FROM violations_cases v
      JOIN roads r
        ON v.road_id = r.road_id
      LEFT JOIN status_of_reports sr
        ON v.status_id = sr.status_id
      ORDER BY v.violation_case_id DESC
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

}

?>