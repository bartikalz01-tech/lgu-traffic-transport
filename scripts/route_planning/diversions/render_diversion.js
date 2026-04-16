import { initMap, drawSimpleLine } from "../../utils/diversions.js";
import { setScheduleDiversionRoute } from "./set_schedule.js";
import { fetchDiversions, fetchDiversionDetails } from "../../data/fetch_road_map.js";

export async function renderDiversionRoutes(container) {
  const diversions = await fetchDiversions();

  if (!diversions.length) {
    container.innerHTML = "<p>No diversion routes found</p>";
    return;
  }

  container.innerHTML = `
    ${diversions.map(route => `
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
              <label>Start Route</label>
              <p>${route.start_name ?? 'N/A'}</p> 
            </div>

            <div class="info-item">
              <label>Destination</label>
              <p>${route.end_name ?? 'N/A'}</p>
            </div>

            <div class="info-item">
              <label>Distance</label>
              <p>${route.distance} km</p>
            </div>

            <div class="card-actions">
              <button 
                class="btn btn-sm btn-info js-activate-btn" 
                data-id="${route.diversion_id}">
                Activate
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join("")}

    <!-- SINGLE overlay -->
    <div id="scheduleOverlay" class="diversion-schedule-overlay schedule-hidden"></div>
  `;

  for (const route of diversions) {
    const mapId = `map-diversion-${route.diversion_id}`;
    const map = initMap(mapId);

    const points = await fetchDiversionDetails(route.diversion_id);

    if (!points.length) continue;

    drawSimpleLine(map, points);

    const start = points[0];
    const end = points[points.length - 1];

    L.marker([start.lat, start.lng]).addTo(map).bindPopup("Start");

    L.marker([end.lat, end.lng]).addTo(map).bindPopup("End");
  }

  const overlay = document.getElementById("scheduleOverlay");

  container.addEventListener("click", async (e) => {
    const btn = e.target.closest(".js-activate-btn");
    if(!btn) return;

    const diversionId = btn.dataset.id;

    overlay.classList.remove("schedule-hidden");

    await setScheduleDiversionRoute(overlay);

    //This is optional for storing ID for later use.
    overlay.dataset.diversionId = diversionId;
  });

  overlay.addEventListener("click", (e) => {
    if(e.target.closest(".js-exit-schedule")) {
      overlay.classList.add("schedule-hidden");
      overlay.innerHTML = "";
    }
  });
}