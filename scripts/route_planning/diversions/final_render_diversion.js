import { fetchGeneratedDiversion } from "../../data/fetch_road_map.js";
import { initMap } from "../../utils/diversions.js";

export async function renderDiversionMaps(container) {

  const routes = [
    { start: 1, end: 10 },
    { start: 1, end: 9 },
    { start: 1, end: 2 },
    { start: 2, end: 10 },
    { start: 2, end: 9 },
    { start: 9, end: 10 },
  ];

  const responses = await Promise.all(
    routes.map(route => fetchGeneratedDiversion(route.start, route.end))
  );

  const diversionData = responses.filter(route => route);

  container.innerHTML = `
    <div class="map-view-wrapper">
      <div class="diversion-map-header">
        <div class="header-content">
          <p id="routeDescription">Loading Route...</p>
        </div>
      </div>

      <div class="map-container">
        <div id="map"></div>
      </div>

      <div class="map-navigation-bar">
        <button class="nav-arrow prev" id="prevRoute">
          <i class="fas fa-chevron-left"></i>
          <span>Previous Plan</span>
        </button>

        <div class="route-pagination">
          <span class="current-idx">1</span> / <span class="total-idx">3</span>
        </div>

        <button class="nav-arrow next" id="nextRoute">
          <span>Next Plan</span>
          <i class="fas fa-chevron-right"></i>
        </button> 
      </div>
    </div>
  `;

  const routeDescription = document.getElementById("routeDescription");
  const currentIdx = document.querySelector(".current-idx");
  const totalIdx = document.querySelector(".total-idx");
  const prevBtn = document.getElementById("prevRoute");
  const nextBtn = document.getElementById("nextRoute");

  const map = initMap("map");

  let currentIndex = 0;
  let currentPolyline = null;

  function updateRoute(index) {
    const route = diversionData[index];

    if(!route) return;

    const startRoads = route.start_node_roads.map(r => r.road_name).join(" Cor. ");
    const endRoads = route.end_node_roads.map(r => r.road_name).join(" Cor. ");

    routeDescription.innerHTML = `
      ${startRoads}
      <i class="fas fa-arrow-left"></i>
      <i class="fas fa-arrow-right"></i>
      ${endRoads}
    `;

    currentIdx.textContent = index + 1;

    totalIdx.textContent = diversionData.length;

    if(currentPolyline) {
      map.removeLayer(currentPolyline);
    }

    const coords = route.points.map(point => [
      point.lat,
      point.lng
    ]);

    currentPolyline = L.polyline(coords, {
      color: "#2980b9",
      weight: 5
    }).addTo(map);

    map.fitBounds(currentPolyline.getBounds());
  }

  updateRoute(0);

  nextBtn.addEventListener("click", () => {
    currentIndex++;

    if(currentIndex >= diversionData.length) {
      currentIndex = 0;
    }

    updateRoute(currentIndex);
  });

  prevBtn.addEventListener("click", () => {
    currentIndex--;

    if(currentIndex < 0) {
      currentIndex = diversionData.length - 1;
    }

    updateRoute(currentIndex);
  });
}