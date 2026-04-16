export function renderRouteList(selectedRoute) {
  const list = document.getElementById("routeList");
  list.innerHTML = "";

  selectedRoute.forEach((road, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${road.road_name}`;
    list.appendChild(li);
  });
}

export function drawSimpleLine(diversionMap, clickedPoints, routeLine) {
  if (routeLine) {
    diversionMap.removeLayer(routeLine);
  }

  const newLine = L.polyline(clickedPoints.map(p => [p.lat, p.lng]), {
    color: "blue",
    weight: 4
  }).addTo(diversionMap);

  diversionMap.fitBounds(newLine.getBounds());

  return newLine;
}

export function distance(a, b) {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];

  return Math.sqrt(dx * dx + dy * dy);
}

export function getNearestRoad(lat, lng, allRoadCoordinates) {
  let nearest = null;
  let minDistance = Infinity;

  allRoadCoordinates.forEach(point => {
    const d = distance([lat, lng], [point.lat, point.lng]);

    if (d < minDistance) {
      minDistance = d;
      nearest = point;
    }
  });

  return nearest;
}

export function calculateDistanceKm(points) {
  let total = 0;

  for(let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];

    total += haversine(p1.lat, p1.lng, p2.lat, p2.lng);
  }

  return Number(total.toFixed(4));
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) * 
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function toRad(value) {
  return value * Math.PI / 180;
}

const maps = {};

export function initMap(mapId) {

  if(maps[mapId]) {
    maps[mapId].remove();
    delete maps[mapId]
  }

  const map = L.map(mapId).setView([14.6414, 120.9909], 16.5);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  maps[mapId] = map;

  return map;
}

export function formatActiveDate(datetime) {
  const d = new Date(datetime);

  return d.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}