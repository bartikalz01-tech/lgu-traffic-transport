import { getAssignedRoutes } from "../../../data/fetch_emergencies.js";
import { renderAssignedResponders } from "./render_assigned_responders.js";
import { renderBackupResponders } from "./render_backup_responders.js";

export function attachActiveEmergencyClick(emergencyMarker, emergency, responderList, map) {

  emergencyMarker.on("click", async () => {

    emergencyMarker.openPopup();

    responderList.innerHTML = `
      <div class="responder-group-section">
        <div class="group-label">
          <i class="fas fa-star"></i>
          Active Emergency Responders
        </div>

        <div id="currentResponders"></div>
      </div>

      <div class="responder-group-section">
        <div class="group-label">
          <i class="fas fa-handshake"></i>
          Backup Responders
        </div>

        <div id="backupResponders"></div>
      </div>

      <div class="emergency-card-actions">
        <button class="btn-primary-dispatch" id="deployBackupBtn">
          <i class="fas fa-bullhorn"></i>
          Deploy Backup Responders
        </button>
      </div>
    `;

    const currentResponders = document.getElementById("currentResponders");
    const backupResponders = document.getElementById("backupResponders");

    const assignedRoutes = await getAssignedRoutes();

    const responders = assignedRoutes.filter(route =>
      route.emergency_id == emergency.emergency_id
    );

    renderAssignedResponders(responders, currentResponders);

    await renderBackupResponders(emergency, backupResponders, map);

  });

}