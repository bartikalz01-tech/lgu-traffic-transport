<?php
require_once 'config.php';

class Accidents extends config
{

  public function getAccidentCases(){
    $conn = $this->conn();
    $sql = "
      SELECT
        a.accident_id,
          a.public_accident_id,
          r.road_name,
          a.accident_type,
          a.date_of_accident,
          a.time_of_accident
      FROM accident_cases a
      JOIN roads r
        ON a.road_id = r.road_id
      ORDER BY a.accident_id DESC
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }
}