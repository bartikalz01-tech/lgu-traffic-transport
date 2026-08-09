import { getAccidentDetails } from "../data/fetch_accidents.js";
import { renderAccidentReportsPanel } from "./accident_reports_panel.js";
import { renderAccidentSummary } from "./accident_summary.js";

document.addEventListener("DOMContentLoaded", async () => {
	
	const accidentDetails = await getAccidentDetails();

	renderAccidentSummary(document.getElementById("accidentSummary"));

	await renderAccidentReportsPanel(document.getElementById("accidentReportsPanel"), accidentDetails);
});