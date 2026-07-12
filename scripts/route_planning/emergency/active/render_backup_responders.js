import { getBackupResponders, getEmergencyRoute } from "../../../data/fetch_emergencies.js";

export async function renderBackupResponders(emergency, responderList, map) {

  const responders = await getBackupResponders(emergency.emergency_id);

  let skeletonRemoved = false;

  responderList.innerHTML = `
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

  for(const responder of responders) {
    const routeData = await getEmergencyRoute(emergency.emergency_id, responder.responder_id);

    let backupResponderClass = "";
    let backupResponderIcon = "";

    if(responder.responder_type === "hospital") {
      backupResponderClass = "medical-dept";
      backupResponderIcon = "fa-hospital-user";
    } else if(responder.responder_type === "fire") {
      backupResponderClass = "fire-dept";
      backupResponderIcon = "fa-fire-extinguisher";
    } else if(responder.responder_type === "police") {
      backupResponderClass = "police-dept";
      backupResponderIcon = "fa-shield-halved";
    }

    const backupResponderItem = document.createElement("div");

    backupResponderItem.className = `responder-item ${backupResponderClass}`;

    backupResponderItem.innerHTML = `
      <div class="responder-icon">
        <i class="fas ${backupResponderIcon}"></i>
      </div>

      <div class="responder-info">
        <h4>${responder.responder_name}</h4>

        <p>
          <i class="fas fa-map-marker-alt"></i>
          ${responder.responder_address}
        </p>
      </div>

      <div class="responder-distance">
        <span class="dist-value">
          ${(routeData.distance / 1000).toFixed(2)}
        </span>

        <span class="dist-unit">
          km
        </span>
      </div>
    `;

    if(!skeletonRemoved) {
      responderList.innerHTML = "";
      skeletonRemoved = true; 
    }

    responderList.appendChild(backupResponderItem);

    backupResponderItem.addEventListener("click", async () => {

    });


  }

  return responders;
}