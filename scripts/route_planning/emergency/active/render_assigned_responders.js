export function renderAssignedResponders(
  responders,
  container
) {

  container.innerHTML = "";

  responders.forEach(responder => {

    let responderClass = "";
    let responderIcon = "";

    if (responder.responder_type === "hospital") {
      responderClass = "medical-dept";
      responderIcon = "fa-hospital-user";
    } else if (responder.responder_type === "fire") {
      responderClass = "fire-dept";
      responderIcon = "fa-fire-extinguisher";
    } else if (responder.responder_type === "police") {
      responderClass = "police-dept";
      responderIcon = "fa-shield-halved";
    }

    const responderItem = document.createElement("div");

    responderItem.className = `responder-item ${responderClass}`;

    responderItem.innerHTML = `
      <div class="responder-icon">
        <i class="fas ${responderIcon}"></i>
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
          ${(responder.distance / 1000).toFixed(3)}
        </span>

        <span class="dist-unit">
          km
        </span>
      </div>
    `;

    container.appendChild(responderItem);

  });

}