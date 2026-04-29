<?php

function haversine($lat1, $lng1, $lat2, $lng2) {
  $earth_radius = 6371;

  $dLat = deg2rad($lat2 - $lat1);
  $dLng = deg2rad($lng2 - $lng1);

  $a = sin($dLat/2) * sin($dLat/2) +
       cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
       sin($dLng/2) * sin($dLng/2);

  $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

  return $earth_radius * $c;
}

$roadALat = 14.64297500000; 
$roadALng = 120.99167400000; 

$roadBLat = 14.64054500000; 
$roadBLng = 120.99042166667; 

$distance = haversine(
  $roadALat, $roadALng,
  $roadBLat, $roadBLng
);

echo $distance; // The result is just for prototyping, make it real by doing sum of road_coordinates path length or Google Maps API / OSRM routing distance

?>