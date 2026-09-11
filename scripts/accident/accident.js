import { startAccidentStore, subscribeAccidents } from "../data/accident_report/accidentStore.js";
import { renderAccidentReportsPanel } from "./accident_reports_panel.js";
import { renderAccidentSummary } from "./accident_summary.js";

document.addEventListener("DOMContentLoaded", async () => {
	
	const summaryContainer = document.getElementById("accidentSummary");
	const reportsContainer = document.getElementById("accidentReportsPanel");

	startAccidentStore();

	const publicAccidentId = sessionStorage.getItem("openAccidentReportId");

	if (publicAccidentId) {

    sessionStorage.removeItem(
      "openAccidentReportId"
    );

  }

	await renderAccidentReportsPanel(reportsContainer, publicAccidentId);

	subscribeAccidents(accidents => {
		renderAccidentSummary(summaryContainer, accidents);
	});
});