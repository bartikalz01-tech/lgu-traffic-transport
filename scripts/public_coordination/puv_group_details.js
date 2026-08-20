import { renderActiveGroupDetails } from "./group_details/active_group_details.js";
import { renderPendingGroupDetails } from "./group_details/pending_group_details.js";

export function puvGroupDetails(container, group) {

  if (!group) {
    console.error("No PUV group supplied.");
    return;
  }

  container.innerHTML = `
    <div class="puv-group-details-container"></div>
  `;

  const detailsContainer = container.querySelector(".puv-group-details-container");

  const status = String(group.status || "Pending").trim().toLowerCase();

  if(status === "active") {
    renderActiveGroupDetails(detailsContainer, group);
  } else {
    renderPendingGroupDetails(detailsContainer, group);
  }

  // =========================================
  // CLOSE MODAL
  // =========================================

  const closeButton =
    container.querySelector("#closePuvGroupDetails");

  const closeFooterButton =
    container.querySelector("#closePuvGroupDetailsFooter");


  const closeModal = () => {
    container.classList.add("detail-hidden");
  };


  closeButton.addEventListener(
    "click",
    closeModal
  );


  closeFooterButton.addEventListener(
    "click",
    closeModal
  );

}