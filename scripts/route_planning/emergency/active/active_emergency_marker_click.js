import { getAssignedRoutes } from "../../../data/fetch_emergencies.js";
import { mapMemory } from "../emergency_memory.js";
import { renderAssignedResponders } from "./render_assigned_responders.js";
import { renderBackupResponders } from "./render_backup_responders.js";
import { renderResponderMarkers } from "../../../utils/emergencyUtils.js";

export function attachActiveEmergencyClick(emergencyMarker, emergency, responderList, map) {

  emergencyMarker.on("click", async () => {

    mapMemory.responderMarkers.forEach(marker => {
      map.removeLayer(marker);
    });

    mapMemory.responderMarkers.length = 0;

    mapMemory.displayedAssignedPolylines.forEach(polyline => {
      map.removeLayer(polyline);
    });

    mapMemory.displayedAssignedPolylines.length = 0;

    mapMemory.selectedBackupRoutes.forEach(route => {
      map.removeLayer(route.polyline);
    });

    mapMemory.selectedBackupRoutes.clear();

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

    /*const assignedRoutes = await getAssignedRoutes();

    const responders = assignedRoutes.filter(route =>
      route.emergency_id == emergency.emergency_id
    );*/
    const responders = mapMemory.assignedRouteMemory[emergency.emergency_id ] || [];

    renderAssignedResponders(responders, currentResponders);

    renderResponderMarkers(
      responders,
      map,
      mapMemory.responderMarkers
    );

    //const assigned = mapMemory.assignedRouteMemory[emergency.emergency_id] || [];

    responders.forEach(route => {
      route.polyline.addTo(map);

      mapMemory.displayedAssignedPolylines.push(route.polyline);
    });

    const backup = await renderBackupResponders(emergency, backupResponders, map);

    renderResponderMarkers(
      backup,
      map,
      mapMemory.responderMarkers,
      false
    );

    const deployBtn = document.getElementById("deployBackupBtn");

    deployBtn.addEventListener("click", async () => {
      await deployBackupResponders() // Help me finish this.
    });

  });

}