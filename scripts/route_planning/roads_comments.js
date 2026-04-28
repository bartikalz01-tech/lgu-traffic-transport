// Mauban St. Polylines
/*
(14.64080, 120.98961)
(14.64072, 120.98986)
(14.64062, 120.99018)
(14.64050, 120.99055)
(14.64037, 120.99099)
(14.64026, 120.99134)
*/

//Tagaytay St. Polylines
/*
(14.64081, 120.98958)
(14.64102, 120.98966)
(14.64119, 120.98974)
(14.64154, 120.98992)
(14.64198, 120.99016)
(14.64220, 120.99027)
(14.64252, 120.99033)
*/

//Kalandang St. Polylines
/*
(14.64125, 120.98981)
(14.64117, 120.99006)
(14.64107, 120.99036)
(14.64101, 120.99056)
(14.64089, 120.99094)
(14.64077, 120.99130)
(14.64070, 120.99153)
*/

//Klawit St. Polylines
/*
(14.64167, 120.99005)
(14.64151, 120.99056)
(14.64138, 120.99096)
(14.64125, 120.99140)
(14.64115, 120.99172)
*/

//Mt.Natib St. Polylines
/*
(14.64210, 120.99028)
(14.64194, 120.99078)
(14.64180, 120.99121)
(14.64166, 120.99165)
(14.64157, 120.99190)
*/

//Dome St. Polylines
/*
(14.64251, 120.99044)
(14.64235, 120.99091)
(14.64227, 120.99113)
(14.64219, 120.99136)
(14.64206, 120.99174)
(14.64198, 120.99196)
*/


/*

FOR AI LATER ON DIVERSION PLAN

CREATE TABLE road_connections (
  connection_id INT PRIMARY KEY AUTO_INCREMENT,
  from_road_id INT,
  to_road_id INT,

  FOREIGN KEY (from_road_id) REFERENCES roads(road_id),
  FOREIGN KEY (to_road_id) REFERENCES roads(road_id)
);

*/

/* Diversion tables

CREATE TABLE diversion_routes (
  diversion_id INT PRIMARY KEY AUTO_INCREMENT,
  start_road_id INT,
  end_road_id INT,
  schedule_date DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (start_road_id) REFERENCES roads(road_id),
  FOREIGN KEY (end_road_id) REFERENCES roads(road_id)
);


CREATE TABLE diversion_routes_details (
  diversion_detail_id INT PRIMARY KEY AUTO_INCREMENT,
  diversion_id INT,
  road_id INT,
  sequence_order INT,
  
  FOREIGN KEY (diversion_id) REFERENCES diversion_routes(diversion_id),
  FOREIGN KEY (road_id) REFERENCES roads(road_id)
);

CREATE TABLE diversion_schedule (
  d_schedule_id INT PRIMARY KEY AUTO_INCREMENT,
  diversion_id INT NOT NULL,
  start_datetime DATETIME NOT NULL,
  end_datetime DATETIME NULL,
  status ENUM('scheduled', 'active', 'resolved') DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (diversion_id) REFERENCES diversion_routes (diversion_id)
  ON DELETE CASCADE
);

*/


/* 
Results of this QUERY "
  SELECT 
    AVG(latitude) AS lat,
    AVG(longtitude) AS lng
  FROM road_coordinates
  WHERE road_id = :road_id;
"
Dome = {
  lat: 14.64222666667
  lng: 120.99125666667
}

Mt.Natib = {
  lat: 14.64181400000,
  lng: 120.99116400000
}

Klawit = {
  lat: 14.64139200000,
  lng: 120.99093800000
}

Kalandang = {
  lat: 14.64098000000,
  lng: 120.99065142857
}

Mauban = {
  lat: 14.64054500000,
  lng: 120.99042166667
}

Tagaytay Street = {
  lat: 14.64165600000,
  lng: 120.98999000000
}
*/


/*
Algorithms to have a accurate location on emergencies

(Put this on a php file)
SELECT 
  rc.road_id,
  r.road_name,
  MIN(
    6371 * ACOS(
      COS(RADIANS(:lat)) * COS(RADIANS(rc.latitude)) *
      COS(RADIANS(rc.longtitude) - RADIANS(:lng)) +
      SIN(RADIANS(:lat)) * SIN(RADIANS(rc.latitude))
    )
  ) AS distance
FROM road_coordinates rc
JOIN roads r ON rc.road_id = r.road_id
GROUP BY rc.road_id
ORDER BY distance ASC
LIMIT 1;

(Auto road detection)
public function createEmergency($type, $lat, $lng) {
  $conn = $this->conn();

  // 🔥 find nearest road
  $road = $this->findNearestRoad($lat, $lng); // This is on the top the query that will be put on php file
  $road_id = $road['road_id'];

  $sql = "
    INSERT INTO emergencies (type, latitude, longitude, status, road_id)
    VALUES (:type, :lat, :lng, 'active', :road_id)
  ";

  $stmt = $conn->prepare($sql);
  $stmt->execute([
    ':type' => $type,
    ':lat' => $lat,
    ':lng' => $lng,
    ':road_id' => $road_id
  ]);
}

*/