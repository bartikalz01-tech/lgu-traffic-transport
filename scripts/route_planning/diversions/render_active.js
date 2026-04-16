import { drawSimpleLine, initMap } from "../../utils/diversions.js"; 
import { fetchActiveDiversion, fetchDiversionDetails } from "../../data/fetch_road_map.js";
import { formatActiveDate } from "../../utils/diversions.js";

export async function renderActiveRoutes(contanier) {

  const activeDetails = await fetchActiveDiversion();

  if(!activeDetails.length) {
    contanier.innerHTML = "<p>No active/scheduled routes</p>";
    return;
  }

  contanier.innerHTML = activeDetails.map(active => `
    <div class="active-route-card">
      <div class="active-left-part">
        <div class="route-map-display" id="active-map-${active.diversion_id}"></div>
      </div>
      <div class="active-right-part">
        <div class="active-info-header">
          <span class="status-badge scheduled">${active.status}</span>
          <h3>Diversion #${active.diversion_id}</h3>
        </div>

        <div class="active-info-grid">
          <div class="active-info-item">
            <label><i class="fas fa-play"></i> Start Route</label>
            <p class="road-value">${active.start_name}</p>
          </div>

          <div class="active-info-item">
            <label><i class="fas fa-location-dot"></i> Destination</label>
            <p class="road-value">${active.end_name}</p>
          </div>

          <div class="active-info-item">
            <label><i class="fas fa-calendar-check"></i> Deadline</label>
            <p class="date-value">${formatActiveDate(active.start_datetime)}</p>
          </div>

          <div class="active-info-item">
            <label><i class="fas fa-road"></i> Distance</label>
            <p class="kilometer-value">${active.distance} km</p>
          </div>

          <div class="active-info-item">
            <label><i class="fas fa-car"></i> Vehicles Per Min</label>
            <p class="vehicle-per-min-value"> 0</p>
          </div>

          <div class="active-info-item">
            <label><i class="fas fa-tachometer-alt"></i> Average Route Speed</label>
            <p class="route-speed-value"> 0km/h</p>
          </div>
        </div>
      </div>
    </div>
  `);

  for(const route of activeDetails) {
    const mapId = `active-map-${route.diversion_id}`;
    const map = initMap(mapId);
    
    const points = await fetchDiversionDetails(route.diversion_id);

    if(!points.length) continue;

    drawSimpleLine(map, points);

    const start = points[0];
    const end = points[points.length - 1];

    L.marker([start.lat, start.lng]).addTo(map).bindPopup("Start");

    L.marker([end.lat, end.lng]).addTo(map).bindPopup("End");
  }

  /*activeDetails.forEach(route => {
    initMap(`active-map-${route.diversion_id}`);
  });*/
}