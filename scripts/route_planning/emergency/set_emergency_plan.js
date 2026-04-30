import { getEmergenciesLocation, getEmergencyRoute, getRespondersByType } from "../../data/fetch_emergencies.js";
import { getEmergencyPlan } from "../../global_variables.js";
import { getEventMarker } from "../../utils/traffic_and_events.js";

function getResponderIcon(type) {
  if (type === "fire") {
    return `<i class="fas fa-fire-extinguisher"></i>`;
  } else if (type === "hospital") {
    return `<i class="fas fa-hospital-user"></i>`
  } else if (type === "police") {
    return `<i class="fas fa-shield-halved"></i>`;
  }
}

export async function renderEmergencyPlan() {
  const setEmergencyPlan = getEmergencyPlan();

  setEmergencyPlan.innerHTML = `
    <button class="exit-emergency-plan js-exit-emergency">
      <i class="fas fa-times"></i>
    </button>

    <div class="emergency-routes-container">
      <h2><i class="fas fa-truck-medical"></i> Emergency Routes</h2>
      <div class="setting-emergency-routes">
        <div class="emergency-map-container">
          <div id="emergency-map"></div>
        </div>

        <div class="ai-routes-container">
          <div class="ai-header">
            <h3><i class="fas fa-satellite-dish"></i> Nearest Responders</h3>
            <span class="pulse-indicator">Live</span>
          </div>
          
          <div class="responder-list">
            <div class="responder-placeholder">
              <i class="fas fa-map-location-dot"></i>
              <p>Select an incident marker on the map to view nearest responders</p>
            </div>
          </div>

          <div class="emergency-card-actions" id="activeContainer" style="display: none;">
            <button class="btn btn-info" id="activeEmergencyBtn">Activate</button>
          </div>
        </div>
      </div>
    </div>
  `;

  setEmergencyPlan.classList.remove('emergency-hidden')

  let emergencyMap;

  emergencyMap = L.map('emergency-map').setView([14.6414, 120.9909], 18);

  async function drawEmergencyRoute(emergencyId, responderId) { // put this later on the utils folder, file named emergencyUtils
    const data = await getEmergencyRoute(emergencyId, responderId);

    if (routeLine) {
      emergencyMap.removeLayer(routeLine);
    }

    const latlngs = data.route.map(p => [p.lat, p.lng]);

    routeLine = L.polyline(latlngs, {
      color: "blue",
      weight: 5
    }).addTo(emergencyMap);

    emergencyMap.fitBounds(routeLine.getBounds());

    selectedRouteData = {
      emergency_id: emergencyId,
      responder_id: responderId,
      distance: data.distance,
      eta: data.duration,
      route: data.route
    };
  }

  const emergencies = await getEmergenciesLocation();
  const respondersContainer = document.querySelector('.responder-list');
  const activeContainer = document.getElementById("activeContainer");
  const activeBtn = document.getElementById("activeEmergencyBtn");

  let emergencyMarkers = {};
  let responderMarkers = {};
  let selectedEmergencyId = null;
  let routeLine = null;
  let selectedRouteData = null;

  emergencies.forEach(emergency => {
    const marker = L.marker([
      emergency.latitude,
      emergency.longitude
    ], { icon: getEventMarker(emergency.type, emergency.road_name) }).addTo(emergencyMap);

    marker.bindPopup(`
      <b>${emergency.type.toUpperCase()}</b><br>
      Road: ${emergency.road_name ?? 'Unknown'}<br>
      Status: ${emergency.status}  
    `);

    emergencyMarkers[emergency.emergency_id] = marker;

    marker.on("click", async () => {

      Object.values(responderMarkers).forEach(m => emergencyMap.removeLayer(m));
      responderMarkers = {};
      
      selectedEmergencyId = emergency.emergency_id;

      let responderType = "";

      if (emergency.type === "fire") {
        responderType = "fire";
      } else if (emergency.type === "accident") {
        responderType = "hospital";
      } else if (emergency.type === "crime") {
        responderType = "police";
      }

      const responders = await getRespondersByType(responderType);

      respondersContainer.innerHTML = "";

      activeContainer.style.display = "none";

      responders.forEach(async (responder) => {
        const responderMarker = L.marker([
          responder.latitude,
          responder.longitude
        ]).addTo(emergencyMap);

        responderMarkers[responder.responder_id] = responderMarker;

        responderMarker.bindPopup(`
          <b>${responder.responder_name}</b><br>
          ${responder.responder_address}
        `);

        let typeClass = "";

        if (responder.type === "fire") {
          typeClass = "fire-dept";
        } else if (responder.type === "hospital") {
          typeClass = "medical-dept";
        } else if (responder.type === "police") {
          typeClass = "police-dept";
        }

        const routeData = await getEmergencyRoute(selectedEmergencyId, responder.responder_id);

        const distanceKm = routeData ? (routeData.distance / 1000).toFixed(2) : "0.00";

        const responderItem = document.createElement('div');

        responderItem.className = `responder-item ${typeClass}`;

        responderItem.innerHTML = `
          <div class="responder-icon">
            ${getResponderIcon(responder.type)}
          </div>
          <div class="responder-info">
            <h4>${responder.responder_name}</h4>
            <p><i class="fas fa-map-marker-alt"></i> ${responder.responder_address}</p>
          </div>
          <div class="responder-distance">
            <span class="dist-value">${distanceKm}</span>
            <span class="dist-unit">km</span>
          </div>
        `;

        responderItem.addEventListener('click', () => {
          const responderId = responder.responder_id;

          const marker = responderMarkers[responderId];

          drawEmergencyRoute(selectedEmergencyId, responderId);

          if(marker) {
            const latlng = marker.getLatLng();

            emergencyMap.setView(latlng, 17);

            marker.openPopup();
          }
        });

        respondersContainer.appendChild(responderItem);
      });

      activeContainer.style.display = "flex";

      emergencyMap.setView([emergency.latitude, emergency.longitude], 15);
    });
  });

  activeBtn.addEventListener('click', async () => {
    if(!selectedRouteData) {
      alert("Please select a responder first.");
      return;
    }

    const response = await fetch('../api/emergencies/save_emergency_routes.php', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(selectedRouteData)
    });

    const result = await response.json();

    if(result.status === "success") {
      alert("Emergency Route activated successfully");

      const emergencyMarker = emergencyMarkers[selectedRouteData.emergency_id];

      if(emergencyMarker) {
        emergencyMap.removeLayer(emergencyMarker);
      }

      if(routeLine) {
        emergencyMap.removeLayer(routeLine);
        routeLine = null;
      }

      Object.values(responderMarkers).forEach(marker => {
        emergencyMap.removeLayer(marker);
      });

      responderMarkers = {};

      respondersContainer.innerHTML = `
        <div class="responder-placeholder">
          <i class="fas fa-map-location-dot"></i>
          <p>Select an incident marker on the map to view nearest responders</p>
        </div>
      `;

      activeContainer.style.display = "none";

      selectedRouteData = null;
    } else {
      alert("Failed to activate route.");
    }
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(emergencyMap);
}