import { renderAccidentReportsPanel } from "./accident_reports_panel.js";
import { renderAccidentSummary } from "./accident_summary.js";

document.addEventListener("DOMContentLoaded", () => {
	renderAccidentSummary(document.getElementById("accidentSummary"));

	renderAccidentReportsPanel(document.getElementById("accidentReportsPanel"));
});