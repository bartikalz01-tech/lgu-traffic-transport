import { getEmergencyPlan } from "../../global_variables.js";

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
            <div class="responder-item fire-dept">
              <div class="responder-icon">
                <i class="fas fa-fire-extinguisher"></i>
              </div>
              <div class="responder-info">
                <h4>Station 7 - Central Fire</h4>
                <p><i class="fas fa-map-marker-alt"></i> Rizal Avenue North</p>
              </div>
              <div class="responder-distance">
                <span class="dist-value">1.2</span>
                <span class="dist-unit">km</span>
              </div>
            </div>

            <div class="responder-item medical-dept">
              <div class="responder-icon">
                <i class="fas fa-hospital-user"></i>
              </div>
              <div class="responder-info">
                <h4>General Hospital</h4>
                <p><i class="fas fa-map-marker-alt"></i> Medical Heights Drive</p>
              </div>
              <div class="responder-distance">
                <span class="dist-value">3.5</span>
                <span class="dist-unit">km</span>
              </div>
            </div>

            <div class="responder-item police-dept">
              <div class="responder-icon">
                <i class="fas fa-shield-halved"></i>
              </div>
              <div class="responder-info">
                <h4>Precint 4 - Patrol Unit</h4>
                <p><i class="fas fa-map-marker-alt"></i> Commercial District</p>
              </div>
              <div class="responder-distance">
                <span class="dist-value">0.8</span>
                <span class="dist-unit">km</span>
              </div>
            </div>

            <div class="emergency-card-actions">
              <button class="btn btn-info">Activate</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  setEmergencyPlan.classList.remove('emergency-hidden')
}