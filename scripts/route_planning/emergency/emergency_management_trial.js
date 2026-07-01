import { renderActiveEmergency } from "./active/render_active_emergency.js";
import { renderPendingEmergency } from "./pending/render_pending_emergency.js";


document.addEventListener("DOMContentLoaded", async () => {
  const emergencyMap = L.map("emergency-map").setView([14.6414, 120.9909], 20);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(emergencyMap);

  const aiRoutesContainer = document.querySelector(".js-ai-routes-container");

  renderPendingEmergency(aiRoutesContainer, emergencyMap);

  document.getElementById("pendingEmergencies").addEventListener("click", () => {
    renderPendingEmergency(aiRoutesContainer, emergencyMap);
  });

  document.getElementById("activeEmergencies").addEventListener("click", () => {
    renderActiveEmergency(aiRoutesContainer, emergencyMap)
  });
  
});