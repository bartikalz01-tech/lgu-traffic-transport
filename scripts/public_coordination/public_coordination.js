//import { openPublicTransportCoordination } from "./public_groups.js";
import { renderPuvReportPanel } from "./puv_report_panel.js";
import { renderPuvSummaryCards } from "./puv_summary.js";
import { renderSchedulePuvModal } from "./schedule_puv_modal.js";
import { getPuvGroup } from "../data/fetch_public_group_trans.js";
import { startGlobalNotifications } from "../navigavtion/global_notifications.js";

document.addEventListener("DOMContentLoaded", async () => {
  //openPublicTransportCoordination(document.getElementById("publicTransportCoordinationContainer"));

  startGlobalNotifications();

  const summaryContainer = document.getElementById("ptcSummaryContainer");
  const reportContainer = document.getElementById("ptcReportPanelContainer");
  const modalContainer = document.getElementById("ptcRegisterModalContainer");

  const puvGroups = await getPuvGroup();

  renderPuvSummaryCards(summaryContainer);
  renderPuvReportPanel(reportContainer, puvGroups);

  const registerModal = renderSchedulePuvModal(modalContainer);
  const registerBtn = document.getElementById("registerPuvGroupBtn");

  registerBtn.addEventListener("click", () => {
    registerModal.openModal();
  });
});