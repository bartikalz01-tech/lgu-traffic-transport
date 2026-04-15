export function renderDiversionRoutes(container) {
  container.innerHTML = `
    <div class="route-card">
      <div class="left-part">
        <div class="route-map-display"></div>
      </div>

      <div class="right-part">
        <div class="info-header">
          <span class="status-badge pending">Pending</span>
          <h3>Diversion Alpha</h3>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <label><i class="fas fa-play"></i> Start Route/label>
            <p class="road-value">Mt.Natib</p> 
          </div>

          <div class="info-item">
            <label><i class="fas fa-location-dot"></i> Destination</label>
            <p class="road-value"Kalandang></p>
          </div>

          <div class="info-item">
            <label><i class="fas fa-road"></i> Distance</label>
            <p class="kilometer-value">15 km</p>
          </div>

          <div class="card-actions">
            <button class="btn btn-sm- btn-info">Activate</button>
          </div>
        </div>
      </div>
    </div>
  `;
}