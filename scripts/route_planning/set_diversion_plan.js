import { fetchRoadsDiversion, fetchRoadDiversionCoord, fetchSmartRoute } from "../data/fetch_road_map.js";
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
            <input id="startRoad" placeholder="Starting Road" readonly>
          </div>

          <div class="route-group">
            <label>Destination Road</label>
            <input id="endRoad" placeholder="Destination" readonly>
          </div>

          <!--<div class="route-group route-group-row">
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <label>Build Route (Step by Step)</label>
              <select id="nextRoad"></select>
            </div>
            <button id="addRoadBtn">Add</button>
          </div>-->

          <div class="route-preview">
            <h4>Selected Route</h4>
            <ul id="routeList"></ul>
          </div>

          <div class="route-group">
            <!--<label><i class="fas fa-calendar-alt"></i> Set Schedule</label>
            <input type="date" id="diversionDate">
            <input type="time" id="diversionTime">-->
          </div>

          <div class="route-actions">
            <!--<button class="generateRoute">Preview on Map</button>-->
            <button id="saveRoute">Save Diversion</button>
          </div>
        </div>
      </div>
    </div>
  `;

  setDivesionPlan.classList.remove('diversion-plan-hidden');

  await new Promise(resolve => requestAnimationFrame(resolve));

  const roads = await fetchRoadsDiversion();

  let allRoadCoordinates = [];

  for (const road of roads) {
    const coords = await fetchRoadDiversionCoord(road.road_id);

    coords.forEach(point => {
      allRoadCoordinates.push({
        road_id: road.road_id,
        road_name: road.road_name,
        lat: point.latitude,
        lng: point.longtitude
      });
    });
  }

  let selectedRoute = [];
  let routeLine = null;
  let diversionMap;

  let clickedPoints = [];
  let markers = [];

  diversionMap = L.map('diversion-map').setView([14.6414, 120.9909], 18);

  const startInput = document.getElementById("startRoad");
  const endInput = document.getElementById("endRoad");
  let startRoadId = null;
  let endRoadId = null;

  diversionMap.on('click', (e) => {
    const { lat, lng } = e.latlng;

    const marker = L.marker([lat, lng]).addTo(diversionMap);

    const nearest = getNearestRoad(lat, lng);
    const isFirstPoint = clickedPoints.length === 0;

    const pointData = {
      road_id: nearest.road_id,
      lat,
      lng
    };

    markers.push(marker);
    clickedPoints.push(pointData);

    if(isFirstPoint) {
      startInput.value = nearest.road_name;
      startRoadId = nearest.road_id;
    }

    endInput.value = nearest.road_name;
    endRoadId = nearest.road_id;

    marker.on('click', () => {
      diversionMap.removeLayer(marker);

      const markerIndex = markers.indexOf(marker);
      if(markerIndex !== -1) {
        markers.splice(markerIndex, 1);
        clickedPoints.splice(markerIndex, 1);
      }
      
      updateRouteAfterDelete();
    });

    if (nearest) {
      const last = selectedRoute[selectedRoute.length - 1];

      if(clickedPoints.length === 0) {
        startInput.value = nearest.road_name;
        startRoadId = nearest.road_id;
      }

      endInput.value = nearest.road_name;
      endRoadId = nearest.road_id;

      if (!last || last.road_id != nearest.road_id) {
        selectedRoute.push({
          road_id: nearest.road_id,
          road_name: nearest.road_name
        });

        renderRouteList();
      }
    }

    if (clickedPoints.length >= 2) {
      drawSimpleLine();
    }
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(diversionMap);

  document.getElementById("saveRoute").addEventListener("click", async () => {
    const startRoad = startRoadId;
    const endRoad = endRoadId;
    //const date = document.getElementById("diversionDate").value;
    //const time = document.getElementById("diversionTime").value;

    if (!startRoad || !endRoad || selectedRoute.length === 0) {
      alert("Please complete the route before saving.");
      return;
    }

    //const scheduleDate = `${date} ${time}`;

    const payload = {
      startRoad: startRoad,
      endRoad: endRoad,
      points: clickedPoints
    };

    //console.log(JSON.stringify(payload, null, 2));

    try {
      const response = await fetch('../api/save_diversion.php', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.status === "success") {
        alert("Diversion saved successfuly");
        selectedRoute = [];
        renderRouteList();

        if (routeLine) {
          diversionMap.removeLayer(routeLine);
        }

        markers.forEach(marker => diversionMap.removeLayer(marker));
        markers = [];
        clickedPoints = [];
      } else {
        alert("Failed to save diversion");
      }
    } catch (error) {
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

  function drawSimpleLine() {
    if (routeLine) {
      diversionMap.removeLayer(routeLine);
    }

    routeLine = L.polyline(clickedPoints, {
      color: "blue",
      weight: 4
    }).addTo(diversionMap);

    diversionMap.fitBounds(routeLine.getBounds());
  }

  function distance(a, b) {
    const dx = a[0] - b[0];
    const dy = a[1] - b[1];

    return Math.sqrt(dx * dx + dy * dy);
  }

  function getNearestRoad(lat, lng) {
    let nearest = null;
    let minDistance = Infinity;

    allRoadCoordinates.forEach(point => {
      const d = distance([lat, lng], [point.lat, point.lng]);

      if (d < minDistance) {
        minDistance = d;
        nearest = point;
      }
    });

    return nearest;
  }

  function updateRouteAfterDelete() {
    if(routeLine) {
      diversionMap.removeLayer(routeLine);
    }

    if(clickedPoints.length >= 2) {
      drawSimpleLine();
    }

    if(clickedPoints.length === 0) {
      startInput.value = "";
      endInput.value = "";
      startRoadId = null;
      endRoadId = null;
      selectedRoute = [];
      renderRouteList();
      return;
    }

    const first = clickedPoints[0];
    const last = clickedPoints[clickedPoints.length - 1];

    const startRoad = allRoadCoordinates.find(r => r.road_id == first.road_id);
    const endRoad = allRoadCoordinates.find(r => r.road_id == last.road_id);

    if(startRoad) {
      startInput.value = startRoad.road_name;
      startRoadId = startRoad.road_id;
    }

    if(endRoad) {
      endInput.value = endRoad.road_name;
      endRoadId = endRoad.road_id;
    }

    selectedRoute = [];

    clickedPoints.forEach(point => {
      const road = allRoadCoordinates.find(r => r.road_id == point.road_id);

      if(road) {
        const last = selectedRoute[selectedRoute.length - 1];

        if(!last || last.road_id != road.road_id) {
          selectedRoute.push({
            road_id: road.road_id,
            road_name: road.road_name
          });
        }
      }
    });

    renderRouteList();
  }
}