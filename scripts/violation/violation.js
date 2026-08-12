import { getViolationDetails } from "../data/violation_report/fetch_violations.js";
import { renderViolationReportsPanel } from "./violation_reports_panel.js";
import { renderViolationSummaryReports } from "./violation_summary.js";

document.addEventListener("DOMContentLoaded", async () => {
  const violationDetails = await getViolationDetails();

  const violationSummaryPanel = document.getElementById("violationSummaryPanel")
  const violationReportsPanel = document.getElementById("violationReportsPanel");

  renderViolationReportsPanel(violationReportsPanel, violationDetails);

  renderViolationSummaryReports(violationSummaryPanel);
});