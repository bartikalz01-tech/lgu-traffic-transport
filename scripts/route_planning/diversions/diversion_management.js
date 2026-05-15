import { fetchRoadNodes, fetchGeneratedDiversion, fetchRoadMap, activateDiversionRoute, fetchDiversions } from "../../data/fetch_road_map.js";
import { drawSimpleLine, initMap } from "../../utils/diversions.js";

let selectedStart = null;
let selectedEnd = null;
let routeLine = null;
let activeSelectedRoute = null;
let activatedRouteIndex = null;

function updateActivateButtonState() {
  const activateBtn = document.getElementById("activateDiversion");

  const currentActiveCard = document.querySelector(".active-route");

  if(!currentActiveCard) return;

  const currentIndex = parseInt(currentActiveCard.dataset.routeIndex);

  if(currentIndex === activatedRouteIndex) {
    activateBtn.innerHTML = `
      <i class="fas fa-check"></i>
      Diversion Activated
    `;
  } else {
    activateBtn.innerHTML = `
      <i class="fas fa-check-circle"></i>
      Activate Diversion
    `;
  }

  activateBtn.disabled = false;
}

function renderHighTrafficRoads(map, roads) {
  const highTrafficRoads = roads.filter(road => road.traffic_level === "high");

  highTrafficRoads.forEach(road => {
    L.polyline(road.coordinates, {
      color: "#e53935",
      weight: 7,
      opacity: 0.80
    }).addTo(map)
    .bindPopup(`
      <b>High Traffic</b>
      ${road.road_name}
    `);
  });
}

function updateHighTrafficCount(roads) {

  const highTrafficRoads = roads.filter(
    road => road.traffic_level === "high"
  );

  document.getElementById("highTrafficCount").textContent =
    highTrafficRoads.length;
}

function updateActiveDiversions(roads) {
  const activeDiversionRoads = roads;

  document.getElementById("activeDiversionCount").textContent = activeDiversionRoads.length;
}

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

        document.querySelector(".suggestions-list").innerHTML = `
          <label class="list-label">Diversion Suggestions</label>
          <div id="suggestionsPlaceholder" class="suggestions-loading">
            <div class="spinner"></div>
            <p>Select start and end points to generate routes</p>
          </div>
        `;
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

        if(selectedStart && selectedEnd) {
          const suggestionList = document.querySelector(".suggestions-list");
          suggestionList.innerHTML = `
            <label class="list-label">Diversion Suggestions</label>
            <div class="suggestions-loading active">
              <div class="spinner"></div>
              <p>Calculating optimal routes...</p>
            </div>
          `;
        }

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
  const suggestionList = document.querySelector(".suggestions-list");

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

  if(cards.length > 0) {
    cards[0].classList.add("active-route");
  }

  activeSelectedRoute = routes[0];

  cards.forEach(card => {

    card.addEventListener("click", () => {
      const index = parseInt(card.dataset.routeIndex);

      /*if(activatedRouteIndex !== null && index !== activatedRouteIndex) {
        return;
      }*/

      const selectedRoute = routes[index];

      activeSelectedRoute = selectedRoute;
      
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

      updateActivateButtonState();
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

      <div class="route-config">
        <label class="list-label">Route Configuration</label>
        <button class="toggle-btn" id="directionToggle" data-mode="two-way">
          <i class="fas fa-arrows-left-right"></i>
          <span>Two way route</span>
        </button>
      </div>

      <div class="suggestions-list">
        <label class="list-label">Diversion Suggesstions</label>
        <div id="suggestionPlaceholder" class="sugestions-loading">
          <div class="spinner"></div>
          <p>Select start and end points to generate routes</p>
        </div>
      </div>

      <div class="sidebar-actions">
        <button class="btn btn-primary btn-full" id="activateDiversion">
          <i class="fas fa-check-circle"></i>
          Activate Diversion
        </button>
      </div>
    </aside>
  `;

  const diversionMap = initMap("map-placeholder");

  const roadMap = await fetchRoadMap();
  const activeDiversions = await fetchDiversions();
  renderHighTrafficRoads(diversionMap, roadMap);
  updateHighTrafficCount(roadMap);
  updateActiveDiversions(activeDiversions);

  const nodes = await fetchRoadNodes();
  renderRoadNodes(diversionMap, nodes);

  const dirToggle = document.getElementById('directionToggle');
  dirToggle.addEventListener('click', () => {
    const isTwoWay = dirToggle.getAttribute('data-mode') === 'two-way';
    if (isTwoWay) {
      dirToggle.setAttribute('data-mode', 'one-way');
      dirToggle.innerHTML = '<i class="fas fa-arrow-right"></i> <span>One-Way Only</span>';
      dirToggle.classList.add('one-way-active');
    } else {
      dirToggle.setAttribute('data-mode', 'two-way');
      dirToggle.innerHTML = '<i class="fas fa-arrows-left-right"></i> <span>Two-Way Route</span>';
      dirToggle.classList.remove('one-way-active');
    }
  });

  const activateBtn = document.getElementById("activateDiversion"); 

  activateBtn.addEventListener("click", async () => {
    
    if(!activeSelectedRoute) {
      alert("Please select a route first");
      return;
    }

    const routeMode = dirToggle.getAttribute("data-mode");

    console.log(activeSelectedRoute);

    const payload = {
      start_road_id: activeSelectedRoute.start_road.road_id,
      end_road_id: activeSelectedRoute.end_road.road_id,
      route_config: routeMode,
      distance: activeSelectedRoute.distance,
      vehicle_per_min: 0,
      avg_speed: 0,
      points: activeSelectedRoute.points
    };

    activateBtn.disabled = true;
    activateBtn.innerHTML = `
      <i class="fas fa-spinner"></i>
      Activating...
    `;

    const result = await activateDiversionRoute(payload);

    if(result.status === "success") {

      activatedRouteIndex = parseInt(document.querySelector(".active-route").dataset.routeIndex);

      /*activateBtn.innerHTML = `
        <i class="fas fa-check"></i>
        Diversion Activated
      `;*/

      updateActivateButtonState();

      const cards = document.querySelectorAll(".suggestion-card");

      cards.forEach((card, index) => {
        /*if(index !== activatedRouteIndex) {
          card.classList.add("disabled-route");
        } else {
          card.classList.add("activated-route");
        }*/
        card.classList.remove("activated-route");

        if(index === activatedRouteIndex) {
          card.classList.add("activated-route");
        }
      });

    } else {
      activateBtn.disabled = false;

      activateBtn.innerHTML = `
        <i class="fas fa-check-circle"></i>
        Activate Diversion
      `;

      alert(result.message || "Activation failed.");
    }

  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const diversionContent = document.querySelector('.diversion-main-content');

  await renderDiversionManagement(diversionContent);
});