import { getAssignedEmergenciesLocation } from "../../../data/fetch_emergencies.js";
import { formatEmergencyDate, getEmergencyMarker } from "../../../utils/emergencyUtils.js";
import { mapMemory } from "../emergency_memory.js";

export async function renderActiveEmergency(container, map) {
  container.innerHTML = `
    <div class="ai-header">
      <h3><i class="fas fa-satellite-dish"></i> Emergency Responder Status</h3>
    </div>

    <div class="responder-list">
      <div class="responder-group-section" id="activeEmergencyResponders">
        <div class="group-label">
          <i class="fas fa-star"></i>
          Active Emergency Responders
        </div>

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
  `;

  const assignedEmergencies = await getAssignedEmergenciesLocation();

  assignedEmergencies.forEach(emergency => {
    const emergencyMarker = L.marker([
      emergency.latitude,
      emergency.longitude
    ], {
      icon: getEmergencyMarker(emergency.type, emergency.status)
    }).addTo(map);

    mapMemory.emergencyMarkers.push(emergencyMarker);

    emergencyMarker.bindPopup(`
      <strong>Emergency</strong><br>
      Type: ${emergency.type}<br>
      Status: ${emergency.status}<br>
      Reported Date: ${formatEmergencyDate(emergency.reported_date)}  
    `);
  });
}