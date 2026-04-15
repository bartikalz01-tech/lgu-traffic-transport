import { initMap } from "../utils/diversions.js"; 

export function renderActiveRoutes(contanier) {
  contanier.innerHTML = `
    <div class="active-route-card">
      <div class="active-left-part">
        <div class="route-map-display" id="active-map-1"></div>
      </div>
      <div class="active-right-part">
        <div class="active-info-header">
          <span class="status-badge active">Active</span>
          <h3>Diversion Alpha</h3>
        </div>

        <div class="active-info-grid">
          <div class="active-info-item">
            <label><i class="fas fa-play"></i> Start Route</label>
            <p class="road-value">Mt.Natib</p>
          </div>

          <div class="active-info-item">
            <label><i class="fas fa-location-dot"></i> Destination</label>
            <p class="road-value">Kalandang</p>
          </div>

          <div class="active-info-item">
            <label><i class="fas fa-calendar-check"></i> Deadline</label>
            <p class="date-value">April 10 - 6:00pm</p>
          </div>

          <div class="active-info-item">
            <label><i class="fas fa-road"></i> Distance</label>
            <p class="kilometer-value">15 km</p>
          </div>

          <div class="active-info-item">
            <label><i class="fas fa-car"></i> Vehicles Per Min</label>
            <p class="vehicle-per-min-value"> 24</p>
          </div>

          <div class="active-info-item">
            <label><i class="fas fa-tachometer-alt"></i> Average Route Speed</label>
            <p class="route-speed-value"> 37km/h</p>
          </div>
        </div>
      </div>
    </div>
  `;

  const map = initMap("active-map-1");
}