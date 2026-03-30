import { fetchRoadsDiversion, fetchRoadDiversionCoord } from "../data/fetch_road_map.js";
//import { renderRouteList } from "../utils/traffic_and_events.js";
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

    for (const road of selectedRoute) {
      const coords = await fetchRoadDiversionCoord(road.road_id);

      /*coords.forEach(point => {
        fullCoordinates.push([point.latitude, point.longtitude]);
      });*/
      const roadCoords = coords.map(point => [point.latitude, point.longtitude]);

      if(fullCoordinates.length === 0) {
        fullCoordinates = roadCoords;
      } else {
        const lastPoint = fullCoordinates[fullCoordinates.length - 1];
        const firstPoint = roadCoords[0];
        const lastPointOfView = roadCoords[roadCoords.length - 1];
        
        const distStart = distance(lastPoint, firstPoint);
        const distEnd = distance(lastPoint, lastPointOfView);

        if(distEnd < distStart) {
          roadCoords.reverse();
        }

        roadCoords.shift();

        fullCoordinates = fullCoordinates.concat(roadCoords);
      }
    }

    if (routeLine) {
      diversionMap.removeLayer(routeLine);
    }

    routeLine = L.polyline(fullCoordinates, {
      color: "blue",
      weight: 6
    }).addTo(diversionMap);

    diversionMap.fitBounds(routeLine.getBounds());

  });

  document.getElementById("saveRoute").addEventListener("click", async () => {
    const startRoad = document.getElementById("startRoad").value;
    const endRoad = document.getElementById("endRoad").value;
    const date = document.getElementById("diversionDate").value;
    const time = document.getElementById("diversionTime").value;

    if(!startRoad || !endRoad || selectedRoute.length === 0) {
      alert("Please complete the route before saving.");
      return;
    }

    const scheduleDate = `${date} ${time}`;

    const payload = {
      startRoad: startRoad,
      endRoad: endRoad,
      scheduleDate: scheduleDate,
      routes: selectedRoute
    };
    
    try {
      const response = await fetch('../api/save_diversion.php', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if(result.status === "success") {
        alert("Diversion saved successfuly");
        selectedRoute = [];
        renderRouteList();

        if(routeLine) {
          diversionMap.removeLayer(routeLine);
        }
      } else {
        alert("Failed to save diversion");
      }
    } catch(error) {
      console.error("Error saving diversion", error);
    } 
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

  function distance(a, b) {
    const dx = a[0] - b[0];
    const dy = a[1] - b[1];
    
    return Math.sqrt(dx * dx + dy * dy);
  }
}