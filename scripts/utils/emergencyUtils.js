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

  if(status === "pending") {
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

export async function loadAssignedRoutes(map, assignedRouteMemory) {
  const assigendRoutes = await getAssignedRoutes();

  assigendRoutes.forEach(routeData => {
    const routeCoords = JSON.parse(routeData.route_json);

    const latlngs = routeCoords.map(p => [p.lat, p.lng]);

    let routeColor = "#5fc8eb";

    if(routeData.responder_type === "fire") {
      routeColor = "#ef4444";
    } else if(routeData.responder_type === "hospital") {
      routeColor = "#22c55e";
    } else if(routeData.responder_type === "police") {
      routeColor = "#3b82f6";
    }

    const polyline = L.polyline(latlngs, { 
      color: routeColor,
      weight: 5,
      opacity: 0.8
    });

    if(!assignedRouteMemory[routeData.emergency_id]) {
      assignedRouteMemory[routeData.emergency_id] = [];
    }

    assignedRouteMemory[routeData.emergency_id].push({
      polyline,
      responder_id: routeData.responder_id,
      responder_name: routeData.responder_name,
      responder_type: routeData.responder_type,
      responder_address: routeData.responder_address,
      responder_lat: routeData.responder_lat,
      responder_lng: routeData.responder_lng,
      distance: routeData.distance,
      eta: routeData.eta,
      route_coords: routeCoords,
      selected: routeData.selected
    })
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

export function renderResponderMarkers(responders, map, responderMarkers, clearExisting = true) {

  if(clearExisting) {
    // Remove previous responder markers
    responderMarkers.forEach(marker => {
      map.removeLayer(marker);
    });

    responderMarkers.length = 0;
  }

  responders.forEach(responder => {

    const marker = L.marker(
      [
        responder.responder_lat,
        responder.responder_lng
      ],
      {
        icon: getResponderMarkerIcon(responder.responder_type)
      }
    ).addTo(map);

    marker.bindPopup(`
      <strong>${responder.responder_name}</strong><br>
      ${responder.responder_address}
    `);

    responderMarkers.push(marker);

  });

}

export function formatEmergencyDate(datetime) {
  const emergencyDate = new Date(datetime);
  const today = new Date;

  const isToday = 
    emergencyDate.getDate() === today.getDate() &&
    emergencyDate.getMonth() === today.getMonth() &&
    emergencyDate.getFullYear() === today.getFullYear();

  if(isToday) {
    return emergencyDate.toLocaleTimeString("en-us", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  }

  return emergencyDate.toLocaleString("en-us", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
}

export function clearAllRoutes(
  emergencyMap,
  routeLine,
  activeAssignedPolylines
) {

  if(routeLine) {
    emergencyMap.removeLayer(routeLine);
  }

  activeAssignedPolylines.forEach(polyline => {
    emergencyMap.removeLayer(polyline);
  });

  return {
    routeLine: null,
    activeAssignedPolylines: []
  };
}