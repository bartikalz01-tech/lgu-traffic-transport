import { roadOverlay } from './road_variables.js';

export function openRoadCondition(roadName) {
  roadOverlay.innerHTML = `
    <div class="road-condition-content">
      <div class="cctv-options-container">
        <div class="road-title-menu">
          <button class="close-btn">
            <img class="left-arrow-logo" src="images/arrow_to_left_fill.svg">
          </button>
          <h2 class="road-name">${roadName}t</h2>
        </div>

        <div class="cctv-controls">
          <span class="status-live">LIVE</span>
          <button class="btn record-btn">Save Record Footage</button>
        </div>

        <div class="right-side">
          <h2>Predictive AI</h2>
        </div>
      </div>

      <div class="full-cctv-video">
        <i class="fas fa-video"></i>
      </div>
    </div>
  `;

  roadOverlay.classList.remove('hidden');
}