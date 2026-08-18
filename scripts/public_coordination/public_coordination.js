//import { openPublicTransportCoordination } from "./public_groups.js";
import { renderPuvReportPanel } from "./puv_report_panel.js";
import { renderPuvSummaryCards } from "./puv_summary.js";
import { renderRegisterPuvModal } from "./register_puv_modal.js";

document.addEventListener("DOMContentLoaded", () => {
  //openPublicTransportCoordination(document.getElementById("publicTransportCoordinationContainer"));

  const summaryContainer = document.getElementById("ptcSummaryContainer");
  const reportContainer = document.getElementById("ptcReportPanelContainer");
  const modalContainer = document.getElementById("ptcRegisterModalContainer");

  renderPuvSummaryCards(summaryContainer);
  renderPuvReportPanel(reportContainer);

  const registerModal = renderRegisterPuvModal(modalContainer);
  const registerBtn = document.getElementById("registerPuvGroupBtn");

  registerBtn.addEventListener("click", () => {
    registerModal.openModal();
  });
});