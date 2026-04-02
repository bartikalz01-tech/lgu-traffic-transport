<?php
require_once 'config.php';

class RoadConnections extends config {
  public function getRoadConnection() {
    $conn = $this->conn();
    $sql = "
      SELECT from_road_id, to_road_id
      FROM road_connections
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute();

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $graph = [];

    foreach($rows as $row) {
      $from = $row['from_road_id'];
      $to = $row['to_road_id'];

      if(!isset($graph[$from])) {
        $graph[$from] = [];
      }

      $graph[$from][] = $to;
    }

    return $graph;
  }

  public function findRoute($start, $end) {
    $graph = $this->getRoadConnection();

    $queue = [[$start]];
    $visited = [];

    while(!empty($queue)) {
      $path = array_shift($queue);
      $node = end($path);

      if($node == $end) {
        return $path;
      }

      if(!in_array($node, $visited)) {
        $visited[] = $node;

        foreach($graph[$node] ?? [] as $neighbor) {
          $newPath = $path;
          $newPath[] = $neighbor;
          $queue[] = $newPath;
        }
      }
    }

    return [];
  }
}

?>