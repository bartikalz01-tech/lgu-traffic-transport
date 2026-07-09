import { getEmergencyCounts } from "../../data/fetch_emergencies.js";

export async function renderEmergencyCounts() {
  const counts = await getEmergencyCounts();

  document.getElementById("totalPendingEmergencies").textContent = counts.pending;
  const pendingBadge = document.getElementById("pendingBadge");

  if(counts.pending > 0) {
    pendingBadge.classList.add("show");
  } else {
    pendingBadge.classList.remove("show");
  }


  document.getElementById("totalActiveEmergencies").textContent = counts.assigned;
}

/*export async function refreshPendingEmergencies(map) {
  await renderEmergencyCounts();
  await refreshEmergencyMarkers(map);
}

export function startEmergencyCountPolling(map) {
  renderEmergencyCounts();
  return setInterval(() => {
    refreshPendingEmergencies(map)
  }, 2500);
}*/