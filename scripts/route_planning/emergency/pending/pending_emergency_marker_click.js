import { getRespondersByType } from "../../../data/fetch_emergencies.js";
import { mapMemory } from "../emergency_memory.js";
import { getResponderMarkerIcon } from "../../../utils/emergencyUtils.js";
//import { renderEmergencyCounts } from "../emergency_counts.js";
import { deployEmergencyRoutes } from "./deploy_emergency_routes.js";
import { renderResponderList } from "./render_responder_list.js";


export function attachEmergencyClick(emergencyMarker, emergency, responderList, container, map) {

  emergencyMarker.on("click", async () => {
  
    emergencyMarker.openPopup();

    let responderType = emergency.type;

    if(emergency.type === "accident") {
      responderType = "hospital";
    }

    const allowMultipleResponders = emergency.type === "fire";

    const responders = await getRespondersByType(responderType);

    responderList.innerHTML = `
      <div class="responder-group-section">
        <div class="group-label">
          <i class="fas fa-star"></i>
          Primary Emergency Responders
        </div>

        <div id="primaryResponders"></div>
      </div>

      <div class="emergency-card-actions">
        <button class="btn-primary-dispatch" id="deployEmergencyRoutesBtn">
          <i class="fas fa-bullhorn"></i>
            Deploy Responder Routes
        </button>
      </div>
    `;

    const primaryResponders = document.getElementById("primaryResponders");

    let skeletonRemoved = false;

    primaryResponders.innerHTML = `
      <div class="responder-skeleton-item">
        <div class="skeleton-icon"></div>
        <div class="skeleton-info">
          <div class="skeleton-line title"></div>
          <div class="skeleton-line subtitle"></div>
        </div>
        <div class="skeleton-distance"></div>
      </div>
      <div class="responder-skeleton-item">
        <div class="skeleton-icon"></div>
        <div class="skeleton-info">
          <div class="skeleton-line title"></div>
          <div class="skeleton-line subtitle"></div>
        </div>
        <div class="skeleton-distance"></div>
      </div>
    `;

    await renderResponderList(responders, emergency, primaryResponders, map, allowMultipleResponders)

    const deployBtn = document.getElementById("deployEmergencyRoutesBtn");

    deployBtn.addEventListener("click", async () => {
      await deployEmergencyRoutes(emergency, container, map);
    });

  });

}