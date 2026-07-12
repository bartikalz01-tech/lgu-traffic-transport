import { getEmergencyRoute } from "../../../data/fetch_emergencies.js";
import { mapMemory } from "../emergency_memory.js";
import { getResponderMarkerIcon } from "../../../utils/emergencyUtils.js";

export async function renderResponderList(responders, emergency, primaryResponders, map, allowMultipleResponders) {

  let skeletonRemoved = false;

  mapMemory.responderMarkers.forEach(marker => {
    map.removeLayer(marker);
  });

  mapMemory.responderMarkers.length = 0;

  responders.forEach(async (responder) => {

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
    `);

    mapMemory.responderMarkers.push(responderMarker);

    const routeData = await getEmergencyRoute(
      emergency.emergency_id,
      responder.responder_id
    );

    let responderClass = "";
    let responderIcon = "";

    if (responder.type === "hospital") {
      responderClass = "medical-dept";
      responderIcon = "fa-hospital-user";
    } else if (responder.type === "fire") {
      responderClass = "fire-dept";
      responderIcon = "fa-fire-extinguisher";
    } else if (responder.type === "police") {
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
        <span class="dist-value">
            ${(routeData.distance / 1000).toFixed(2)}
        </span>

        <span class="dist-unit">km</span>
      </div>
    `;

    if (!skeletonRemoved) {
      primaryResponders.innerHTML = "";
      skeletonRemoved = true;
    }

    primaryResponders.appendChild(responderItem);

    responderItem.addEventListener("click", async () => {

      responderMarker.openPopup();

      const existingRoute = mapMemory.activeRoutes.get(responder.responder_id);

      if (existingRoute) {

        responderItem.classList.remove("selected-responder");

        map.removeLayer(existingRoute.polyline);

        mapMemory.activeRoutes.delete(responder.responder_id);

        return;
      }

      if (!allowMultipleResponders) {

        mapMemory.activeRoutes.forEach(route => {
          map.removeLayer(route.polyline);
        });

        mapMemory.activeRoutes.clear();

        document.querySelectorAll(".selected-responder").forEach(item => 
          item.classList.remove("selected-responder")
        );
      }

      responderItem.classList.add("selected-responder");

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
        polyline,
        responder_id: responder.responder_id,
        distance: routeData.distance,
        eta: routeData.eta,
        route: routeData.route
      });

      const bounds = L.latLngBounds();

      mapMemory.activeRoutes.forEach(route => {
        bounds.extend(route.polyline.getBounds());
      });

      if (bounds.isValid()) {
        map.fitBounds(bounds, {
          padding: [50, 50]
        });
      }

    });

  });

}