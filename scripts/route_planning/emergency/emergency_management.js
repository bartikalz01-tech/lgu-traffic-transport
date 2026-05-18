import { getEmergenciesLocation, getEmergencyRoute, getRespondersByType } from "../../data/fetch_emergencies.js";
import { getEventMarker } from "../../utils/traffic_and_events.js";
import { getEmeregncyEventMarker, getResponderMarkerIcon, loadAssingedRoutes } from "../../utils/emergencyUtils.js";

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
  let assignedRouteMemory = {};

  const primaryResponderItems = document.getElementById("primaryResponderContainer");
  const supportiveResponderItems = document.getElementById("supportiveResponderContainer");
  const primaryGroupSection = document.getElementById("primaryGroupSection");
  const supportiveGroupSection = document.getElementById("supportiveGroupSection");
  const activeBtnContainer = document.getElementById("activeBtnContainer");
  const activeBtn = document.getElementById("activeBtn");
  const responderPlaceholder = document.querySelector(".responder-placeholder");

  emergencyMap = L.map('emergency-map').setView([14.6414, 120.9909], 20);

  await loadAssingedRoutes(emergencyMap, assignedRouteMemory);

  const emergencies = await getEmergenciesLocation();

  const pendingEmergencyRoutes = document.getElementById("pendingEmergencyRoutes");
  const totalActiveEmergencies = document.getElementById("totalActiveEmergencies");

  const pendingCount = emergencies.filter(emergency => emergency.status === "active").length;

  const assignedCount = emergencies.filter(emergency => emergency.status === "assigned").length;

  pendingEmergencyRoutes.textContent = pendingCount;
  totalActiveEmergencies.textContent = assignedCount;

  const pendingCard = document.querySelector(".assigned-emergency");
  const assignedCard = document.querySelector(".emergency-arrival");

  function filterEmergencyMarkers(status) {
    // for em-kpi-cards
    Object.values(emergencyMarkers).forEach(data => {
      const marker = data.marker;

      if(data.status === status) {
        if(!emergencyMap.hasLayer(marker)) {
          marker.addTo(emergencyMap);
        }
      } else {
        if(emergencyMap.hasLayer(marker)) {
          emergencyMap.removeLayer(marker);
        }
      }
    });
  }

  pendingCard.addEventListener("click", () => {
    filterEmergencyMarkers("active");
  });

  assignedCard.addEventListener("click", () => {
    filterEmergencyMarkers("assigned");
  });

  emergencies.forEach(emergency => {
    const marker = L.marker([
      emergency.latitude,
      emergency.longitude
    ], {
      icon: getEmeregncyEventMarker(
        emergency.type,
        emergency.status
      )
    }).addTo(emergencyMap);

    emergencyMarkers[emergency.emergency_id] = { marker, status: emergency.status };

    marker.bindPopup(`
      <b>${emergency.type.toUpperCase()}</b><br>
      Road: ${emergency.road_name ?? 'Unknown'}<br>
      Status: ${emergency.status}  
    `);
    
    marker.on("click", async () => {

      if(emergency.status === "assigned") {

        Object.values(responderMarkers).forEach(marker => {
          emergencyMap.removeLayer(marker);
        });

        responderMarkers = {};

        primaryResponderItems.innerHTML = "";
        supportiveResponderItems.innerHTML = "";

        responderPlaceholder.style.display = "none";

        primaryGroupSection.style.display = "block";

        supportiveGroupSection.style.display = "none";

        activeBtnContainer.style.display = "none";

        if(routeLine) {
          emergencyMap.removeLayer(routeLine);
        }

        const assignedData = assignedRouteMemory[emergency.emergency_id];

        if(!assignedData) return;

        routeLine = assignedData.polyline.addTo(emergencyMap);

        const responderMarker = L.marker([
          assignedData.responder_lat,
          assignedData.responder_lng
        ], {
          icon: getResponderMarkerIcon(assignedData.responder_type)
        }).addTo(emergencyMap);

        responderMarker.bindPopup(`
          <b>${assignedData.responder_name}</b><br>
          Assigned Responder
        `);

        responderMarkers[assignedData.responder_id] = responderMarker

        emergencyMap.fitBounds(routeLine.getBounds());

        const responderItem = document.createElement("div");

        let responderClass = "";

        if(assignedData.responder_type === "fire") {
          responderClass = "fire-dept";
        } else if(assignedData.responder_type === "hospital") {
          responderClass = "medical-dept";
        } else if(assignedData.responder_type === "police") {
          responderClass = "police-dept"
        }

        responderItem.className = `responder-item ${responderClass} assigned-active`;
        responderItem.innerHTML = `
          <div class="responder-icon">
            ${getResponderIcon(assignedData.responder_type)}
          </div>

          <div class="responder-info">
            <h4>${assignedData.responder_name}</h4>
            <p>
              <i class="fas fa-map-marker-alt"></i>
              ${assignedData.responder_address ?? ''}
            </p>
          </div>

          <div class="responder-distance">
            <span class="dist-unit">
              ASSIGNED
            </span>
          </div>
        `;

        primaryResponderItems.appendChild(responderItem);

        return;
      }

      Object.values(responderMarkers).forEach(m => emergencyMap.removeLayer(m));
      responderMarkers = {};

      selectedEmergencyId = emergency.emergency_id;

      let responderType = "";
      let supportResponderTypes = [];

      if (emergency.type === "fire") {
        responderType = "fire";
        supportResponderTypes = ["hospital", "police"];
      } else if (emergency.type === "accident") {
        responderType = "hospital";
        supportResponderTypes = ["police"];
      } else if (emergency.type === "crime") {
        responderType = "police";
        supportResponderTypes = ["hospital"];
      }

      const responders = await getRespondersByType(responderType);

      const supportRespondersResults = await Promise.all(
        supportResponderTypes.map(type => getRespondersByType(type))
      );

      const supportResponders = supportRespondersResults.flat();

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
        ], {
          icon: getResponderMarkerIcon(responder.type)
        }).addTo(emergencyMap);

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

      supportResponders.forEach(async (supportResponder) => {

        const supportMarker = L.marker([
          supportResponder.latitude,
          supportResponder.longitude
        ], {
          icon: getResponderMarkerIcon(supportResponder.type)
        }).addTo(emergencyMap);

        responderMarkers[supportResponder.responder_id] = supportMarker;

        supportMarker.bindPopup(`
          <b>${supportResponder.responder_name}</b><br>
          ${supportResponder.responder_address}
        `);

        let supportClass = "";

        if(supportResponder.type === "fire") {
          supportClass = "fire-dept";
        } else if(supportResponder.type === "hospital") {
          supportClass = "medical-dept";
        } else if(supportResponder.type === "police") {
          supportClass = "police-dept"
        }

        const supportRoute = await getEmergencyRoute(
          selectedEmergencyId,
          supportResponder.responder_id
        );

        const supportDistanceKm = supportRoute ? (supportRoute.distance / 1000).toFixed(2) : "0.00";

        const supportItem = document.createElement("div");

        supportItem.className = `responder-item ${supportClass}`;

        supportItem.innerHTML = `
          <div class="responder-icon">
            ${getResponderIcon(supportResponder.type)}
          </div>

          <div class="responder-info">
            <h4>${supportResponder.responder_name}</h4>
            <p>
              <i class="fas fa-map-marker-alt"></i>
              ${supportResponder.responder_address}
            </p>
          </div>

          <div class="responder-distance">
            <span class="dist-value">${supportDistanceKm}</span>
            <span class="dist-unit">km</span>
          </div>
        `;

        supportItem.addEventListener("click", () => {
          const responderId = supportResponder.responder_id;

          const marker = responderMarkers[responderId];

          drawEmergencyRoute(
            selectedEmergencyId,
            responderId
          );

          if(marker) {
            const latlng = marker.getLatLng();

            emergencyMap.setView(latlng, 17);

            marker.openPopup();
          }
        });

        supportiveResponderItems.appendChild(supportItem);

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

      /*const emergencyMarker = emergencyMarkers[selectedRouteData.emergency_id];

      if (emergencyMarker) {
        emergencyMap.removeLayer(emergencyMarker);
      }*/

      const emergencyMarkerData = emergencyMarkers[selectedRouteData.emergency_id];

      const emergencyMarker = emergencyMarkerData?.marker;

      if (emergencyMarker) {
        emergencyMarker.setPopupContent(`
          <b>ASSIGNED ${selectedRouteData.emergency_id}</b><br>
          Status: assigned
        `);
      }

      /*if (routeLine) {
        emergencyMap.removeLayer(routeLine);
        routeLine = null;
      }

      Object.values(responderMarkers).forEach(marker => {
        emergencyMap.removeLayer(marker);
      });*/

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