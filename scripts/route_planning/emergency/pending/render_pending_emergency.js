/*import { insertEmergencyRoutes, getPendingEmergenciesLocation, getRespondersByType, getEmergencyRoute } from "../../../data/fetch_emergencies.js";
import { mapMemory } from "../emergency_memory.js";
import { attachEmergencyClick } from "./pending_emergency_marker_click.js";
import { getEmergencyMarker, getResponderMarkerIcon } from "../../../utils/emergencyUtils.js";
import { renderEmergencyCounts } from "../emergency_counts.js";*/

import { getPendingEmergenciesLocation } from "../../../data/fetch_emergencies.js";
import { mapMemory } from "../emergency_memory.js";
import { attachEmergencyClick } from "./pending_emergency_marker_click.js";
import { getEmergencyMarker } from "../../../utils/emergencyUtils.js";

export async function renderPendingEmergency(container, map) {

  container.innerHTML = `
    <div class="ai-header">
      <h3><i class="fas fa-satellite-dish"></i> Emergency Responders</h3>
    </div>

    <div class="responder-list" id="responderList"></div>
  `;

  const responderList = document.getElementById("responderList");

  const emergencies = await getPendingEmergenciesLocation();

  if(emergencies.length === 0) {
    responderList.innerHTML = `
      <div class="responder-placeholder">
        <i class="fas fa-circle-check"></i>
        <h3>No Pending Emergencies</h3>
        <p>There are currently no emergency incidents requiring dispatch.</p>
      </div>
    `;

    mapMemory.responderMarkers.forEach(marker => {
      map.removeLayer(marker);
    });

    mapMemory.responderMarkers.length = 0;

    mapMemory.emergencyMarkers.forEach(marker => {
      map.removeLayer(marker);
    });

    mapMemory.emergencyMarkers.length = 0;

    return;
  }

  responderList.innerHTML = `
    <div class="responder-placeholder">
      <i class="fas fa-location-crosshairs"></i>
      <h3>Select an Emergency</h3>
      <p>Click an emergency marker on the map to view the nearset available responders</p>
    </div>
  `;

  mapMemory.emergencyMarkers.forEach(marker => {
    map.removeLayer(marker);
  });

  mapMemory.emergencyMarkers.length = 0;

  // This will reveal the emergencies location on the map with the specific type.
  emergencies.forEach(emergency => {
    const emergencyMarker = L.marker([
      emergency.latitude,
      emergency.longitude
    ], {
      icon: getEmergencyMarker(emergency.type, emergency.status)
    }).addTo(map);

    emergencyMarker.bindPopup(`
      <strong>Emergency</strong><br>
      Type: ${emergency.type}<br>
      Status: ${emergency.status}
    `);

    mapMemory.emergencyMarkers.push(emergencyMarker);

    attachEmergencyClick(emergencyMarker, emergency, responderList, container, map);

  });
}