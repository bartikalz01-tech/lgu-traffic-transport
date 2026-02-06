<?php
require_once 'config.php';

class AccidentsDetails extends config {

  public function getAccidentDetails() {
    $conn = $this->conn();
    $sql = "
      SELECT
        a.accident_id,
        a.public_accident_id,
        r.road_name,
        a.accident_description,
        a.status_of_accident,
        COUNT(DISTINCT ap.accident_ppl_id),
        COUNT(DISTINCT av.accident_vehicle_id)
      FROM accident_cases
      LEFT JOIN roads r ON a.road_id = r.road_id
      LEFT JOIN accident_peoples ap ON a.accident_id = ap.accident_id
      LEFT JOIN accident_vehicles av ON a.accident_id = av.accident_id
      GROUP BY a.accident_id
    ";
  }
}
?>