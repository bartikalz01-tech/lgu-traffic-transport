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