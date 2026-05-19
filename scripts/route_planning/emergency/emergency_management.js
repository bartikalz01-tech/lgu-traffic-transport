import { getEmergenciesLocation, getEmergencyRoute, getRespondersByType } from "../../data/fetch_emergencies.js";
import { getEventMarker } from "../../utils/traffic_and_events.js";
import { clearAllRoutes, getEmergencyMarker, getResponderMarkerIcon, loadAssingedRoutes } from "../../utils/emergencyUtils.js";

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

    /*selectedRouteData = {
      emergency_id: emergencyId,
      responder_id: responderId,
      distance: data.distance,
      eta: data.duration,
      route: data.route
    };*/
  }

  function addResponderSelection(responderData) {
    const exists = selectedResponders.some(item => item.responder_id === responderData.responder_id);

    if(!exists) {
      selectedResponders.push(responderData);
    } 
  }

  function removeResponderSelection(responderId) {
    selectedResponders = selectedResponders.filter(item => item.responder_id !== responderId);
  }

  let selectedEmergencyId = null;
  let selectedEmergencyType = null;
  //let selectedRouteData = null;
  //let selectedPrimaryResponder = null;
  let selectedResponders = []; 
  let routeLine = null;
  let emergencyMarkers = {};
  let responderMarkers = {};
  let assignedRouteMemory = {};
  let activeAssignedPolylines = [];

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

    const clearedRoutes = clearAllRoutes(emergencyMap, routeLine, activeAssignedPolylines);

    routeLine = clearedRoutes.routeLine;
    activeAssignedPolylines = clearedRoutes.activeAssignedPolylines;

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

  async function renderSupportResponders(supportResponders, selectedEmergencyId) {

    supportiveResponderItems.innerHTML = "";

    for(const supportResponder of supportResponders) {

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
        supportClass = "police-dept";
      }

      const supportRoute = await getEmergencyRoute(
        selectedEmergencyId,
        supportResponder.responder_id
      );

      const supportDistanceKm = supportRoute
        ? (supportRoute.distance / 1000).toFixed(2)
        : "0.00";

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

      supportItem.addEventListener("click", async () => {

        const responderId = supportResponder.responder_id;

        const alreadySelected =
          supportItem.classList.contains("selected-responder");

        if(alreadySelected) {

          supportItem.classList.remove("selected-responder");

          removeResponderSelection(responderId);

        } else {

          supportItem.classList.add("selected-responder");

          addResponderSelection({
            emergency_id: selectedEmergencyId,
            responder_id: supportResponder.responder_id,
            responder_type: supportResponder.type,
            responder_name: supportResponder.responder_name,
            distance: supportRoute.distance,
            eta: supportRoute.duration,
            route: supportRoute.route,
            is_primary: false
          });
        }

        drawEmergencyRoute(
          selectedEmergencyId,
          responderId
        );

        const marker = responderMarkers[responderId];

        if(marker) {
          emergencyMap.setView(marker.getLatLng(), 17);
          marker.openPopup();
        }
      });

      supportiveResponderItems.appendChild(supportItem);
    }

  }

  emergencies.forEach(emergency => {
    const marker = L.marker([
      emergency.latitude,
      emergency.longitude
    ], {
      icon: getEmergencyMarker(
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

      selectedEmergencyId = emergency.emergency_id;
      selectedEmergencyType = emergency.type;
      selectedResponders = [];
      //selectedPrimaryResponder = null;

      if(emergency.status === "assigned") {

        activeAssignedPolylines.forEach(polyline => {
          emergencyMap.removeLayer(polyline);
        });

        activeAssignedPolylines = [];

        primaryResponderItems.innerHTML = "";
        supportiveResponderItems.innerHTML = "";

        responderPlaceholder.style.display = "none";

        primaryGroupSection.style.display = "block";
        supportiveGroupSection.style.display = "block";

        activeBtnContainer.style.display = "none";

        Object.values(responderMarkers).forEach(marker => {
          emergencyMap.removeLayer(marker);
        });

        responderMarkers = {};

        const assignedRoutes = assignedRouteMemory[emergency.emergency_id];

        if(!assignedRoutes || assignedRoutes.length === 0) return;

        /*const assignedRoutes = assignedRoutesRaw.filter(
          (route, index, self) =>
            index === self.findIndex(r =>
              r.responder_id === route.responder_id
            )
        );*/

        const bounds = [];

        assignedRoutes.forEach(assignedData => {

          assignedData.polyline.addTo(emergencyMap);

          activeAssignedPolylines.push(assignedData.polyline);

          assignedData.route_coords.forEach(coord => {
            bounds.push([coord.lat, coord.lng]);
          });

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

          responderMarkers[assignedData.responder_id] = responderMarker;

          let responderClass = "";

          if(assignedData.responder_type === "fire") {
            responderClass = "fire-dept";
          } else if(assignedData.responder_type === "hospital") {
            responderClass = "medical-dept";
          } else if(assignedData.responder_type === "police") {
            responderClass = "police-dept";
          }

          const responderItem = document.createElement("div");

          responderItem.className = `
            responder-item 
            ${responderClass} 
            assigned-active
          `;

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
                ${assignedData.selected == 1 ? "PRIMARY" : "SUPPORT"}
              </span>
            </div>
          `;

          if(assignedData.selected == 1) {
            primaryResponderItems.appendChild(responderItem);

            /*selectedPrimaryResponder = {
              emergency_id: emergency.emergency_id,
              responder_id: assignedData.responder_id,
              responder_type: assignedData.responder_type,
              responder_name: assignedData.responder_name,
              distance: assignedData.distance,
              eta: assignedData.eta,
              route: assignedData.route_coords,
              is_primary: true
            };

            selectedResponders = [selectedPrimaryResponder];*/

            addResponderSelection({
              emergency_id: emergency.emergency_id,
              responder_id: assignedData.responder_id,
              responder_type: assignedData.responder_type,
              responder_name: assignedData.responder_name,
              distance: assignedData.distance,
              eta: assignedData.eta,
              route: assignedData.route_coords,
              is_primary: true
            });

          } else {
            supportiveResponderItems.appendChild(responderItem);
          }

        });

        if(bounds.length > 0) {
          emergencyMap.fitBounds(bounds);
        }

        let supportResponderTypes = [];

        if (emergency.type === "fire") {
          supportResponderTypes = ["hospital", "police", "fire"];
        } else if (emergency.type === "accident") {
          supportResponderTypes = ["police"];
        } else if (emergency.type === "crime") {
          supportResponderTypes = ["hospital"];
        }

        const supportRespondersResults = await Promise.all(
          supportResponderTypes.map(type =>
            getRespondersByType(type)
          )
        );

        const assingedResponderIds = assignedRoutes.map(route => route.responder_id);

        const supportResponders = supportRespondersResults.flat()
          .filter(responder => !assingedResponderIds.includes(responder.responder_id));

        await renderSupportResponders(
          supportResponders,
          emergency.emergency_id
        );

        activeBtnContainer.style.display = "flex";

        return;
      }

      Object.values(responderMarkers).forEach(m => emergencyMap.removeLayer(m));
      responderMarkers = {};

      selectedEmergencyId = emergency.emergency_id;
      selectedEmergencyType = emergency.type

      //selectedPrimaryResponder = null;
      selectedResponders = [];

      let responderType = "";
      let supportResponderTypes = [];

      if (emergency.type === "fire") {
        responderType = "fire";
        supportResponderTypes = ["hospital", "police", "fire"];
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

      for(const responder of responders) {
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

        /*responderItem.addEventListener("click", () => {

          primaryResponderItems.querySelectorAll(".responder-item")
            .forEach(item => item.classList.remove("selected-responder"));
          
          responderItem.classList.add("selected-responder");

          const responderId = responder.responder_id;

          const marker = responderMarkers[responderId];

          drawEmergencyRoute(selectedEmergencyId, responderId);

          selectedPrimaryResponder = {
            emergency_id: selectedEmergencyId,
            responder_id: responder.responder_id,
            responder_type: responder.type,
            responder_name: responder.responder_name,
            distance: route.distance,
            eta: route.duration,
            route: route.route,
            is_primary: true
          };

          selectedResponders = [selectedPrimaryResponder];

          if (marker) {
            const latlng = marker.getLatLng();

            emergencyMap.setView(latlng, 17);

            marker.openPopup();
          }
        });*/

        responderItem.addEventListener("click", () => {
          const responderId = responder.responder_id

          const alreadySelected = responderItem.classList.contains("selected-responder");

          if(alreadySelected) {
            responderItem.classList.remove("selected-responder");

            removeResponderSelection(responderId);
          } else {
            responderItem.classList.add("selected-responder");

            addResponderSelection({
              emergency_id: selectedEmergencyId,
              responder_id: responder.responder_id,
              responder_type: responder.type,
              responder_name: responder.responder_name,
              distance: route.distance,
              eta: route.duration,
              route: route.route,
              is_primary: true
            });
          }

          drawEmergencyRoute(selectedEmergencyId, responderId);

          const marker = responderMarkers[responderId];

          if(marker) {
            emergencyMap.setView(marker.getLatLng(), 17);

            marker.openPopup();
          }
        });

        primaryResponderItems.appendChild(responderItem);
      }

      await renderSupportResponders(
        supportResponders,
        selectedEmergencyId
      );

      activeBtnContainer.style.display = "flex";

      emergencyMap.setView([emergency.latitude, emergency.longitude], 15);
    });
  });

  

  activeBtn.addEventListener('click', async () => {

    try {

      if (selectedResponders.length === 0) {
        alert("Please Select a responder first");
        return;
      }

      console.log("Sending responders:", selectedResponders);

      const response = await fetch('../api/emergencies/save_emergency_routes.php', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          emergency_id: selectedEmergencyId,
          responders: selectedResponders
        })
      });

      console.log("Fetch response received");

      const rawText = await response.text();

      console.log("RAW PHP RESPONSE:");
      console.log(rawText);

      const result = JSON.parse(rawText);

      console.log("Parsed result:", result);

      if (result.status === "success") {

        alert("Emergency Route activated successfully");

        const emergencyMarkerData = emergencyMarkers[selectedEmergencyId];

        const emergencyMarker = emergencyMarkerData?.marker;

        if (emergencyMarker) {

          emergencyMarker.setPopupContent(`
            <b>ASSIGNED ${selectedEmergencyId}</b><br>
            Status: assigned
          `);

          emergencyMarker.setIcon(
            getEmergencyMarker(selectedEmergencyType, "assigned")
          );
        }

        responderMarkers = {};

        primaryResponderItems.innerHTML = "";
        supportiveResponderItems.innerHTML = "";

        responderPlaceholder.style.display = "flex";

        activeBtnContainer.style.display = "none";

        primaryGroupSection.style.display = "none";
        supportiveGroupSection.style.display = "none";

        selectedEmergencyId = null;
      } else {

        alert(result.message || "Failed to save route");
      }

    } catch(error) {

      console.error("ACTIVE BTN ERROR:");
      console.error(error);

      alert("Something went wrong. Check console.");
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