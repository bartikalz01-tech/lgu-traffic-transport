import { getAssignedRoutes } from "../../../data/fetch_emergencies.js";
import { renderAssignedResponders } from "./render_assigned_responders.js";

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
    `;

    const currentResponders =
      document.getElementById("currentResponders");

    const assignedRoutes = await getAssignedRoutes();

    const responders = assignedRoutes.filter(route =>
      route.emergency_id == emergency.emergency_id
    );

    renderAssignedResponders(responders, currentResponders);

  });

}