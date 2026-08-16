import { fetchGeneratedDiversion, activateDiversionRoute, fetchDiversions } from "../../data/fetch_road_map.js";
import { drawSimpleLine } from "../../utils/diversions.js";
import {
  state,
  clearDiversionMap,
  renderRouteSelectionSidebar,
  initRouteSelectionSidebar,
  resetDiversionPlanner,
  updateActiveDiversions
} from "./diversion_state.js";

function resetNodeMarkers(map) {

  map.eachLayer(layer => {

    if(layer instanceof L.CircleMarker) {
      layer.setStyle({
        color: "#1e88e5",
        fillColor: "#42a5f5"
      });
    }

  });

}

export function bindRefreshButton(map) {

  const refreshBtn = document.querySelector(".refresh-btn");

  if (!refreshBtn) return;

  refreshBtn.addEventListener("click", () => {

    console.log("Refresh Button Clicked");

    clearDiversionMap(map);

    resetDiversionUI(map);

  });

}

export function resetDiversionUI(map) {

  state.selectedStart = null;
  state.selectedEnd = null;
  state.activeSelectedRoute = null;
  state.activatedRouteIndex = null;

  if(state.routeLine){
    map.removeLayer(state.routeLine);
    state.routeLine = null;
  }

  resetNodeMarkers(map);

  // Reset sidebar
  document.querySelector(".diversion-sidebar").innerHTML =
    renderRouteSelectionSidebar();

  initRouteSelectionSidebar();

  bindRefreshButton(map);

  bindActivateButton(map);

  document.getElementById("startPointName").textContent =
    "Awaiting Selection...";

  document.getElementById("endPointName").textContent =
    "Awaiting Selection...";

  document.getElementById("calcDistance").textContent =
    "0.00 km";
}

export { resetDiversionPlanner, updateActiveDiversions } from "./diversion_state.js";

export function bindActivateButton(map) {
  const activateBtn = document.getElementById("activateDiversion");

  if(!activateBtn) return;

  activateBtn.onclick = async () => {
    
    if(!state.activeSelectedRoute) {
      alert("Please select a route first");
      return;
    }

    const dirToggle = document.getElementById("directionToggle");

    const routeMode = dirToggle ? dirToggle.getAttribute("data-mode") : "two-way";

    console.log(state.activeSelectedRoute);

    const payload = {
      start_road_id: state.activeSelectedRoute.start_road.road_id,
      end_road_id: state.activeSelectedRoute.end_road.road_id,
      start_node_id: state.activeSelectedRoute.path[0],
      end_node_id: state.activeSelectedRoute.path[state.activeSelectedRoute.path.length - 1],
      route_config: routeMode,
      distance: state.activeSelectedRoute.distance,
      vehicle_per_min: 0,
      avg_speed: 0,

      route_signature: state.activeSelectedRoute.points.map(
        point => point.road_id
      ).join("-"),

      points: state.activeSelectedRoute.points
    };

    activateBtn.disabled = true;
    activateBtn.innerHTML = `
      <i class="fas fa-spinner"></i>
      Activating...
    `;

    const result = await activateDiversionRoute(payload);

    if(result.status === "success") {

      state.activatedRouteIndex = parseInt(document.querySelector(".active-route").dataset.routeIndex);

      alert("Diversion route activated successfully!");

      const updatedDiversions = await fetchDiversions();
      updateActiveDiversions(updatedDiversions);

      clearDiversionMap(map);

      resetDiversionUI(map);

      /*const activeCard = document.querySelector(".active-route");

      if(activeCard) {
        activeCard.dataset.isActive = "true";
      }

      updateActivateButtonState();

      const cards = document.querySelectorAll(".suggestion-card");

      cards.forEach((card, index) => {
        card.classList.remove("activated-route");

        if(index === state.activatedRouteIndex) {
          card.classList.add("activated-route");
        }
      });*/

    } else {
      activateBtn.disabled = false;

      activateBtn.innerHTML = `
        <i class="fas fa-check-circle"></i>
        Activate Diversion
      `;

      alert(result.message || "Activation failed.");
    }

  };
}

function updateActivateButtonState() {
  const activateBtn = document.getElementById("activateDiversion");

  const currentActiveCard = document.querySelector(".active-route");

  if(!currentActiveCard) return;

  const currentIndex = parseInt(currentActiveCard.dataset.routeIndex);

  if(currentIndex === state.activatedRouteIndex) {
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

export function renderHighTrafficRoads(map, roads) {
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

export function updateHighTrafficCount(roads) {

  const highTrafficRoads = roads.filter(
    road => road.traffic_level === "high"
  );

  document.getElementById("highTrafficCount").textContent =
    highTrafficRoads.length;
}

export function renderRoadNodes(map, nodes) {

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
      ${node.lat} | ${node.lng}
    `);

    marker.on("click", async () => {

      if(!state.plannerMode) return;

      console.log("Clicked Node ID: ", node.node_id);
      // There is an query of finding a road where the condition of road name

      if(state.selectedStart && state.selectedEnd) {

        const sidebarActions = document.getElementById("sidebarActions");
        const startPoint = document.getElementById("startPointName");
        const endPoint = document.getElementById("endPointName");
        
        if(sidebarActions) {
          sidebarActions.classList.add("hidden");
        }

        state.selectedStart = null;
        state.selectedEnd = null;

        if(startPoint) {
          startPoint.textContent = "Awaiting Selection...";
        }

        if(endPoint) {
          endPoint.textContent = "Awaiting Selection...";
        }

        map.eachLayer(layer => {
          if(layer instanceof L.CircleMarker) {
            layer.setStyle({
              color: "#1e88e5",
              fillColor: "#42a5f5"
            });
          }
        });

        const suggestionList = document.querySelector(".suggestions-list");

        if(suggestionList){
          suggestionList.innerHTML = `
            <label class="list-label">Diversion Suggestions</label>
            <div id="suggestionsPlaceholder" class="suggestions-loading">
              <div class="spinner"></div>
              <p>Select start and end points to generate routes</p>
            </div>
          `;
        }

      }

      if(!state.selectedStart) {
        state.selectedStart = node;

        document.getElementById("startPointName").textContent = node.roads;

        marker.setStyle({
          color: "#43a047",
          fillColor: "#66bb6a"
        });

        return;
      }

      if(!state.selectedEnd && node.node_id !== state.selectedStart.node_id) {
        state.selectedEnd = node;

        document.getElementById("endPointName").textContent = node.roads;

        marker.setStyle({
          color: "#e53935",
          fillColor: "#ef5350"
        });

        if(state.selectedStart && state.selectedEnd) {
          const suggestionList = document.querySelector(".suggestions-list");
          suggestionList.innerHTML = `
            <label class="list-label">Diversion Suggestions</label>
            <div class="suggestions-loading active">
              <div class="spinner"></div>
              <p>Calculating optimal routes...</p>
            </div>
          `;
        }

        const routes = await fetchGeneratedDiversion(state.selectedStart.node_id, state.selectedEnd.node_id);

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

        state.routeLine = drawSimpleLine(map, fastestRoutePoints, state.routeLine); 

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

    state.activatedRouteIndex = parseInt(activeCard.dataset.routeIndex);

    state.activeSelectedRoute = routes[state.activatedRouteIndex];

    const activePoints = state.activeSelectedRoute.points.map(point => ({
      lat: parseFloat(point.lat),
      lng: parseFloat(point.lng)
    }));

    state.routeLine = drawSimpleLine(map, activePoints, state.routeLine);

    updateActivateButtonState();
  }

  if(cards.length > 0 && !activeCard) {
    cards[0].classList.add("active-route");

    state.activeSelectedRoute = routes[0];
  }

  cards.forEach(card => {

    card.addEventListener("click", () => {
      const index = parseInt(card.dataset.routeIndex);

      const isAlreadyActive = card.dataset.isActive === "true";

      const selectedRoute = routes[index];

      state.activeSelectedRoute = selectedRoute;

      if(isAlreadyActive) {
        state.activatedRouteIndex = index;
      }
      
      const clickedPoints = selectedRoute.points.map(point => ({
        lat: parseFloat(point.lat),
        lng: parseFloat(point.lng)
      }));

      state.routeLine = drawSimpleLine(map, clickedPoints, state.routeLine);

      document.getElementById("calcDistance").textContent = `${selectedRoute.distance} km`;

      cards.forEach(c => {
        c.classList.remove("active-route");
      });

      card.classList.add("active-route");

      updateActivateButtonState();
    });

  });
}
