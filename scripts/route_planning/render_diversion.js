import { initMap, drawSimpleLine } from "../utils/diversions.js"; 
import { fetchDiversions, fetchDiversionDetails } from "../data/fetch_road_map.js"; 

export async function renderDiversionRoutes(container) {
  const diversions = await fetchDiversions();

  if(!diversions.length) {
    container.innerHTML = "<p>No diversion routes found</p>";
    return;
  }

  container.innerHTML = diversions.map(route => `
    <div class="route-card">
      <div class="left-part">
        <div class="route-map-display" id="map-diversion-${route.diversion_id}"></div>
      </div>

      <div class="right-part">
        <div class="info-header">
          <span class="status-badge pending">Pending</span>
          <h3>Diversion #${route.diversion_id}</h3>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <label><i class="fas fa-play"></i> Start Route</label>
            <p class="road-value">${route.start_name ?? 'N/A'}</p> 
          </div>

          <div class="info-item">
            <label><i class="fas fa-location-dot"></i> Destination</label>
            <p class="road-value">${route.end_name ?? 'N/A'}</p>
          </div>

          <div class="info-item">
            <label><i class="fas fa-road"></i> Distance</label>
            <p class="kilometer-value">${route.distance} km</p>
          </div>

          <div class="card-actions">
            <button class="btn btn-sm- btn-info">Activate</button>
          </div>
        </div>
      </div>
    </div>
  `).join("");

  for(const route of diversions) {
    const mapId = `map-diversion-${route.diversion_id}`;
    const map = initMap(mapId);

    const points = await fetchDiversionDetails(route.diversion_id);

    if(!points.length) continue;

    drawSimpleLine(map, points);

    const start = points[0];
    const end = points[points.length - 1];

    L.marker([start.lat, start.lng]).addTo(map).bindPopup("Start");

    L.marker([end.lat, end.lng]).addTo(map).bindPopup("End");
  }
}