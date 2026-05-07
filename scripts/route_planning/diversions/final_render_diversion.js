export async function renderDiversionMaps(container) {

  container.innerHTML = `
    <div class="map-view-wrapper">
      <div class="diversion-map-header">
        <div class="header-content">
          <p id="routeDescription">Enterting Tagaytay St Cor. Dome Street <i class="fas fa-arrow-right"></i> Exit in Cabatuan Cor. Mauban Street</p>
        </div>
      </div>

      <div class="map-container">
        <div id="map"></div>
      </div>

      <div class="map-navigation-bar">
        <button class="nav-arrow prev" id="prevRoute">
          <i class="fas fa-chevron-left"></i>
          <span>Previous Plan</span>
        </button>

        <div class="route-pagination">
          <span class="current-idx">1</span> / <span class="total-idx">3</span>
        </div>

        <button class="nav-arrow next" id="nextRoute">
          <span>Next Plan</span>
          <i class="fas fa-chevron-right"></i>
        </button> 
      </div>
    </div>
  `;
}