import { insertBackupResponders } from "../../../data/fetch_emergencies.js";
import { mapMemory } from "../emergency_memory.js";
import { renderAssignedResponders } from "./render_assigned_responders.js";
import { renderBackupResponders } from "./render_backup_responders.js";
import { renderResponderMarkers } from "../../../utils/emergencyUtils.js";

export async function deployBackupResponders(emergency, currentResponders, backupResponders, map) {
  console.log("deployBackupResponders called");

  const responders = [...mapMemory.selectedBackupRoutes.values()].map(route => ({
    responder_id: route.responder_id,
    distance: route.distance,
    eta: route.eta,
    route: route.route
  }));

  if(responders.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "No Backup Selected",
      text: "Please Select atleast one backup responder"
    });

    return;
  }

  const result = await insertBackupResponders(emergency.emergency_id, responders);

  if(result.status !== "success") {
    Swal.fire({
      icon: "error",
      title: "Deployment Failed",
      text: result.message
    });

    return;
  }

  if(!mapMemory.assignedRouteMemory[emergency.emergency_id]) {
    mapMemory.assignedRouteMemory[emergency.emergency_id] = [];
  }

  mapMemory.selectedBackupRoutes.forEach(route => {
    const alreadyAssigned = mapMemory.assignedRouteMemory[emergency.emergency_id]
      .some(r => r.responder_id === route.responder_id);

    if(alreadyAssigned) return;

    map.removeLayer(route.polyline);

    let routeColor = "#5fc8eb";

    if(route.responder_type === "fire"){
      routeColor = "#ef4444";
    } else if(route.responder_type === "hospital"){
      routeColor = "#22c55e";
    } else if(route.responder_type === "police"){
      routeColor = "#3b82f6";
    }

    const latlngs = route.route.map(p => [p.lat, p.lng]);

    const officialPolyline = L.polyline(latlngs, {
      color: routeColor,
      weight: 5,
      opacity: 0.8
    });

    mapMemory.assignedRouteMemory[emergency.emergency_id].push({
      ...route,
      polyline: officialPolyline
    });
  });

  const deployedRoutes = [... mapMemory.selectedBackupRoutes.values()];

  renderAssignedResponders(mapMemory.assignedRouteMemory[emergency.emergency_id], currentResponders);

  await renderBackupResponders(emergency, backupResponders, map);

  renderResponderMarkers(deployedRoutes, map, mapMemory.responderMarkers, false);

  mapMemory.assignedRouteMemory[emergency.emergency_id].forEach(route => {
    if(!map.hasLayer(route.polyline)) {
      route.polyline.addTo(map);
    }

    if(!mapMemory.displayedAssignedPolylines.includes(route.polyline)) {
      mapMemory.displayedAssignedPolylines.push(route.polyline);
    }
  });

  mapMemory.selectedBackupRoutes.clear();

  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: "Backup Responders Deployed",
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true
  });

}