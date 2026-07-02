import { insertEmergencyRoutes, getPendingEmergenciesLocation, getRespondersByType, getEmergencyRoute } from "../../../data/fetch_emergencies.js";
import { mapMemory } from "../emergency_memory.js";
import { getEmergencyMarker, getResponderMarkerIcon } from "../../../utils/emergencyUtils.js";
import { renderEmergencyCounts } from "../emergency_counts.js";

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

    emergencyMarker.on("click", async () => {

      emergencyMarker.openPopup();

      let responderType = emergency.type;

      if(emergency.type === "accident") {
        responderType = "hospital";
      }

      const allowMultipleResponders = emergency.type === "fire";

      const responders = await getRespondersByType(responderType);

      responderList.innerHTML = `
        <div class="responder-group-section">
          <div class="group-label">
            <i class="fas fa-star"></i>
            Primary Emergency Responders
          </div>

          <div id="primaryResponders"></div>
        </div>

        <div class="emergency-card-actions">
          <button class="btn-primary-dispatch" id="deployEmergencyRoutesBtn">
            <i class="fas fa-bullhorn"></i>
              Deploy Responder Routes
          </button>
        </div>
      `;

      const primaryResponders = document.getElementById("primaryResponders");

      primaryResponders.innerHTML = "";

      mapMemory.responderMarkers.forEach(marker => {
        map.removeLayer(marker);
      });

      mapMemory.responderMarkers.length = 0;

      responders.forEach(responder => {

        const responderMarker = L.marker([
          responder.latitude,
          responder.longitude
        ], {
          icon: getResponderMarkerIcon(responder.type)
        }).addTo(map);

        responderMarker.bindPopup(`
          <strong>${responder.responder_name}</strong><br>
          Type: ${responder.type}<br>
          Address: ${responder.responder_address}
        `)

        mapMemory.responderMarkers.push(responderMarker);

        let responderClass = "";
        let responderIcon = "";

        if(responder.type === "hospital") {
          responderClass = "medical-dept";
          responderIcon = "fa-hospital-user";
        } else if(responder.type === "fire") {
          responderClass = "fire-dept";
          responderIcon = "fa-fire-extinguisher";
        } else if(responder.type === "police") {
          responderClass = "police-dept";
          responderIcon = "fa-shield-halved";
        }

        const responderItem = document.createElement("div");

        responderItem.className = `responder-item ${responderClass}`;

        responderItem.innerHTML = `
          <div class="responder-icon">
            <i class="fas ${responderIcon}"></i>
          </div>

          <div class="responder-info">
            <h4>${responder.responder_name}</h4>

            <p>
              <i class="fas fa-map-marker-alt"></i>
              ${responder.responder_address}
            </p>
          </div>

          <div class="responder-distance">
            <span class="dist-value">0.00</span>
            <span class="dist-unit">km</span>
          </div>
        `;

        primaryResponders.appendChild(responderItem);

        responderItem.addEventListener("click", async () => {

          responderMarker.openPopup();

          const existingRoute = mapMemory.activeRoutes.get(responder.responder_id);

          if(existingRoute) {
            responderItem.classList.remove("selected-responder");

            map.removeLayer(existingRoute.polyline);

            mapMemory.activeRoutes.delete(responder.responder_id);

            return;
          }

          if(!allowMultipleResponders) {
            mapMemory.activeRoutes.forEach(route => {
              map.removeLayer(route.polyline);
            });

            mapMemory.activeRoutes.clear();

            document.querySelectorAll(".selected-responder").forEach(item => {
              item.classList.remove("selected-responder");
            });
          }

          responderItem.classList.add("selected-responder");

          const routeData = await getEmergencyRoute(emergency.emergency_id, responder.responder_id);

          const latlngs = routeData.route.map(point => [
            point.lat,
            point.lng
          ]);

          const polyline = L.polyline(latlngs, {
            color: "#3b82f6",
            weight: 5,
            opacity: 0.8
          }).addTo(map);

          mapMemory.activeRoutes.set(responder.responder_id, {
            polyline: polyline,
            responder_id: responder.responder_id,
            distance: routeData.distance,
            eta: routeData.eta,
            route: routeData.route
          })

          const bounds = L.latLngBounds();

          mapMemory.activeRoutes.forEach(route => {
            bounds.extend(route.polyline.getBounds());
          });

          if(bounds.isValid()) {
            map.fitBounds(bounds, {
              padding: [50, 50]
            });
          }

        });

      });

      const deployBtn = document.getElementById("deployEmergencyRoutesBtn");

      deployBtn.addEventListener("click", async () => {

        const responders = [...mapMemory.activeRoutes.values()].map(route => ({
          responder_id: route.responder_id,
          distance: route.distance,
          eta: route.eta,
          route: route.route
        }));

        const result = await insertEmergencyRoutes(emergency.emergency_id, responders);

        if(result.status === "success") {
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

      });

    });

  });
}