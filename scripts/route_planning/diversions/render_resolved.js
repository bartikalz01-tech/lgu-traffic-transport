import { initMap, formatDateOnly, formatTimeOnly, clearAllMaps } from "../../utils/diversions.js";
import { fetchAllDiversionStatus, fetchDiversionDetails } from "../../data/fetch_road_map.js";
import { drawSimpleLine } from "../../utils/diversions.js";

export async function renderResolvedRoutes(container) {

  clearAllMaps();

  const allRoutes = await fetchAllDiversionStatus();

  const resolvedRoutes = allRoutes.filter(route => route.status === "resolved");

  if (!resolvedRoutes.length) {
    container.innerHTML = "<p>No resolved routes</p>";
    return;
  }

  container.innerHTML = resolvedRoutes.map((route, index) => {

    return `
      <div class="resolved-route-card resolved-border">
        <!-- The failed Diversion Plan will be based on avg speed (optional: vehicle count) -->
        <div class="resolved-summary">
          <div class="mini-map-placeholder" id="resolved-map-${route.diversion_id}-${index}"></div>

          <div class="resolved-main-info">
            <div class="resolved-header">
              <h3>Diversion <small>#D-${route.diversion_id}</small></h3>
              <span class="status-badge resolved">Resolved</span>
            </div>
            <div class="resolved-quick-stats">
              <span><i class="fas fa-play"></i> ${route.start_name}</span>
              <span><i class="fas fa-location-dot"></i> ${route.end_name}</span>
            </div>

            <div class="resolved-schedule-info">
              <div class="schedule-item">
                <label><i class="fas fa-calendar-days"></i> Project Duration</label>
                <p>${formatDateOnly(route.start_datetime)} - ${formatDateOnly(route.end_datetime)}</p>
              </div>
              <div class="schedule-item">
                <label><i class="fas fa-clock"></i> Active Window</label>
                <p>Daily at ${formatTimeOnly(route.start_datetime)} - ${formatTimeOnly(route.end_datetime)}</p>
              </div>
            </div>
          </div>

          <div class="resolved-metrics">
            <div class="metric-box">
              <label>Avg Speed</label>
              <p>12 km/h</p>
            </div>
            <div class="metric-box">
              <label>Total Flow</label>
              <p>1.2k Vehicles</p>
            </div>
          </div>

          <div class="resolved-actions">
            <button class="btn btn-icon-delete" title="Delete record">
              <i class="fas fa-trash-can"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  /*for (const route of resolvedRoutes) {
    const mapId = `resolved-map-${route.diversion_id}`;

    const mapElement = document.getElementById(mapId);

    if(!mapElement) {
      console.warn(`Map container not found: ${mapId}`);
      continue;
    }

    const map = initMap(mapId);

    setTimeout(async () => {
      const points = await fetchDiversionDetails(route.diversion_id);

      if (!points.length) return;

      drawSimpleLine(map, points);

      const start = points[0];
      const end = points[points.length - 1];

      L.marker([start.lat, start.lng]).addTo(map).bindPopup("Start");
      L.marker([end.lat, end.lng]).addTo(map).bindPopup("End");
    }, 100);
  }*/

  for (const [index, route] of resolvedRoutes.entries()) {
    const mapId = `resolved-map-${route.diversion_id}-${index}`;

    const mapElement = document.getElementById(mapId);
    if (!mapElement) continue;

    if(mapElement.offsetParent === null) {
      console.warn("Map hidden, skipping:", mapId);
      continue;
    }

    console.log(mapId, mapElement.offsetHeight);

    const map = initMap(mapId);

    // 🔥 VERY IMPORTANT FIX
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    const points = await fetchDiversionDetails(route.diversion_id);

    if (!points || !points.length) continue;

    drawSimpleLine(map, points);

    const start = points[0];
    const end = points[points.length - 1];

    L.marker([start.lat, start.lng]).addTo(map).bindPopup("Start");
    L.marker([end.lat, end.lng]).addTo(map).bindPopup("End");
  }
}