import { getAssignedEmergenciesLocation, getAssignedRoutes } from "../../../data/fetch_emergencies.js";
import { formatEmergencyDate, getEmergencyMarker } from "../../../utils/emergencyUtils.js";
import { mapMemory } from "../emergency_memory.js";

export async function renderActiveEmergency(container, map) {
  /*container.innerHTML = `
    <div class="ai-header">
      <h3><i class="fas fa-satellite-dish"></i> Emergency Responder Status</h3>
    </div>

    <div class="responder-list">
      <div class="responder-group-section" id="activeEmergencyResponders">
        <div class="group-label">
          <i class="fas fa-star"></i>
          Active Emergency Responders
        </div>

        <div id="currentResponders">
          
        </div>
      </div>

      <div class="responder-group-section" id="backupResponders">'
        <div class="group-label">
          <i class="fas fa-handshake"></i>
          Optional Support Units
        </div>

        <div id="supportiveResponderContainer">

          <div class="responder-item medical-dept">

            <div class="responder-icon">
              <i class="fas fa-hospital-user"></i>
            </div>

            <div class="responder-info">
              <h4>City Medical Center</h4>
              <p>
                <i class="fas fa-map-marker-alt"></i>
                Medical Drive
              </p>
            </div>

            <div class="responder-distance">
              <span class="dist-value">2.40</span>
              <span class="dist-unit">km</span>
            </div>

          </div>

          <div class="responder-item police-dept">

            <div class="responder-icon">
              <i class="fas fa-shield-halved"></i>
            </div>

            <div class="responder-info">
              <h4>Police Precinct 3</h4>
              <p>
                <i class="fas fa-map-marker-alt"></i>
                Justice Avenue
              </p>
            </div>

            <div class="responder-distance">
              <span class="dist-value">3.15</span>
              <span class="dist-unit">km</span>
            </div>

          </div>

          <div class="responder-item fire-dept">
            <div class="responder-icon">
              <i class="fas fa-fire-extinguisher"></i>
            </div>

            <div class="responder-info">
              <h4>North Fire Station</h4>
              <p>
                <i class="fas fa-map-marker-alt"></i>
                North Boulevard
              </p>
            </div>

            <div class="responder-distance">
              <span class="dist-value">4.06</span>
              <span class="dist-unit">km</span>
            </div>
          </div>

        </div>
      </div>
    </div>

    <div class="emergency-card-actions" id="activeBtnContainer">
      <button class="btn-primary-dispatch" id="activeBtn">
        <i class="fas fa-bullhorn"></i>
        Deploy Backup Units
      </button>
    </div>
  `;*/
  container.innerHTML = `
    <div class="ai-header">
      <h3><i class="fas fa-satellite-dish"></i> Emergency Responder Status</h3>
    </div>

    <div class="responder-list" id="responderList"></div>
  `

  const responderList = document.getElementById("responderList");

  const assignedEmergencies = await getAssignedEmergenciesLocation();

  if(assignedEmergencies.length === 0) {
    responderList.innerHTML = `
      <div class="responder-placeholder">
        <i class="fas fa-circle-check"></i>
        <h3>No Pending Emergencies</h3>
        <p>There are currently no emergency incidents requiring backup responders.</p>
      </div>
    `;

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
      <p>Click an emergency marker on the map to view the available backup responders</p>
    </div>
  `;

  mapMemory.emergencyMarkers.forEach(marker => {
    map.removeLayer(marker);
  });

  mapMemory.emergencyMarkers.length = 0;

  assignedEmergencies.forEach(emergency => {
    const emergencyMarker = L.marker([
      emergency.latitude,
      emergency.longitude
    ], {
      icon: getEmergencyMarker(emergency.type, emergency.status)
    }).addTo(map);

    emergencyMarker.bindPopup(`
      <strong>Emergency</strong><br>
      Type: ${emergency.type}<br>
      Status: ${emergency.status}<br>
      Reported Date: ${formatEmergencyDate(emergency.reported_date)}  
    `);

    mapMemory.emergencyMarkers.push(emergencyMarker);

    emergencyMarker.on("click", async () => {

      responderList.innerHTML = `
        <div class="responder-group-section">
          <div class="group-label">
            <i class="fas fa-star"></i>
            Active Emergency Responders
          </div>

          <div id="currentResponders">
            <div class="responder-item medical-dept">
              <div class="responder-icon">
                <i class="fas fa-hospital-user"></i>
              </div>

              <div class="responder-info">
                <h4>City Medical Center</h4>
                <p>
                  <i class="fas fa-map-marker-alt"></i>
                  Medical Drive
                </p>
              </div>

              <div class="responder-distance">
                <span class="dist-value">2.40</span>
                <span class="dist-unit">km</span>
              </div>
            </div>

            <div class="responder-item police-dept">
              <div class="responder-icon">
                <i class="fas fa-shield-halved"></i>
              </div>

              <div class="responder-info">
                <h4>Police Precinct 3</h4>
                <p>
                  <i class="fas fa-map-marker-alt"></i>
                  Justice Avenue
                </p>
              </div>

              <div class="responder-distance">
                <span class="dist-value">3.15</span>
                <span class="dist-unit">km</span>
              </div>
            </div>

            <div class="responder-item fire-dept">
              <div class="responder-icon">
                <i class="fas fa-fire-extinguisher"></i>
              </div>

              <div class="responder-info">
                <h4>North Fire Station</h4>
                <p>
                  <i class="fas fa-map-marker-alt"></i>
                  North Boulevard
                </p>
              </div>

              <div class="responder-distance">
                <span class="dist-value">4.06</span>
                <span class="dist-unit">km</span>
              </div>
            </div>
          </div>
        </div>
      `;

      const currentResponders = document.getElementById("currentResponders");

      currentResponders.innerHTML = "";

      const assignedRoutes = await getAssignedRoutes();

      const responders = assignedRoutes.filter(route => 
        route.emergency_id == emergency.emergency_id
      );
      
      responders.forEach(responder => {
        let responderClass = "";
        let responderIcon = "";

        if(responder.responder_type === "hospital") {
          responderClass = "medical-dept";
          responderIcon = "fa-hospital-user";
        } else if(responder.responder_type === "fire") {
          responderClass = "fire-dept";
          responderIcon = "fa-fire-extinguisher";
        } else if(responder.responder_type === "police") {
          responderClass = "police-dept";
          responderIcon = "fa-shield-halved";
        }

        const currentResponderItem = document.createElement("div");

        currentResponderItem.className = `responder-item ${responderClass}`;

        currentResponderItem.innerHTML += `
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
            <span class="dist-value">${(responder.distance / 1000).toFixed(3)}</span>
            <span class="dist-unit">km</span>
          </div>
        `;

        currentResponders.appendChild(currentResponderItem);
      });

    });
  });
}