import { getPendingEmergenciesLocation, getRespondersByType } from "../../../data/fetch_emergencies.js";
import { mapMemory } from "../emergency_memory.js";
import { getEmergencyMarker, getResponderMarkerIcon } from "../../../utils/emergencyUtils.js";

export async function renderPendingEmergency(container, map) {

  container.innerHTML = `
    <div class="ai-header">
      <h3><i class="fas fa-satellite-dish"></i> Emergency Responders</h3>
    </div>

    <div class="responder-list" id="responderList"></div>
  `;

  const responderList = document.getElementById("responderList");

  const emergencies = await getPendingEmergenciesLocation();

  if(emergencies.length === 0) {
    responderList.innerHTML = `
      <div class="responder-placeholder">
        <i class="fas fa-circle-check"></i>
        <h3>No Pending Emergencies</h3>
        <p>There are currently no emergency incidents requiring dispatch.</p>
      </div>
    `;

    mapMemory.responderMarkers.forEach(marker => {
      map.removeLayer(marker);
    });

    mapMemory.responderMarkers.length = 0;

    mapMemory.emergencyMarkers.forEach(marker => {
      map.removeLayer(marker);
    });

    mapMemory.emergencyMarkers.length = 0;

    return;
  }

  responderList.innerHTML = `
    <div class="responder-placeholder">
      <i class="fas fa-location-crosshairs"></i>
      <h3>Select an Emergency</h3>
      <p>Click an emergency marker on the map to view the nearset available responders</p>
    </div>
  `;

  mapMemory.emergencyMarkers.forEach(marker => {
    map.removeLayer(marker);
  });

  mapMemory.emergencyMarkers.length = 0;

  // This will reveal the emergencies location on the map with the specific type.
  emergencies.forEach(emergency => {
   const emergencyMarker = L.marker([
    emergency.latitude,
    emergency.longitude
   ], {
    icon: getEmergencyMarker(emergency.type, emergency.status)
   }).addTo(map);

   mapMemory.emergencyMarkers.push(emergencyMarker);

   emergencyMarker.on("click", async () => {
    const responders = await getRespondersByType(emergency.type);

    responderList.innerHTML = `
      <div class="responder-group-section">
        <div class="group-label">
          <i class="fas fa-star"></i>
          Primary Emergency Responders
        </div>

        <div id="primaryResponders"></div>
      </div>

      <div class="emergency-card-actions">
        <button class="btn-primary-dispatch">
           <i class="fas fa-bullhorn"></i>
            Deploy Responder Routes
        </button>
      </div>
    `;

    const primaryResponders = document.getElementById("primaryResponders");

    primaryResponders.innerHTML = "";

    mapMemory.responderMarkers.forEach(marker => {
      map.removeLayer(marker);
    });

    mapMemory.responderMarkers.length = 0;

    responders.forEach(responder => {

      const responderMarker = L.marker([
        responder.latitude,
        responder.longitude
      ], {
        icon: getResponderMarkerIcon(responder.type)
      }).addTo(map);

      mapMemory.responderMarkers.push(responderMarker);

      let responderClass = "";
      let responderIcon = "";

      if(responder.type === "hospital") {
        responderClass = "medical-dept";
        responderIcon = "fa-hospital-user";
      } else if(responder.type === "fire") {
        responderClass = "fire-dept";
        responderIcon = "fa-fire-extinguisher";
      } else if(responder.type === "police") {
        responderClass = "police-dept";
        responderIcon = "fa-shield-halved";
      }

      primaryResponders.innerHTML += `
        <div class="responder-item ${responderClass}">
          <div class="responder-icon">
            <i class="fas ${responderIcon}"></i>
          </div>

          <div class="responder-info">
            <h4>${responder.responder_name}</h4>

            <p>
              <i class="fas fa-map-marker-alt"></i>
              ${responder.responder_address}
            </p>
          </div>

          <div class="responder-distance">
            <span class="dist-value">0.00</span>
            <span class="dist-unit">km</span>
          </div>
        </div>
      `;
    });

   });
  });
}