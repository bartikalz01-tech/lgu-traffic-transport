<?php

function buildGraph($conn) {
  $sql = "SELECT from_road_id, to_road_id, distance FROM road_connections";
  $stmt = $conn->prepare($sql);
  $stmt->execute();

  $graph = [];

  while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $from = $row['from_road_id'];
    $to = $row['to_road_id'];
    $distance = $row['distance'];

    $graph[$from][$to] = $distance;

    $graph[$to][$from] = $distance;
  }

  return $graph;
}

function dijkstra($graph, $start, $end) {
  $dist = [];
  $prev = [];
  $queue = [];

  foreach($graph as $node => $edges) {
    $dist[$node] = INF;
    $prev[$node] = null;
  }

  if(!isset($dist[$start])) {
    $dist[$start] = INF;
    $prev[$start] = null;
  }

  $dist[$start] = 0;
  $queue[$start] = 0;

  while(!empty($queue)) {
    $current = array_keys($queue, min($queue))[0];
    unset($queue[$current]);

    if($current == $end) break;

    if(!isset($graph[$current])) continue;

    foreach($graph[$current] as $neighbor => $weight) {
      $alt = $dist[$current] + $weight;

      if($alt < $dist[$neighbor]) {
        $dist[$neighbor] = $alt;
        $prev[$neighbor] = $current;
        $queue[$neighbor] = $alt;
      }
    }
  }

  $path = [];
  $node = $end;

  while($node !== null) {
    array_unshift($path, $node);
    $node = $prev[$node] ?? null;
  }

  $path = array_map('intval', $path);

  return [
    'path' => $path,
    'distance' => $dist[$end]
  ];
}

?>