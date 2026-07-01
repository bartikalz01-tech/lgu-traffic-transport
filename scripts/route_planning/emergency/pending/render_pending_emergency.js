import { getPendingEmergenciesLocation } from "../../../data/fetch_emergencies.js";
import { getEmergencyMarker } from "../../../utils/emergencyUtils.js";

export async function renderPendingEmergency(container, map) {
  container.innerHTML = `
    <div class="ai-header">
      <h3><i class="fas fa-satellite-dish"></i> Emergency Responders</h3>
    </div>

    <div class="responder-list">
      <div class="responder-group-section" id="primaryResponders">
        <div class="group-label">
          <i class="fas fa-star"></i>
          Primary Emergency Responders
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

    </div>

    <div class="emergency-card-actions" id="activeBtnContainer">
      <button class="btn-primary-dispatch" id="activeBtn">
        <i class="fas fa-bullhorn"></i>
        Deploy Responders
      </button>
    </div>
  `;

  // This will reveal the emergencies location on the map with the specific type.
  const emergencies = await getPendingEmergenciesLocation();

  emergencies.forEach(emergency => {
   L.marker([
    emergency.latitude,
    emergency.longitude
   ], {
    icon: getEmergencyMarker(emergency.type, emergency.status)
   }).addTo(map);
  });
}