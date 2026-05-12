import { initMap } from "../../utils/diversions.js";

async function renderDiversionManagement(container) {
  container.innerHTML = `
    <div class="map-view-container">
      <div id="map-placeholder">
        <div class="map-overlay-hint">
          <i class="fas fa-crosshairs"></i>
          <p>Click two intersections to plan a diversion</p>
        </div>
        <!-- Map will render here -->
      </div>
    </div>

    <aside class="diversion-sidebar">
      <div class="d-sidebar-header">
        <h3>Route Selection</h3>
      </div>

      <div class="selection-group">
        <div class="point-item start">
          <span class="dot"></span>
          <div class="point-info">
            <label>Starting Point</label>
            <p id="startPointName">Awaiting Selection...</p>
          </div>
        </div>

        <div class="point-item end">
          <span class="dot"></span>
          <div class="point-info">
            <label>End Point</label>
            <p id="endPointName">Awaiting Selection...</p>
          </div>
        </div>
      </div>

      <div class="distance-summary">
        <span>Total Distance:</span>
        <strong id="calcDistance">0.00 km</strong>
      </div>

      <div class="suggesstions-list">
        <label class="list-label">Diversion Suggesstions</label>

        <div class="suggestion-card">
          <div class="suggestion-meta">
            <span class="badge fastest">Fastest</span>
            <span class="eta">10 mins</span>
          </div>
          <p class="affected-roads">Via Mauban & Tagaytay St.</p>
        </div>

        <div class="suggestion-card">
          <div class="suggestion-meta">
            <span class="badge shortest">Shortest</span>
            <span class="eta">14 min</span>
          </div>
          <p class="affected-roads">Via Dome St. & G. Roxas</p>
        </div>

        <div class="suggestion-card">
          <div class="suggestion-meta">
            <span class="badge alternative">Balanced</span>
            <span class="eta">12 min</span>
          </div>
          <p class="affected-roads">Via Sgt. Rivera Ave.</p>
        </div>
      </div>
    </aside>
  `;

  const diversionMap = initMap("map-placeholder");
}

document.addEventListener('DOMContentLoaded', async () => {
  const diversionContent = document.querySelector('.diversion-main-content');

  await renderDiversionManagement(diversionContent);
});