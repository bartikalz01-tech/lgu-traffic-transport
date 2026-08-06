let roadLayers = {};

const trafficColors = {
  low: "#28a745",
  moderate: "#f39c12",
  high: "#dc3545"
};

export async function congestionMap(map, roads) {

  roads.forEach(road => {
    const color = trafficColors[road.traffic_level?.toLowerCase()] || "#6c757d";

    if(roadLayers[road.road_id]) {
      roadLayers[road.road_id]
        .setLatLngs(road.coordinates)
        .setStyle({
          color: color,
          weight: 7,
          opacity: 0.70
        });
      
      return;
    }

    roadLayers[road.road_id] = L.polyline(
      road.coordinates,
      {
        color: color,
        weight: 7,
        opacity: 0.70
      }
    )
    .bindPopup(`
      <strong>${road.road_name}</strong><br>
      Traffic: ${road.traffic_level}
    `).addTo(map);

  });

}