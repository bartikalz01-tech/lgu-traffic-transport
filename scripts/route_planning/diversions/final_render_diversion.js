import { fetchDiversions, fetchDiversionDetails } from "../../data/fetch_road_map.js";
import { initMap } from "../../utils/diversions.js";

export async function renderDiversionMaps(container) {

  const diversions = await fetchDiversions();

  container.innerHTML = `
    <div class="map-view-wrapper">
      <div class="diversion-map-header">
        <div class="header-content">
          <p id="routeDescription">Loading Route...</p>
          <div id="headerIndicator"></div>
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

  async function updateRoute(index) {
    const diversion = diversions[index];

    if(!diversion) return;

    const routeArrow = diversion.route_config === "one-way" 
      ? '<i class="fas fa-arrow-right"></i>'
      : '<i class="fas fa-arrows-left-right"></i>'

    routeDescription.innerHTML = `
      ${diversion.start_name}
      ${routeArrow}
      ${diversion.end_name}
    `;

    currentIdx.textContent = index + 1;
    totalIdx.textContent = diversions.length;

    const points = await fetchDiversionDetails(diversion.diversion_id);

    if(!points.length) {
      return;
    }

    if(currentPolyline) {
      map.removeLayer(currentPolyline);
    }

    const coords = points.map(point => [
      parseFloat(point.lat),
      parseFloat(point.lng)
    ]);

    currentPolyline = L.polyline(coords, {
      color: "#2980b9",
      weight: 5
    }).addTo(map);

    map.fitBounds(currentPolyline.getBounds());

    loadDiversionStatus(diversion, points);
  }

  function loadDiversionStatus(diversion, points) {
    document.getElementById("routeDistance").textContent = `${diversion.distance} km`;

    document.getElementById("vehicleCount").textContent = diversion.vehicle_per_min ?? 0;

    document.getElementById("avgSpeed").textContent = diversion.avg_speed ?? 0;

    const affectedRoads = document.getElementById("affectedRoads");

    const uniqueRoads = [
      ...new Set(
        points.map(point => point.road_name).filter(Boolean)
      )
    ];

    affectedRoads.innerHTML = uniqueRoads.map(road => `
      <li>${road}</li>
    `).join("");
  }

  await updateRoute(0);

  nextBtn.addEventListener("click", async () => {
    currentIndex++;

    if(currentIndex >= diversions.length) {
      currentIndex = 0;
    }

    await updateRoute(currentIndex);
  });

  prevBtn.addEventListener("click", async () => {
    currentIndex--;

    if(currentIndex < 0) {
      currentIndex = diversions.length - 1;
    }

    await updateRoute(currentIndex);
  });
}