<?php
require 'config.php';

class BarangayTrafficStatus extends config{

  public function barangayTrafficStatus() {
    $conn = $this->conn();
    $sql = "SELECT 
              traffic_condition,
              ROUND(
                COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (),
                2
              ) AS percentage
            FROM traffic_flow
            WHERE traffic_date = '2026-01-10'
            GROUP BY traffic_condition;";  // For testing purposes
    $data = $conn->prepare($sql);
    $data->execute();

    return $result = $data->fetchAll(PDO::FETCH_ASSOC);
  }
}

?>