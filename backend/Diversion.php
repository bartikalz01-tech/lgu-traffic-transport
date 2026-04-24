<?php
require_once 'config.php';

class Diversion extends config {

  public function createDiversion($start_road_id, $end_road_id, $distance) {
    $conn = $this->conn();
    $sql = "
      INSERT INTO diversion_routes (start_road_id, end_road_id, distance)
      VALUES (:start, :end, :distance)
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':start', $start_road_id);
    $stmt->bindParam(':end', $end_road_id);
    $stmt->bindParam(':distance', $distance);
    $stmt->execute();

    return $conn->lastInsertId();
  }

  public function insertRouteDetails($diversion_id, $points) {
    $conn = $this->conn();
    $sql = "
      INSERT INTO diversion_routes_details (diversion_id, road_id, lat, lng, sequence_order)
      VALUES (:diversion_id, :road_id, :lat, :lng, :sequence_order)
    ";

    $stmt = $conn->prepare($sql);

    foreach($points as $index => $point) {
      $order = $index + 1;

      $stmt->execute([
        ':diversion_id' => $diversion_id,
        ':road_id' => $point['road_id'],
        ':lat' => $point['lat'],
        ':lng' => $point['lng'],
        ':sequence_order' => $order
      ]);
    }

    return true;
  }

  public function getPendingDiversion() {
    $conn = $this->conn();
    $sql = "
      SELECT
        dr.diversion_id,
        dr.start_road_id,
        dr.end_road_id,
        dr.distance,
        dr.created_at,
        r1.road_name AS start_name,
        r2.road_name AS end_name
      FROM diversion_routes dr
      LEFT JOIN roads r1 ON dr.start_road_id = r1.road_id
      LEFT JOIN roads r2 ON dr.end_road_id = r2.road_id
      ORDER BY dr.created_at DESC
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function getDiversionRoutesDetails($diversion_id) {
    $conn = $this->conn();
    $sql = "
      SELECT lat, lng, sequence_order
      FROM diversion_routes_details
      WHERE diversion_id = :diversion_id
      ORDER BY sequence_order ASC
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam('diversion_id', $diversion_id);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  /*public function getAllDiversionsWithStatus() {
    $conn = $this->conn();
    $sql = "
      SELECT
        ds.diversion_id,
        ds.start_datetime,
        ds.end_datetime,
        dr.distance,
        r1.road_name AS start_name,
        r2.road_name AS end_name,

        CASE
          WHEN NOW() >= ds.start_datetime AND NOW() <= ds.end_datetime THEN 'active'
          WHEN NOW() < ds.start_datetime THEN 'scheduled'
          ELSE 'resolved'
        END as status

      FROM diversion_schedule ds
      JOIN diversion_routes dr ON ds.diversion_id = dr.diversion_id
      JOIN roads r1 ON dr.start_road_id = r1.road_id
      JOIN roads r2 ON dr.end_road_id = r2.road_id
      ORDER BY ds.start_datetime DESC
    ";
    $stmt = $conn->prepare($sql);
    $stmt->execute();

    return $stmt->fetchALL(PDO::FETCH_ASSOC);
  }*/

  public function getDiversionActiveDetails($diversion_id) {
    $conn = $this->conn();
    $sql = "
      SELECT
        dr.diversion_id,
        r1.road_name AS start_name,
        r2.road_name AS end_name,
        dr.distance,
        dr.vehicle_per_min,
        dr.avg_speed
      FROM diversion_routes dr
      JOIN roads r1 on dr.start_road_id = r1.road_id
      JOIN roads r2 on dr.end_road_id = r2.road_id
      WHERE dr.diversion_id = :diversion_id
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':diversion_id', $diversion_id);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }
}

?>