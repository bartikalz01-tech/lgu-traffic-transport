import { renderActiveEmergency } from "./active/render_active_emergency.js";
import { renderPendingEmergency } from "./pending/render_pending_emergency.js";
import { renderEmergencyCounts } from "./emergency_counts.js";
import { mapMemory } from "./emergency_memory.js";

function setActiveCard(cardId) {
  document.querySelectorAll(".overview-card").forEach(card => {
    card.classList.remove("active");
  });

  document.getElementById(cardId).classList.add("active");
}

function clearMap(map) {
  mapMemory.responderMarkers.forEach(marker => {
    map.removeLayer(marker);
  });

  mapMemory.responderMarkers.length = 0;

  mapMemory.emergencyMarkers.forEach(marker => {
    map.removeLayer(marker);
  });

  mapMemory.emergencyMarkers.length = 0;

  mapMemory.activeRoutes.forEach(route => {
    map.removeLayer(route.polyline);
  });

  mapMemory.activeRoutes.clear();

  mapMemory.displayedAssignedPolylines.forEach(polyline => {
    map.removeLayer(polyline);
  });

  mapMemory.displayedAssignedPolylines.length = 0;
}

document.addEventListener("DOMContentLoaded", async () => {

  await renderEmergencyCounts();

  const emergencyMap = L.map("emergency-map").setView([14.6414, 120.9909], 20);

  //const emergencyMap = L.map("emergency-map").setView([14.72942, 121.03694], 20);

  //const emergencyMap = L.map("emergency-map").setView([14.72959, 121.03867], 20);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(emergencyMap);

  const aiRoutesContainer = document.querySelector(".js-ai-routes-container");

  renderPendingEmergency(aiRoutesContainer, emergencyMap);

  document.getElementById("pendingEmergencies").addEventListener("click", () => {

    setActiveCard("pendingEmergencies");

    clearMap(emergencyMap);

    renderPendingEmergency(aiRoutesContainer, emergencyMap);
  });

  document.getElementById("activeEmergencies").addEventListener("click", () => {

    setActiveCard("activeEmergencies");

    clearMap(emergencyMap);

    renderActiveEmergency(aiRoutesContainer, emergencyMap)
  });
  
});