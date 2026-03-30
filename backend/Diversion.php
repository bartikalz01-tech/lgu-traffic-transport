<?php
require_once 'config.php';

class Diversion extends config {

  public function createDiversion($start_road_id, $end_road_id, $schedule_date) {
    $conn = $this->conn();
    $sql = "
      INSERT INTO diversion_routes (start_road_id, end_road_id, schedule_date)
      VALUES (:start, :end, :date)
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':start', $start_road_id);
    $stmt->bindParam(':end', $end_road_id);
    $stmt->bindParam(':date', $schedule_date);
    $stmt->execute();

    return $conn->lastInsertId();
  }

  public function insertRouteDetails($diversion_id, $routes) {
    $conn = $this->conn();
    $sql = "
      INSERT INTO diversion_routes_details (diversion_id, road_id, sequence_order)
      VALUES (:diversion_id, :road_id, :sequence_order)
    ";

    $stmt = $conn->prepare($sql);

    foreach($routes as $index => $road) {
      $order = $index + 1;

      $stmt->bindParam(':diversion_id', $diversion_id);
      $stmt->bindParam(':road_id', $road['road_id']);
      $stmt->bindParam(':sequence_order', $order);
      $stmt->execute();
    }

    return true;
  }

}

?>