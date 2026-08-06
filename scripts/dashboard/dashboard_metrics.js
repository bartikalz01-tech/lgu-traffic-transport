const totalHighTrafficRoads = document.getElementById("totalHighTrafficRoads");
const totalVehiclesPerMin = document.getElementById("totalVehiclesPerMin");
const averageSpeed = document.getElementById("averageSpeed");

export function updateRoadMetrics(roads) {
  
  const highTrafficRoads = roads.filter(road => road.traffic_level?.toLowerCase() === "high");

  totalHighTrafficRoads.textContent = highTrafficRoads.length;
}

export function updateTrafficMetric(trafficData) {
   const totalVehicleFlow = trafficData.reduce(
    (sum, road) => sum + Number(road.vehicle_flow || 0),
    0
  );
  totalVehiclesPerMin.textContent = totalVehicleFlow;

  const validSpeeds = trafficData.filter(
    road => road.avg_speed !== null && road.avg_speed !== undefined
  );

  const avgSpeed = validSpeeds.length
    ? validSpeeds.reduce(
        (sum, road) => sum + Number(road.avg_speed || 0),
        0
      ) / validSpeeds.length
    : 0;  
  
  averageSpeed.textContent = `${avgSpeed.toFixed(1)} km/h`;
}