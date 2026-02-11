<?php
require_once 'config.php';

class Accidents extends config {

  public function getAccidentCases(){
    $conn = $this->conn();
    $sql = "
      SELECT
          a.accident_id,
          a.public_accident_id,
          r.road_name,
          a.accident_type,
          sr.status_definition,
          a.date_of_accident,
          a.time_of_accident
      FROM accident_cases a
      JOIN roads r
        ON a.road_id = r.road_id
      LEFT JOIN status_of_reports sr
        ON a.status_id = sr.status_id
      ORDER BY a.accident_id DESC
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function headerAccidentDetails($accidentId) {
    $conn = $this->conn();
    $sql = "
      SELECT 
        a.accident_id,
        ao.officer_id,
        a.public_accident_id,
        r.road_name,
        a.accident_type,
        a.accident_description,
        a.status_of_accident,
        a.status_id,
        sr.status_definition,
        a.time_of_accident,
        a.date_of_accident,
        COUNT(DISTINCT ap.accident_ppl_id) AS total_people,
        COUNT(DISTINCT av.accident_vehicle_id) AS total_vehicles
      FROM accident_cases a
      LEFT JOIN status_of_reports sr ON a.status_id = sr.status_id
      LEFT JOIN roads r ON a.road_id = r.road_id
      LEFT JOIN officers ao ON a.officer_id = ao.officer_id
      LEFT JOIN accident_peoples ap ON a.accident_id = ap.accident_id
      LEFT JOIN accident_vehicles av ON a.accident_id = av.accident_id
      WHERE a.accident_id = :accident_id
      GROUP BY a.accident_id;
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bindValue(':accident_id', $accidentId, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetch(PDO::FETCH_ASSOC);
  }
}