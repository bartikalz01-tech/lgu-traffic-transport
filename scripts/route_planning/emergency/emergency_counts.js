import { getEmergencyCounts } from "../../data/fetch_emergencies.js";

export async function renderEmergencyCounts() {
  const counts = await getEmergencyCounts();

  document.getElementById("totalPendingEmergencies").textContent = counts.pending;

  document.getElementById("totalActiveEmergencies").textContent = counts.assigned;
}

export function startEmergencyCountPolling() {
  renderEmergencyCounts();
  return setInterval(renderEmergencyCounts, 2500);
}