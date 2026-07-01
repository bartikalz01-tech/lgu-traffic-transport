import { renderActiveEmergency } from "./active/render_active_emergency.js";
import { renderPendingEmergency } from "./pending/render_pending_emergency.js";
import { mapMemory } from "./emergency_memory.js";


function clearPendingMap(map) {
  mapMemory.responderMarkers.forEach(marker => {
    map.removeLayer(marker);
  });

  mapMemory.responderMarkers.length = 0;

  mapMemory.emergencyMarkers.forEach(marker => {
    map.removeLayer(marker);
  });

  mapMemory.emergencyMarkers.length = 0;
}

document.addEventListener("DOMContentLoaded", async () => {
  const emergencyMap = L.map("emergency-map").setView([14.6414, 120.9909], 20);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(emergencyMap);

  const aiRoutesContainer = document.querySelector(".js-ai-routes-container");

  renderPendingEmergency(aiRoutesContainer, emergencyMap);

  document.getElementById("pendingEmergencies").addEventListener("click", () => {

    clearPendingMap(emergencyMap);

    renderPendingEmergency(aiRoutesContainer, emergencyMap);
  });

  document.getElementById("activeEmergencies").addEventListener("click", () => {

    clearPendingMap(emergencyMap);

    renderActiveEmergency(aiRoutesContainer, emergencyMap)
  });
  
});