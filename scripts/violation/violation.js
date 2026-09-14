import { startViolationStore, subscribeViolations } from "../data/violation_report/violationStore.js";
import { renderViolationReportsPanel } from "./violation_reports_panel.js";
import { renderViolationSummaryReports } from "./violation_summary.js";
import { startGlobalNotifications } from "../navigavtion/global_notifications.js";

document.addEventListener("DOMContentLoaded", async () => {

  const violationSummaryPanel = document.getElementById("violationSummaryPanel")
  const violationReportsPanel = document.getElementById("violationReportsPanel");

  startGlobalNotifications();
  startViolationStore();

  renderViolationReportsPanel(violationReportsPanel);

  subscribeViolations(
    violations => {
      renderViolationSummaryReports(violationSummaryPanel, violations);
    }
  );
  
});