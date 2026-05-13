import { fetchRoadNodes, fetchGeneratedDiversion } from "../../data/fetch_road_map.js";
import { drawSimpleLine, initMap } from "../../utils/diversions.js";

let selectedStart = null;
let selectedEnd = null;
let routeLine = null;

function renderRoadNodes(map, nodes) {

  nodes.forEach(node => {
    const marker = L.circleMarker(
      [node.lat, node.lng],
      {
        radius: 6,
        color: "#1e88e5",
        fillColor: "#42a5f5",
        fillOpacity: 1,
        weight: 2
      }
    ).addTo(map);

    marker.bindPopup(`
      <b>Intersection</b><br>
      ${node.roads}<br><br> 
    `);

    marker.on("click", async () => {

      if(selectedStart && selectedEnd) {
        selectedStart = null;
        selectedEnd = null;

        document.getElementById("startPointName").textContent = "Awaiting Selection...";

        document.getElementById("endPointName").textContent = "Awaiting Selection";

        map.eachLayer(layer => {
          if(layer instanceof L.CircleMarker) {
            layer.setStyle({
              color: "#1e88e5",
              fillColor: "#42a5f5"
            });
          }
        });
      }

      if(!selectedStart) {
        selectedStart = node;

        document.getElementById("startPointName").textContent = node.roads;

        marker.setStyle({
          color: "#43a047",
          fillColor: "#66bb6a"
        });

        return;
      }

      if(!selectedEnd && node.node_id !== selectedStart.node_id) {
        selectedEnd = node;

        document.getElementById("endPointName").textContent = node.roads;

        marker.setStyle({
          color: "#e53935",
          fillColor: "#ef5350"
        });

        const routes = await fetchGeneratedDiversion(selectedStart.node_id, selectedEnd.node_id);

        if(!routes || routes.length === 0) {
          return;
        }

        const fastestRoute = routes[0];

        document.getElementById("calcDistance").textContent = `${fastestRoute.distance} km`;

        renderSuggestions(routes, map);

        const fastestRoutePoints = fastestRoute.points.map(point => ({
          lat: parseFloat(point.lat),
          lng: parseFloat(point.lng)
        }));

        routeLine = drawSimpleLine(map, fastestRoutePoints, routeLine); 

        return;
      }

    });
  });

}

function renderSuggestions(routes, map) {
  const suggestionList = document.querySelector(".suggesstions-list");

  let html = `
    <label class="list-label">
      Diversion Suggestions
    </label>
  `;

  routes.forEach((route, index) => {
    let badge = "alternative";

    if(index === 0) {
      badge = "fastest";
    } else if(index === 1) {
      badge = "shortest";
    }

    const uniqueRoads = [
      ...new Set(
        route.points.map(point => point.road_name).filter(Boolean)
      )
    ];

    html += `
      <div class="suggestion-card" data-route-index="${index}">
        <div class="suggestion-meta">
          <span class="badge ${badge}">
            Route ${index + 1}
          </span>
          <span class="eta">${route.estimated_time}</span>
        </div>

        <ul class="affected-roads-list">
          ${uniqueRoads.map(road => `
            <li>${road}</li>
          `).join("")}
        </ul>
      </div>
    `;
  });

  suggestionList.innerHTML = html;

  const cards = document.querySelectorAll(".suggestion-card");

  cards.forEach(card => {

    card.addEventListener("click", () => {
      const index = parseInt(card.dataset.routeIndex);

      const selectedRoute = routes[index];
      
      const clickedPoints = selectedRoute.points.map(point => ({
        lat: parseFloat(point.lat),
        lng: parseFloat(point.lng)
      }));

      routeLine = drawSimpleLine(map, clickedPoints, routeLine);

      document.getElementById("calcDistance").textContent = `${selectedRoute.distance} km`;

      cards.forEach(c => {
        c.classList.remove("active-route");
      });

      card.classList.add("active-route");
    });

  });
}

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
          <ul class="affected-roads-list" id="affectedRoads">
            <li>Mauban St.</li>
            <li>Tagaytay St.</li>
            <li>A. Bonifacio Ave.</li>
          </ul>
        </div>

        <div class="suggestion-card">
          <div class="suggestion-meta">
            <span class="badge shortest">Shortest</span>
            <span class="eta">14 min</span>
          </div>
          <ul class="affected-roads-list" id="affectedRoads">
            <li>Mauban St.</li>
            <li>Tagaytay St.</li>
            <li>A. Bonifacio Ave.</li>
          </ul>
        </div>

        <div class="suggestion-card">
          <div class="suggestion-meta">
            <span class="badge alternative">Balanced</span>
            <span class="eta">12 min</span>
          </div>
          <ul class="affected-roads-list" id="affectedRoads">
            <li>Mauban St.</li>
            <li>Tagaytay St.</li>
            <li>A. Bonifacio Ave.</li>
          </ul>
        </div>
      </div>
    </aside>
  `;

  const diversionMap = initMap("map-placeholder");

  const nodes = await fetchRoadNodes();

  renderRoadNodes(diversionMap, nodes);
}

document.addEventListener('DOMContentLoaded', async () => {
  const diversionContent = document.querySelector('.diversion-main-content');

  await renderDiversionManagement(diversionContent);
});