import { fetchRoadsDiversion, fetchRoadDiversionCoord } from "../data/fetch_road_map.js";
import { getDivesionPlan } from "../global_variables.js";

export async function renderDiversionPlan() {
  const setDivesionPlan = getDivesionPlan();

  setDivesionPlan.innerHTML = `
    <button class="exit-diversion-plan js-exit-diversion-plan">
      <i class="fas fa-times"></i>
    </button>

    <div class="diversion-plan-container">
      <h2><i class="fas fa-arrow-turn-up"></i> Diversion Routes</h2>
      <div class="setting-routes-container">
        <div class="map-container">
          <div id="diversion-map"></div>
        </div>
        <div class="set-routes">
          <div class="route-group">
            <label>Start Road</label>
            <select id="startRoad"></select>
          </div>

          <div class="route-group">
            <label>Destination Road</label>
            <select id="endRoad"></select>
          </div>

          <div class="route-group route-group-row">
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <label>Build Route (Step by Step)</label>
              <select id="nextRoad"></select>
            </div>
            <button id="addRoadBtn">Add</button>
          </div>

          <div class="route-preview">
            <h4>Selected Route</h4>
            <ul id="routeList"></ul>
          </div>

          <div class="route-group">
            <label><i class="fas fa-calendar-alt"></i> Set Schedule</label>
            <input type="date" id="diversionDate">
            <input type="time" id="diversionTime">
          </div>

          <div class="route-actions">
            <button class="generateRoute">Preview on Map</button>
            <button id="saveRoute">Save Diversion</button>
          </div>
        </div>
      </div>
    </div>
  `;

  setDivesionPlan.classList.remove('diversion-plan-hidden');

  let selectedRoute = [];
  let routeLine = null;
  let diversionMap;

  setTimeout(() => {
    diversionMap = L.map('diversion-map').setView([14.6414, 120.9909], 17.5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(diversionMap);
  }, 0);

  const roads = await fetchRoadsDiversion();

  const start = document.getElementById("startRoad");
  const end = document.getElementById("endRoad");
  const next = document.getElementById("nextRoad");

  roads.forEach(road => {
    start.add(new Option(road.road_name, road.road_id));
    end.add(new Option(road.road_name, road.road_id));
    next.add(new Option(road.road_name, road.road_id));
  });
  
  document.getElementById("addRoadBtn").addEventListener('click', () => {
    const select = document.getElementById("nextRoad");

    const road_id = select.value;
    const road_name = select.options[select.selectedIndex].text;

    selectedRoute.push({ road_id, road_name });

    renderRouteList();
  });

  document.querySelector(".generateRoute").addEventListener('click', async () => {
    let fullCoordinates = [];

    for(const road of selectedRoute) {
      const coords = await fetchRoadDiversionCoord(road.road_id);

      coords.forEach(point => {
        fullCoordinates.push([point.latitude, point.longtitude]);
      });
    }

    if(routeLine) {
      diversionMap.removeLayer(routeLine);
    }

    routeLine = L.polyline(fullCoordinates, {
      color: "blue",
      weight: 6
    }).addTo(diversionMap);

    diversionMap.fitBounds(routeLine.getBounds());

  });

  function renderRouteList() {
    const list = document.getElementById("routeList");
    list.innerHTML = "";

    selectedRoute.forEach((road, index) => {
      const li = document.createElement("li");
      li.textContent = `${index + 1}. ${road.road_name}`;
      list.appendChild(li);
    });
  }
}