<?php
require_once 'config.php';

class Diversion extends config {

  public function createDiversion($start_road_id, $end_road_id) {
    $conn = $this->conn();
    $sql = "
      INSERT INTO diversion_routes (start_road_id, end_road_id)
      VALUES (:start, :end)
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':start', $start_road_id);
    $stmt->bindParam(':end', $end_road_id);
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

}

?>