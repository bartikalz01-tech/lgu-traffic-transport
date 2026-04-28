import { getEmergenciesLocation, getRespondersByType } from "../../data/fetch_emergencies.js";
import { getEmergencyPlan } from "../../global_variables.js";
import { getEventMarker } from "../../utils/traffic_and_events.js";

function getResponderIcon(type) {
  if(type === "fire") {
    return `<i class="fas fa-fire-extinguisher"></i>`;
  } else if(type === "hospital") {
    return `<i class="fas fa-hospital-user"></i>`
  } else if(type === "police") {
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
            <button class="btn btn-info">Activate</button>
          </div>
        </div>
      </div>
    </div>
  `;

  setEmergencyPlan.classList.remove('emergency-hidden')

  let emergencyMap;

  emergencyMap = L.map('emergency-map').setView([14.6414, 120.9909], 18);

  const emergencies = await getEmergenciesLocation();
  const respondersContainer = document.querySelector('.responder-list');
  const activeContainer = document.getElementById("activeContainer");

  let responderMarkers = {};

  emergencies.forEach(emergency => {
    const marker = L.marker([
      emergency.latitude,
      emergency.longitude
    ], {icon: getEventMarker(emergency.type, emergency.road_name)}).addTo(emergencyMap);

    marker.bindPopup(`
      <b>${emergency.type.toUpperCase()}</b><br>
      Road: ${emergency.road_name ?? 'Unknown'}<br>
      Status: ${emergency.status}  
    `);

    marker.on("click", async () => {

      Object.values(responderMarkers).forEach(m => emergencyMap.removeLayer());
      responderMarkers = {};

      let responderType = "";

      if(emergency.type === "fire") {
        responderType = "fire";
      } else if(emergency.type === "accident") {
        responderType = "hospital";
      } else if(emergency.type === "crime") {
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

        if(responder.type === "fire") {
          typeClass = "fire-dept";
        } else if(responder.type === "hospital") {
          typeClass = "medical-dept";
        } else if(responder.type === "police") {
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
          const id = item.getAttribute('data-id');

          const marker = responderMarkers[id];

          if(marker) {
            const latlng = marker.getLatLng();

            emergencyMap.setView(latlng, 17);

            marker.openPopup();
          }
        });
      });

    });
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(emergencyMap);
}