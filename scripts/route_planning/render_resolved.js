import { initMap } from "../utils/diversions.js"; 

export function renderResolvedRoutes(container) {
  container.innerHTML = `
    <div class="resolved-route-card failed-border">
      <!-- The failed Diversion Plan will be based on avg speed (optional: vehicle count) -->
      <div class="resolved-summary">
        <div class="mini-map-placeholder" id="resolved-map-1"></div>

        <div class="resolved-main-info">
          <div class="resolved-header">
            <h3>Diversion Gamma <small>#D-098</small></h3>
            <span class="status-badge failed">Failed</span>
          </div>
          <div class="resolved-quick-stats">
            <span><i class="fas fa-play"></i> Klawit</span>
            <span><i class="fas fa-location-dot"></i> Kalandang</span>
          </div>

          <div class="resolved-schedule-info">
            <div class="schedule-item">
              <label><i class="fas fa-calendar-days"></i> Project Duration</label>
              <p>April 01, 2026 - April 12, 2026</p>
            </div>
            <div class="schedule-item">
              <label><i class="fas fa-clock"></i> Active Window</label>
              <p>Daily at 6:00pm - 10:00pm</p>
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

  const map = initMap("resolved-map-1");
}