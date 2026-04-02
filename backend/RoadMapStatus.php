<?php
require_once 'config.php';

class RoadMapStatus extends config{

  public function roadStatusMap() {
    $conn = $this->conn();
    $sql = "
      SELECT
          r.road_id,
          r.road_name,
          rc.latitude,
          rc.longtitude,
          rc.point_order,
          rts.traffic_level
      FROM roads r
      JOIN road_coordinates rc ON r.road_id = rc.road_id
      LEFT JOIN road_traffic_status rts ON r.road_id = rts.road_id
      ORDER BY r.road_id, rc.point_order;
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function roadDiversionCoordinates($road_id) {
    $conn = $this->conn();
    $sql = "
      SELECT latitude, longtitude FROM road_coordinates
      WHERE road_id = :road_id
      ORDER BY point_order;
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':road_id', $road_id);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }
}

?>