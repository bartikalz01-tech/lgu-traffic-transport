import { insertEmergencyRoutes } from "../../../data/fetch_emergencies.js";
import { mapMemory } from "../emergency_memory.js";
import { renderEmergencyCounts } from "../emergency_counts.js";
import { renderPendingEmergency } from "./render_pending_emergency.js";

export async function deployEmergencyRoutes(emergency, container, map) {

  const responders = [...mapMemory.activeRoutes.values()].map(route => ({
    responder_id: route.responder_id,
    distance: route.distance,
    eta: route.eta,
    route: route.route
  }));

  const result = await insertEmergencyRoutes(
    emergency.emergency_id,
    responders
  );

  if (result.status === "success") {

    mapMemory.activeRoutes.forEach(route => {
      map.removeLayer(route.polyline);
    });

    mapMemory.activeRoutes.clear();

    mapMemory.responderMarkers.forEach(marker => {
      map.removeLayer(marker);
    });

    mapMemory.responderMarkers.length = 0;

    mapMemory.emergencyMarkers.forEach(marker => {
      map.removeLayer(marker);
    });

    mapMemory.emergencyMarkers.length = 0;

    await Swal.fire({
      icon: "success",
      title: "Emergency Assigned",
      text: "Emergency routes were deployed successfully.",
      confirmButtonColor: "#2563eb"
    });

    await renderEmergencyCounts();

    renderPendingEmergency(container, map);

  } else {

    Swal.fire({
      icon: "error",
      title: "Deployment Failed",
      text: result.message
    });

  }

}