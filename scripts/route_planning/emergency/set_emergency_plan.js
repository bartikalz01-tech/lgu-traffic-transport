import { getEmergenciesLocation, getRespondersByType } from "../../data/fetch_emergencies.js";
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

  async function drawRoute(emergencyId, responderId) {
    const response = await fetch(`../api/get_route.php?emergency_id=${emergencyId}&responder_id=${responderId}`);
    const data = await response.json();

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

      responders.forEach(responder => {
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

        respondersContainer.innerHTML += `
          <div class="responder-item ${typeClass}" data-id="${responder.responder_id}">
            <div class="responder-icon">
              ${getResponderIcon(responder.type)}
            </div>
            <div class="responder-info">
              <h4>${responder.responder_name}</h4>
              <p><i class="fas fa-map-marker-alt"></i> ${responder.responder_address}</p>
            </div>
            <div class="responder-distance">
              <span class="dist-value">1.2</span>
              <span class="dist-unit">km</span>
            </div>
          </div>
        `
      });

      activeContainer.style.display = "flex";

      emergencyMap.setView([emergency.latitude, emergency.longitude], 15);

      document.querySelectorAll('.responder-item').forEach(item => {
        item.addEventListener('click', () => {
          //const id = item.getAttribute('data-id');
          const responderId = item.getAttribute('data-id');

          const marker = responderMarkers[responderId];

          drawRoute(selectedEmergencyId, responderId);

          if (marker) {
            const latlng = marker.getLatLng();

            emergencyMap.setView(latlng, 17);

            marker.openPopup();
          }
        });
      });

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
    } else {
      alert("Failed to activate route.");
    }
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(emergencyMap);
}