import { fetchRoadsDiversion, fetchRoadDiversionCoord, fetchSmartRoute } from "../../data/fetch_road_map.js";
import { renderRouteList, drawSimpleLine, getNearestRoad, calculateDistanceKm } from "../../utils/diversions.js";
import { getDivesionPlan } from "../../global_variables.js";

export async function renderDiversionPlan() {
  const setDivesionPlan = getDivesionPlan();

  setDivesionPlan.innerHTML = `
    <button class="exit-diversion-plan js-exit-diversion-plan">
      <i class="fas fa-times"></i>
    </button>

    <div class="diversion-plan-container">
      <h2><i class="fas fa-arrow-turn-up"></i> Diversion Routes</h2>
      <div class="setting-routes-container">
        <div class="map-and-details">
          <div class="map-container">
            <div id="diversion-map"></div>
          </div>

          <div class="route-preview">
            <div class="route-distance" id="routeDistance">
              <h4><i class="fas fa-route"></i> Active Path Details</h4>
              <p class="distance-display">Distance: <strong id="distanceValue">0km</strong><p>
            </div>
            <ul id="routeList"></ul>
          </div>
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

          <div class="ai-suggestion-container">
            <label><i class="fas fa-robot"></i> AI Recommended Diversions</label>
            <div class="ai-cards" id="aiRouteSuggestions">
              <div class="ai-route-card">
                <div class="mini-map-container" id="miniMap1"></div>
                <div class="card-details">
                  <div class="route-meta"><span>Option 1</span> <span>1.2km</span></div>
                  <div class="route-name">Tagaytay St Bypass</div>
                  <button class="select-ai-btn">Apply Route</button>
                </div>
              </div>

              <div class="ai-route-card loading">
                <div class="loading-spinner"><i class="fas fa-circle-notch"></i></div>
                <span>Awaiting points...</span>
              </div>
            </div>
          </div>

          <div class="route-actions">
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

    const nearest = getNearestRoad(lat, lng, allRoadCoordinates);
    const isFirstPoint = clickedPoints.length === 0;

    const pointData = {
      road_id: nearest.road_id,
      lat,
      lng
    };

    markers.push(marker);
    clickedPoints.push(pointData);
    updateDistanceDisplay();

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

        renderRouteList(selectedRoute);
      }
    }

    if (clickedPoints.length >= 2) {
      routeLine = drawSimpleLine(diversionMap, clickedPoints, routeLine);
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

    const distanceKm = calculateDistanceKm(clickedPoints);

    const payload = {
      startRoad: startRoad,
      endRoad: endRoad,
      distance: distanceKm,
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
        renderRouteList(selectedRoute);

        if (routeLine) {
          diversionMap.removeLayer(routeLine);
        }

        markers.forEach(marker => diversionMap.removeLayer(marker));
        markers = [];
        clickedPoints = [];
        updateDistanceDisplay();
      } else {
        alert("Failed to save diversion");
      }
    } catch (error) {
      console.error("Error saving diversion", error);
    }
  });

  function updateRouteAfterDelete() {
    if(routeLine) {
      diversionMap.removeLayer(routeLine);
    }

    if(clickedPoints.length >= 2) {
      routeLine = drawSimpleLine(diversionMap, clickedPoints, routeLine);
    }

    if(clickedPoints.length === 0) {
      startInput.value = "";
      endInput.value = "";
      startRoadId = null;
      endRoadId = null;
      selectedRoute = [];
      renderRouteList(selectedRoute);
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

    renderRouteList(selectedRoute);
    updateDistanceDisplay();
  }

  function updateDistanceDisplay() {
    const distanceValue = document.getElementById("distanceValue");
    
    if(clickedPoints.length < 2) {
      distanceValue.textContent = "0km";
      return;
    }

    const km = calculateDistanceKm(clickedPoints);
    distanceValue.textContent = `${km} km`;
  }
}