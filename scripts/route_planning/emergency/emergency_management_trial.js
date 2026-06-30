import { renderActiveEmergency } from "./active/render_active_emergency.js";
import { renderPendingEmergency } from "./pending/render_pending_emergency.js";

/*async function renderEmergencyManagement(container, map) {

  container.innerHTML = `
    <div class="emergency-map-container">
      <div id="emergency-map"></div>
    </div>

    <aside class="ai-routes-container js-ai-routes-container">
      <div class="ai-header">
        <h3>
          <i class="fas fa-satellite-dish"></i>
          Nearest Responders
        </h3>
      </div>

      <div class="responder-list">

        <div class="responder-placeholder" style="display:none;">
          <i class="fas fa-map-location-dot"></i>
          <p>Select an incident marker on the map to query closest emergency responders</p>
        </div>

        <div class="responder-group-section" id="primaryGroupSection">

          <div class="group-label">
            <i class="fas fa-star"></i>
            Primary Emergency Responders
          </div>

          <div id="primaryResponderContainer">

            <div class="responder-item fire-dept">

              <div class="responder-icon">
                <i class="fas fa-fire-extinguisher"></i>
              </div>

              <div class="responder-info">
                <h4>Central Fire Station</h4>
                <p>
                  <i class="fas fa-map-marker-alt"></i>
                  Rizal Avenue
                </p>
              </div>

              <div class="responder-distance">
                <span class="dist-value">1.32</span>
                <span class="dist-unit">km</span>
              </div>

            </div>

          </div>

        </div>

        <div class="responder-group-section" id="supportiveGroupSection">

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
          Deploy & Activate Route
        </button>
      </div>

    </aside>
  `;
}*/


document.addEventListener("DOMContentLoaded", async () => {
  const emergencyMap = L.map("emergency-map").setView([14.6414, 120.9909], 20);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(emergencyMap);

  const aiRoutesContainer = document.querySelector(".js-ai-routes-container");

  renderPendingEmergency(aiRoutesContainer, emergencyMap);

  document.getElementById("pendingEmergencies").addEventListener("click", () => {
    renderPendingEmergency(aiRoutesContainer, emergencyMap);
  });

  document.getElementById("activeEmergencies").addEventListener("click", () => {
    renderActiveEmergency(aiRoutesContainer, emergencyMap)
  });
  
});