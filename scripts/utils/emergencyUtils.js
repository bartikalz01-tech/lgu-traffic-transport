import { getAssignedRoutes } from "../data/fetch_emergencies.js";

export function getEmergencyMarker(type, status = "active") {

  let iconClass = "fa-circle";

  let bgColor = "#7f8c8d";

  if (type === "church") {
    iconClass = "fa-church";
  } else if (type === "maintenance") {
    iconClass = "fa-hammer";
  } else if (type === "accident") {
    iconClass = "fa-car-crash";
  } else if (type === "fire") {
    iconClass = "fa-fire";
  } else if (type === "crime") {
    iconClass = "fa-mask";
  } else if (type === "closure") {
    iconClass = "fa-ban";
  } else if (type === "restaurant") {
    iconClass = "fa-utensils";
  } else if (type === "business") {
    iconClass = "fa-city";
  } else if (type === "hospital") {
    iconClass = "fa-h-square";
  }

  if(status === "active") {
    bgColor = "#e74c3c";
  } else if(status === "assigned") {
    bgColor = "#f1c40f";
  } else if(status === "resolved") {
    bgColor = "#7f8c8d";
  }

  return L.divIcon({
    className: "custom-label-marker",
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: ${bgColor};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
      ">
        <i class="fas ${iconClass}"></i>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
}

export async function loadAssingedRoutes(map, assignedRouteMemory) {
  const assigendRoutes = await getAssignedRoutes();

  assigendRoutes.forEach(routeData => {
    const routeCoords = JSON.parse(routeData.route_json);

    const latlngs = routeCoords.map(p => [p.lat, p.lng]);

    const polyline = L.polyline(latlngs, { 
      color: "#5fc8eb",
      weight: 5,
      opacity: 0.8
    });

    assignedRouteMemory[routeData.emergency_id] = {
      polyline,
      responder_id: routeData.responder_id,
      responder_name: routeData.responder_name,
      responder_type: routeData.responder_type,
      responder_address: routeData.responder_address,
      responder_lat: routeData.responder_lat,
      responder_lng: routeData.responder_lng,
      route_coords: routeCoords
    }

    /*L.marker([
      routeData.responder_lat,
      routeData.responder_lng
    ]).addTo(map)
      .bindPopup(`
        <b>${routeData.responder_name}</b>
        Assigend Responder
      `);*/
  });
}

export function getResponderMarkerIcon(type) {

  let bgColor = "#ef4444";
  let iconClass = "fa-fire-extinguisher";

  if(type === "hospital") {
    bgColor = "#22c55e";
    iconClass = "fa-hospital-user";

  } else if(type === "police") {
    bgColor = "#3b82f6";
    iconClass = "fa-shield-halved";
  }

  return L.divIcon({
    className: "custom-responder-marker",
    html: `
      <div style="
        background: ${bgColor};
        width: 38px;
        height: 38px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        border: 3px solid white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.25);
      ">
        <i class="fas ${iconClass}"></i>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19]
  });
}