import { fetchRoadNodes, fetchGeneratedDiversion, fetchRoadMap, activateDiversionRoute, fetchDiversions } from "../../data/fetch_road_map.js";
import { renderRouteSelectionSidebar, renderActiveDiversionsSidebar, initRouteSelectionSidebar } from "./diversion_sidebar_views.js";
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

        document.getElementById("sidebarActions").classList.add("hidden");

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

        await renderSuggestions(routes, map);

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

async function renderSuggestions(routes, map) {
  const suggestionList = document.querySelector(".suggestions-list");

  let html = `
    <label class="list-label">
      Diversion Suggestions
    </label>
  `;

  const activeDiversions = await fetchDiversions();

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

    const currentSignature = route.points.map(point => point.road_id).join("-");

    const matchedDiversion = activeDiversions.find(diversion => 
      diversion.route_signature === currentSignature
    );

    const isActive = !!matchedDiversion;

    html += `
      <div class="suggestion-card" data-route-index="${index}" data-is-active="${isActive}">
        <div class="suggestion-meta">
          <span class="badge ${badge}">
            ${isActive ? 'ACTIVE' : `Route ${index + 1}`}
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

  const sidebarActions = document.getElementById("sidebarActions");

  if(sidebarActions) {
    sidebarActions.classList.remove("hidden");
  }

  const cards = document.querySelectorAll(".suggestion-card");

  const activeCard = document.querySelector('.suggestion-card[data-is-active="true"]')

  if(activeCard) {
    cards.forEach(c => c.classList.remove("active-route"));

    activeCard.classList.add("active-route");

    activatedRouteIndex = parseInt(activeCard.dataset.routeIndex);

    activeSelectedRoute = routes[activatedRouteIndex];

    const activePoints = activeSelectedRoute.points.map(point => ({
      lat: parseFloat(point.lat),
      lng: parseFloat(point.lng)
    }));

    routeLine = drawSimpleLine(map, activePoints, routeLine);

    updateActivateButtonState();
  }

  if(cards.length > 0) {
    cards[0].classList.add("active-route");

    activeSelectedRoute = routes[0];
  }

  cards.forEach(card => {

    card.addEventListener("click", () => {
      const index = parseInt(card.dataset.routeIndex);

      const isAlreadyActive = card.dataset.isActive === "true";

      const selectedRoute = routes[index];

      activeSelectedRoute = selectedRoute;

      if(isAlreadyActive) {
        activatedRouteIndex = index;
      }
      
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
      ${renderRouteSelectionSidebar()}
    </aside>
  `;

  initRouteSelectionSidebar();

  const diversionMap = initMap("map-placeholder");

  const roadMap = await fetchRoadMap();
  const activeDiversions = await fetchDiversions();
  renderHighTrafficRoads(diversionMap, roadMap);
  updateHighTrafficCount(roadMap);
  updateActiveDiversions(activeDiversions);

  const nodes = await fetchRoadNodes();
  renderRoadNodes(diversionMap, nodes);

  const activateBtn = document.getElementById("activateDiversion"); 

  activateBtn.addEventListener("click", async () => {
    
    if(!activeSelectedRoute) {
      alert("Please select a route first");
      return;
    }

    const dirToggle = document.getElementById("directionToggle");

    const routeMode = dirToggle ? dirToggle.getAttribute("data-mode") : "two-way";

    console.log(activeSelectedRoute);

    const payload = {
      start_road_id: activeSelectedRoute.start_road.road_id,
      end_road_id: activeSelectedRoute.end_road.road_id,
      route_config: routeMode,
      distance: activeSelectedRoute.distance,
      vehicle_per_min: 0,
      avg_speed: 0,

      route_signature: activeSelectedRoute.points.map(
        point => point.road_id
      ).join("-"),

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

      alert("Diversion route activated successfully!");

      const activeCard = document.querySelector(".active-route");

      if(activeCard) {
        activeCard.dataset.isActive = "true";
      }

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

  const activeDiversionCard = document.querySelector(".overview-card.active-diversions");

  activeDiversionCard.addEventListener("click", async () => {

    if(routeLine) {
      diversionMap.removeLayer(routeLine);
      routeLine = null;
    }

    await renderActiveDiversionsSidebar(diversionMap);
  })

}

document.addEventListener('DOMContentLoaded', async () => {
  const diversionContent = document.querySelector('.diversion-main-content');

  await renderDiversionManagement(diversionContent);
});