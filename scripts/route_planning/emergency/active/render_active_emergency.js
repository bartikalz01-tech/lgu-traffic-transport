import { getAssignedEmergenciesLocation, getAssignedRoutes } from "../../../data/fetch_emergencies.js";
import { attachActiveEmergencyClick } from "./active_emergency_marker_click.js";
import { formatEmergencyDate, getEmergencyMarker, loadAssignedRoutes } from "../../../utils/emergencyUtils.js";
import { mapMemory } from "../emergency_memory.js";

export async function renderActiveEmergency(container, map) {

  container.innerHTML = `
    <div class="ai-header">
      <h3><i class="fas fa-satellite-dish"></i> Emergency Responder Status</h3>
    </div>

    <div class="responder-list" id="responderList"></div>
  `

  const responderList = document.getElementById("responderList");

  await loadAssignedRoutes(map, mapMemory.assignedRouteMemory);

  const assignedEmergencies = await getAssignedEmergenciesLocation();

  if(assignedEmergencies.length === 0) {
    responderList.innerHTML = `
      <div class="responder-placeholder">
        <i class="fas fa-circle-check"></i>
        <h3>No Pending Emergencies</h3>
        <p>There are currently no emergency incidents requiring backup responders.</p>
      </div>
    `;

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
      <p>Click an emergency marker on the map to view the available backup responders</p>
    </div>
  `;

  mapMemory.emergencyMarkers.forEach(marker => {
    map.removeLayer(marker);
  });

  mapMemory.emergencyMarkers.length = 0;

  assignedEmergencies.forEach(emergency => {
    const emergencyMarker = L.marker([
      emergency.latitude,
      emergency.longitude
    ], {
      icon: getEmergencyMarker(emergency.type, emergency.status)
    }).addTo(map);

    emergencyMarker.bindPopup(`
      <strong>Emergency</strong><br>
      Type: ${emergency.type}<br>
      Status: ${emergency.status}<br>
      Reported Date: ${formatEmergencyDate(emergency.reported_date)}  
    `);

    mapMemory.emergencyMarkers.push(emergencyMarker);

    attachActiveEmergencyClick(emergencyMarker, emergency, responderList, map);
  });
}