<?php
require_once 'config.php';

class Routing extends config {

  // 🔹 STEP 1: BUILD GRAPH
  public function buildGraph($avoidHigh = false) {

    $conn = $this->conn();

    $sql = "
      SELECT 
        rs.road_id,
        rs.start_node,
        rs.end_node,
        rn1.lat AS lat1, rn1.lng AS lng1,
        rn2.lat AS lat2, rn2.lng AS lng2,
        rts.traffic_level
      FROM road_segments rs
      JOIN road_nodes rn1 ON rs.start_node = rn1.node_id
      JOIN road_nodes rn2 ON rs.end_node = rn2.node_id
      LEFT JOIN road_traffic_status rts 
        ON rs.road_id = rts.road_id
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute();

    $graph = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {

      $from = (int)$row['start_node'];
      $to   = (int)$row['end_node'];

      // 📏 Distance (simple Euclidean)
      $distance = sqrt(
        pow($row['lat1'] - $row['lat2'], 2) +
        pow($row['lng1'] - $row['lng2'], 2)
      );

      $traffic = $row['traffic_level'];

      // 🚫 Avoid high traffic
      /*if ($avoidHigh && $traffic === 'high') {
        continue;
      }*/

      // 🚦 Traffic weight
      switch ($traffic) {
        case 'low': $multiplier = 1; break;
        case 'moderate': $multiplier = 2; break;
        case 'high': 
          if($avoidHigh) {
            $multiplier = 50;
          } else {
            $multiplier = 5;
          }
          break;
        default: $multiplier = 1;
      }

      $weight = $distance * $multiplier;

      // Undirected graph
      $graph[$from][$to] = $weight;
      $graph[$to][$from] = $weight;
    }

    return $graph;
  }

  // 🔹 STEP 2: DIJKSTRA
  public function dijkstra($graph, $start, $end) {

    $dist = [];
    $prev = [];
    $queue = [];

    foreach ($graph as $node => $edges) {
      $dist[$node] = INF;
      $prev[$node] = null;
    }

    // Ensure start exists
    if (!isset($dist[$start])) {
      $dist[$start] = INF;
      $prev[$start] = null;
    }

    $dist[$start] = 0;
    $queue[$start] = 0;

    while (!empty($queue)) {

      $current = array_keys($queue, min($queue))[0];
      unset($queue[$current]);

      if ($current == $end) break;

      if (!isset($graph[$current])) continue;

      foreach ($graph[$current] as $neighbor => $weight) {

        $alt = $dist[$current] + $weight;

        if (!isset($dist[$neighbor]) || $alt < $dist[$neighbor]) {
          $dist[$neighbor] = $alt;
          $prev[$neighbor] = $current;
          $queue[$neighbor] = $alt;
        }
      }
    }

    // 🔁 Reconstruct path
    $path = [];
    $node = $end;

    while ($node !== null) {
      array_unshift($path, $node);
      $node = $prev[$node] ?? null;
    }

    return [
      "path" => $path,
      "distance" => $dist[$end] ?? null
    ];
  }

  // 🔹 STEP 3: PATH → COORDS
  public function getCoordsFromPath($path) {

    if (empty($path)) return [];

    $conn = $this->conn();

    $placeholders = implode(',', array_fill(0, count($path), '?'));

    $sql = "
      SELECT node_id, lat, lng 
      FROM road_nodes 
      WHERE node_id IN ($placeholders)
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute($path);

    $nodes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 🔑 Preserve order
    $nodeMap = [];
    foreach ($nodes as $n) {
      $nodeMap[$n['node_id']] = [$n['lng'], $n['lat']];
    }

    $coords = [];
    foreach ($path as $id) {
      if (isset($nodeMap[$id])) {
        $coords[] = $nodeMap[$id];
      }
    }

    return $coords;
  }

  public function getOSRMRoute($coords) {
    
    if(count($coords) < 2) return null;

    $coordsString = implode(';', array_map(function($c) {
      return $c[0] . ',' . $c[1];
    }, $coords));

    $url = "https://router.project-osrm.org/route/v1/driving/" . $coordsString . "?overview=full&geometries=geojson";

    $response = file_get_contents($url);
    
    if(!$response) return null;

    return json_decode($response, true);
  }

  public function formatOSRMToPoints($osrmData) {
    if(!isset($osrmData['routes'][0])) return [];

    $geometry = $osrmData['routes'][0]['geometry']['coordinates'];

    $points = [];

    foreach($geometry as $index => $coord) {

      $lat = $coord[1];
      $lng = $coord[0];

      $road_id = $this->getNearestRoadId($lat, $lng);

      $points[] = [
        'road_id' => $road_id,
        'lat' => $coord[1],
        'lng' => $coord[0]
      ];
    }

    return $points;
  }

  public function getHighTrafficRoads() {
    $conn = $this->conn();
    $sql = "SELECT road_id FROM road_traffic_status WHERE traffic_level = 'high'";

    $stmt = $conn->prepare($sql);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function getConnectedRoads($node_id) {
    $conn = $this->conn();
    $sql = "
      SELECT COUNT(*) as total
      FROM road_segments
      WHERE start_node = :node OR end_node = :node
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute([
      ':node' => $node_id
    ]);

    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    return $row ? (int)$row['total'] : 0;
  }

  public function getRoadsConnectedToNode($node_id) {
    $conn = $this->conn();
    $sql = "
      SELECT DISTINCT rs.road_id, r.road_name
      FROM road_segments rs
      JOIN roads r
        ON rs.road_id = r.road_id
      WHERE rs.start_node = :node 
        OR rs.end_node = :node
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute([':node' => $node_id]);

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function getNodesFromRoad($road_id) {
    $conn = $this->conn();
    $sql = "
      SELECT start_node, end_node
      FROM road_segments
      WHERE road_id = :road_id
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute([':road_id' => $road_id]);

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function getRoadFromNode($node_id) {
    $conn = $this->conn();
    $sql = "
      SELECT road_id
      FROM road_segments
      WHERE start_node = :node OR end_node = :node
      LIMIT 1
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute([':node' => $node_id]);

    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    return $row ? (int)$row['road_id'] : null;
  }

  public function getNearestRoadId($lat, $lng) {
    $conn = $this->conn();
    $sql = "
      SELECT road_id
      FROM road_nodes rn
      JOIN road_segments rs
        ON rn.node_id = rs.start_node OR rn.node_id = rs.end_node
      ORDER BY SQRT(
        POW(rn.lat - :lat, 2) + POW(rn.lng - :lng, 2)
      ) ASC
      LIMIT 1
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute([
      ':lat' => $lat,
      ':lng' => $lng
    ]);

    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    return $row ? $row['road_id'] : null;
  }

  /*public function getRoadBetweenNodes($nodeA, $nodeB) {
    $conn = $this->conn();
    $sql = "
      SELECT road_id
      FROM road_segments
      WHERE (start_node = :a AND end_node = :b) OR (start_node = :b AND end_node = :a)
      LIMIT 1
    ";

     $stmt = $conn->prepare($sql);
     $stmt->execute([
      ':a' => $nodeA,
      ':b' => $nodeB
     ]);

    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    return $row ? (int)$row['road_id'] : null;
  }*/

  public function getRoadBetweenNodes($nodeA, $nodeB) {

    $conn = $this->conn();

    $sql = "
      SELECT 
        rs.road_id,
        r.road_name
      FROM road_segments rs
      JOIN roads r
        ON rs.road_id = r.road_id
      WHERE 
        (rs.start_node = :a AND rs.end_node = :b)
        OR
        (rs.start_node = :b AND rs.end_node = :a)
      LIMIT 1
    ";

    $stmt = $conn->prepare($sql);

    $stmt->execute([
      ':a' => $nodeA,
      ':b' => $nodeB
    ]);

    return $stmt->fetch(PDO::FETCH_ASSOC);
  }

  public function formatCoordsWithRoads($path, $coords) {

    $points = [];

    for($i = 0; $i < count($coords); $i++) {
      $roadId = null;
      $roadName = null;

      if($i < count($path) - 1) {
        /*$roadId = $this->getRoadBetweenNodes($path[$i], $path[$i + 1]);

        if($roadId) {
          $roadName = $this->getRoadName($roadId);
        }*/
        $road = $this->getRoadBetweenNodes(
          $path[$i],
          $path[$i + 1]
        );

        if($road) {
          $roadId = $road['road_id'];
          $roadName = $road['road_name'];
        }

      } else if($i > 0) {
        $roadId = $points[$i - 1]['road_id'];
        $roadName = $points[$i - 1]['road_name'];
      }

      $points[] = [
        "road_id" => $roadId,
        "road_name" => $roadName,
        "lng" => $coords[$i][0],
        "lat" => $coords[$i][1]
      ];
    }

    return $points;
  }

  public function getRoadName($road_id) {
    $conn = $this->conn();
    $sql = "
      SELECT road_name
      FROM roads
      WHERE road_id = :road_id
      LIMIT 1
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute([':road_id' => $road_id]);

    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    return $row ? $row['road_name'] : null;
  }

  public function generateAlternativeRoutes($start, $end, $maxAttempts = 50) {
    $routes = [];

    $usedEdges = [];

    $usedPaths = [];

    for($i = 0; $i < $maxAttempts; $i++) {
      $graph = $this->buildGraphWithPenalties($usedEdges);

      $result = $this->dijkstra($graph, $start, $end);

      if(empty($result['path']) || count($result['path']) < 2 || $result['distance'] === INF) {
        break;
      }

      $pathKey = implode('-', $result['path']);

      if(in_array($pathKey, $usedPaths)) {
        break;
      }

      $usedPaths[] = $pathKey;

      $routes[] = $result;

      $path = $result['path'];

      for($j = 0; $j < count($path) - 1; $j++) {
        $a = $path[$j];
        $b = $path[$j + 1];

        $usedEdges[] = [$a, $b];
      }
    }

    return $routes;
  }

  public function buildGraphWithPenalties($usedEdges = []) {
    $graph = $this->buildGraph(true);

    foreach($usedEdges as $edge) {
      $a = $edge[0];
      $b = $edge[1];

      if(isset($graph[$a][$b])) {
        $graph[$a][$b] *= 100;
      }

      if(isset($graph[$b][$a])) {
        $graph[$b][$a] *= 100;
      }
    }

    return $graph;
  }

  public function getNodes() {
    $conn = $this->conn();
    $sql = "
      SELECT
        rn.node_id,
        rn.lat,
        rn.lng,

        GROUP_CONCAT(
          DISTINCT r.road_name
          SEPARATOR ' / '
        ) AS roads

      FROM road_nodes rn

      LEFT JOIN road_segments rs
        ON rn.node_id = rs.start_node
        OR rn.node_id = rs.end_node

      LEFT JOIN roads r
        ON rs.road_id = r.road_id
      
      GROUP BY rn.node_id

      ORDER BY rn.node_id ASC
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  // Additional for PUV Routing System
  public function getBarangayExits() {
    $conn = $this->conn();
    $sql = "
      SELECT
        exit_id,
        exit_name,
        node_id,
        description
      FROM barangay_exits
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function getNearestNode($lat, $lng) {
    $conn = $this->conn();
    $sql = "
      SELECT
        node_id,
        lat,
        lng
      FROM road_nodes

      ORDER BY SQRT(
        POW(lat - :lat, 2) +
        POW(lng - :lng, 2) 
      )
      LIMIT 1
    ";

    $stmt = $conn->prepare($sql);

    $stmt->execute([
      ':lat' => $lat,
      ':lng' => $lng
    ]);

    return $stmt->fetch(PDO::FETCH_ASSOC);
  }

  public function generateExitSuggestions($puvLat, $puvLng) {

    $startNode = $this->getNearestNode($puvLat, $puvLng);

    if(!$startNode) {
      return [];
    }

    $graph = $this->buildGraph();

    $exits = $this->getBarangayExits();

    $routes = [];

    foreach($exits as $exit) {
      $result = $this->dijkstra($graph, $startNode['node_id'], $exit['node_id']);

      if(empty($result['path'])) {
        continue;
      }

      $routes[] = [
        'exit_id' => $exit['exit_id'],
        'exit_name' => $exit['exit_name'],
        'description' => $exit['description'],
        'node_id' => $exit['node_id'],
        'distance' => $result['distance'],
        'path' => $result['path'] 
      ];
    }

    usort($routes, function($a, $b) {
      return $a['distance'] <=> $b['distance'];
    });

    return array_slice($routes, 0, 4);
  }

  public function getNodeCoordinates($nodeId) {
    $conn = $this->conn();
    $sql = "
      SELECT lat, lng
      FROM road_nodes
      WHERE node_id = :node_id
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute([ ':node_id' => $nodeId ]);

    return $stmt->fetch(PDO::FETCH_ASSOC);
  }

  public function geocodeDestination($destination) {

    $url =
      "https://nominatim.openstreetmap.org/search?" .
      http_build_query([
        'q' => $destination,
        'format' => 'json',
        'limit' => 1
      ]);

    $options = [
      'http' => [
        'header' =>
          "User-Agent: TrafficTransportManagementSystem/1.0\r\n"
      ]
    ];

    $context = stream_context_create($options);

    $response = file_get_contents(
      $url,
      false,
      $context
    );

    if(!$response) {
      return null;
    }

    $data = json_decode($response, true);

    if(empty($data)) {
      return null;
    }

    return [
      'lat' => $data[0]['lat'],
      'lng' => $data[0]['lon'],
      'display_name' => $data[0]['display_name']
    ];
  }
  
  public function buildDefaultRouteSuggestions(
    $terminalLat,
    $terminalLng,
    $destinationName
  ) {

    $destination =
      $this->geocodeDestination(
        $destinationName
      );

    if(!$destination) {
      return [];
    }

    $suggestions =
      $this->generateExitSuggestions(
        $terminalLat,
        $terminalLng
      );

    $routes = [];

    foreach($suggestions as $exit) {

      $exitCoords =
        $this->getNodeCoordinates(
          $exit['node_id']
        );

      if(!$exitCoords) {
        continue;
      }

      $barangayCoords = $this->getCoordsFromPath($exit['path']);

      $osrm =
        $this->getOSRMRoute([
          [
            $exitCoords['lng'],
            $exitCoords['lat']
          ],
          [
            $destination['lng'],
            $destination['lat']
          ]
        ]);

      $routes[] = [
        'exit_id' => $exit['exit_id'],
        'exit_name' => $exit['exit_name'],
        'description' => $exit['description'],

        'barangay_path' => $exit['path'],
        
        'barangay_coords' => $barangayCoords,

        'osrm_route' => $osrm
      ];
    }

    return $routes;
  }

  public function generateDiversionSuggestions($puvLat, $puvLng, $destinationName) {
    
    $destination = $this->geocodeDestination($destinationName);

    if(!$destination) {
      return [];
    }
    
    $startNode = $this->getNearestNode($puvLat, $puvLng);

    if(!$startNode) {
      return [];
    }

    $exits = $this->getBarangayExits();

    $routes = [];

    foreach($exits as $exit) {
      $alternatives = $this->generateAlternativeRoutes($startNode['node_id'], $exit['node_id'], 5);

      $exitCoords = $this->getNodeCoordinates($exit['node_id']);

      if(!$exitCoords) {
        continue;
      }

      foreach($alternatives as $route) {
        $barangayCoords = $this->getCoordsFromPath($route['path']);

        $osrm = $this->getOSRMRoute([
          [$exitCoords['lng'], $exitCoords['lat']], 
          [$destination['lng'], $destination['lat']]
        ]);
          
        $routes[] = [
          'exit_id' => $exit['exit_id'],
          'exit_name' => $exit['exit_name'],
          'description' => $exit['description'],

          'distance' => $route['distance'],
           
          'barangay_path' => $route['path'],

          'barangay_coords' => $barangayCoords,

          'osrm_route' => $osrm
        ];
      }
    }

    usort($routes, function($a, $b) {
      return $a['distance'] <=> $b['distance'];
    });

    return array_slice($routes, 0, 5);
  }
}
?>