<?php
  require_once 'config.php';

  class Roads extends config {
    
    public function viewRoadsData() {
      $conn = $this->conn();
      $sql = "SELECT * FROM `roads`";
      $data = $conn->prepare($sql);
      $data->execute();
      
      return $result = $data->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getNearestRoad($lat, $lng) {
      $conn = $this->conn();
      $sql = "
        SELECT 
          road_id,
          (POW(latitude - :lat, 2) + POW(longtitude - :lng, 2)) AS distance
          FROM road_coordinates
          ORDER BY distance ASC
          LIMIT 1 
      ";

      $stmt = $conn->prepare($sql);
      $stmt->bindParam(':lat', $lat);
      $stmt->bindParam(':lng', $lng);
      $stmt->execute();

      return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getRoadPathCoordinates($roadIds) {
      $conn = $this->conn();

      $placeholders = implode(',', array_fill(0, count($roadIds), '?'));

      $sql = "
        SELECT
          road_id,
          latitude,
          longtitude
        FROM road_coordinates
        WHERE road_id IN ($placeholders)
        ORDER BY road_id, point_order
      ";

      $stmt = $conn->prepare($sql);
      $stmt->execute($roadIds);

      return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
  }

?>