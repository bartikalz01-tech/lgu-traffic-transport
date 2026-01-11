<?php
require 'config.php';

class TrafficFlow extends config
{

  public function trafficFlow(){
    $conn = $this->conn();
    $sql = "SELECT 
        r.road_name,
        tf.traffic_condition,
        tf.traffic_time,
        tf.traffic_date
      FROM traffic_flow tf
      JOIN roads r 
        ON tf.road_id = r.road_id
      ORDER BY 
        CASE tf.traffic_condition
          WHEN 'High Traffic' THEN 1
          WHEN 'Moderate Traffic' THEN 2
          WHEN 'Low Traffic' THEN 3
          ELSE 4
        END,
        tf.traffic_time DESC";
    $data = $conn->prepare($sql);
    $data->execute();
      
    return $result = $data->fetchAll(PDO::FETCH_ASSOC);
  }
}
