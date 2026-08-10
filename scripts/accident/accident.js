import { startAccidentStore, subscribeAccidents } from "../data/accident_report/accidentStore.js";
import { renderAccidentReportsPanel } from "./accident_reports_panel.js";
import { renderAccidentSummary } from "./accident_summary.js";

document.addEventListener("DOMContentLoaded", async () => {
	
	const summaryContainer = document.getElementById("accidentSummary");
	const reportsContainer = document.getElementById("accidentReportsPanel");

	startAccidentStore();

	await renderAccidentReportsPanel(reportsContainer);

	subscribeAccidents(accidents => {
		renderAccidentSummary(summaryContainer, accidents);
	});
});