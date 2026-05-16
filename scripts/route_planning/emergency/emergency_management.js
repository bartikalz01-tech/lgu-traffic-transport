import { getEmergenciesLocation, getEmergencyRoute, getRespondersByType } from "../../data/fetch_emergencies.js";
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

async function renderEmergencyPlan(container) {

  container.innerHTML = `
    <div class="emergency-map-container">
      <div id="emergency-map"></div>
    </div>

    <aside class="ai-routes-container">
      <div class="ai-header">
        <h3><i class="fas fa-satellite-dish"></i> Nearest Responders</h3>
      </div>

      <div class="responder-list">
        <div class="responder-placeholder">
          <i class="fas fa-map-location-dot"></i>
          <p>Select an incident marker on the map to query closest emergency responders</p>
        </div>
        <div class="responder-group-section" id="primaryGroupSection">
          <div class="group-label">
            <i class="fas fa-star"></i> Primary Emergency Responders
          </div>

          <div id="primaryResponderContainer"></div>
        </div>

        <div class="responder-group-section" id="supportiveGroupSection">
          <div class="group-label">
            <i class="fas fa-handshake"></i> Optional Support Units
          </div>

          <div id="supportiveResponderContainer">
            <!--<div class="responder-item medical-dept">
              <div class="responder-icon">
                <i class="fas fa-hospital-user"></i>
              </div>
              <div class="responder-info">
                <h4>Metro General Hospital</h4>
                <p><i class="fas fa-map-marker-alt"></i> 124 medical center blvd</p>
              </div>
              <div class="responder-distance">
                <span class="dist-value">1.85</span>
                <span class="dist-unit">km</span>
              </div>
            </div>-->

            <!--<div class="responder-item police-dept">
              <div class="responder-icon">
                <i class="fas fa-shield-halved"></i>
              </div>
              <div class="responder-info">
                <h4>Central Police Precinct 3</h4>
                <p><i class="fas fa-map-marker-alt"></i> 404 Law Enforcement Rd</p>
              </div>
              <div class="responder-distance">
                <span class="dist-value">3.20</span>
                <span class="dist-unit">km</span>
              </div>
            </div>-->
          </div>
        </div>
      </div>

      <div class="emergency-card-actions" id="activeBtnContainer" style="display: none;"> 
        <button class="btn-primary-dispatch" id="activeBtn">
          <i class="fas fa-bullhorn"></i> Deploy & Activate Route
        </button>
      </div>
    </aside>
  `;

  let emergencyMap;

  async function drawEmergencyRoute(emergencyId, responderId) {
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

  let selectedEmergencyId = null;
  let selectedRouteData = null;
  let routeLine = null;
  let emergencyMarkers = {};
  let responderMarkers = {};

  const primaryResponderItems = document.getElementById("primaryResponderContainer");
  const supportiveResponderItems = document.getElementById("supportiveResponderContainer");
  const primaryGroupSection = document.getElementById("primaryGroupSection");
  const supportiveGroupSection = document.getElementById("supportiveGroupSection");
  const activeBtnContainer = document.getElementById("activeBtnContainer");
  const activeBtn = document.getElementById("activeBtn");
  const responderPlaceholder = document.querySelector(".responder-placeholder");

  emergencyMap = L.map('emergency-map').setView([14.6414, 120.9909], 20);

  const emergencies = await getEmergenciesLocation();

  emergencies.forEach(emergency => {
    const marker = L.marker([
      emergency.latitude,
      emergency.longitude
    ], {
      icon: getEventMarker(
        emergency.type,
        emergency.road_name
      )
    }).addTo(emergencyMap);

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

      primaryResponderItems.innerHTML = "";

      supportiveResponderItems.innerHTML = "";

      if (!responders || responders.length === 0) {
        responderPlaceholder.style.display = "flex";

        primaryGroupSection.style.display = "none";
        supportiveGroupSection.style.display = "none";

        return;
      } else {
        responderPlaceholder.style.display = "none";

        primaryGroupSection.style.display = "block";
        supportiveGroupSection.style.display = "block";
      }

      activeBtnContainer.style.display = "none";

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

        const route = await getEmergencyRoute(selectedEmergencyId, responder.responder_id);

        const distanceKm = route ? (route.distance / 1000).toFixed(2) : "0.00";

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

        responderItem.addEventListener("click", () => {
          const responderId = responder.responder_id;

          const marker = responderMarkers[responderId];

          drawEmergencyRoute(selectedEmergencyId, responderId);

          if (marker) {
            const latlng = marker.getLatLng();

            emergencyMap.setView(latlng, 17);

            marker.openPopup();
          }
        });

        primaryResponderItems.appendChild(responderItem);
      });

      activeBtnContainer.style.display = "flex";

      emergencyMap.setView([emergency.latitude, emergency.longitude], 15);
    });
  });

  activeBtn.addEventListener('click', async () => {
    if (!selectedRouteData) {
      alert("Please Select a responder first");
      return;
    }

    const response = await fetch('../api/emergencies/save_emergency_routes.php', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(selectedRouteData)
    })

    const result = await response.json();

    if (result.status === "success") {
      alert("Emergency Route activated successfully");

      const emergencyMarker = emergencyMarkers[selectedRouteData.emergency_id];

      if (emergencyMarker) {
        emergencyMap.removeLayer(emergencyMarker);
      }

      if (routeLine) {
        emergencyMap.removeLayer(routeLine);
        routeLine = null;
      }

      Object.values(responderMarkers).forEach(marker => {
        emergencyMap.removeLayer(marker);
      });

      responderMarkers = {};

      primaryResponderItems.innerHTML = "";
      supportiveResponderItems.innerHTML = "";

      responderPlaceholder.style.display = "flex";

      activeBtnContainer.style.display = "none";

      primaryGroupSection.style.display = "none";
      supportiveGroupSection.style.display = "none";

      selectedRouteData = null;
      selectedEmergencyId = null;
    }
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(emergencyMap);
}

document.addEventListener("DOMContentLoaded", async () => {
  const settingEmergencyRoutes = document.querySelector(".js-setting-emergency-routes");

  await renderEmergencyPlan(settingEmergencyRoutes);
});