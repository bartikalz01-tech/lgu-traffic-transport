import { getPuvGroup, getCurrentRoute, getDiversionRoutes } from "../data/fetch_public_group_trans.js";
import { renderAddCurrentRoute } from "./puv_diversion/add_current_route.js";
import { initMap } from "../utils/traffic_and_events.js";

let currentRoutePolyline = [];

let terminalMarker = null;
let destinationMarker = null;

export async function renderPuvDiversion(container) {
  container.innerHTML = `
    <div class="diversion-overview-container">
      <h1 class="diversion-overview-title"><i class="fas fa-code-branch"></i>PUV Routes</h1>
      <p class="sub-module-description">
        Configure hyper-local alternate route structures and local barangay exits during congestion periods.
      </p>
    </div>

    <div class="puv-diversion-container">
      <div class="puv-diversion-map-container">
        <div id="puvDiversionMap"></div>
        <div class="map-floating-legend">
          <span class="legend-item"><span class="dot primary"></span> Normal Route</span>
          <span class="legend-item"><span class="dot alternate"></span> Proposed Diversion</span>
        </div>
      </div>

      <div class="puv-diversion-details-container">
        <div class="current-route-container">
          <div class="current-route-header">
            <div class="section-badge">Current Status</div>
            <button class="btn-create-route" id="btnCreateCurrentRoute">
              <i class="fas fa-plus-circle"></i> Set Default Route
            </button>
          </div>
          <div class="puv-group-selector-row">
            <label for="puvGroupSelect">Select PUV Group:</label>
            <select id="puvGroupSelect" class="form-select-custom">
              <option value="group1">PUV Group 1</option>
              <option value="group2">PUV Group 2</option>
              <option value="group3">PUV Group 3</option>
            </select>
          </div>

          <div class="route-meta-card" id="routeMetaCard">
            <!--<div class="meta-item">
              <span class="meta-label">Primary Barangay Exit:</span>
              <span class="meta-value text-dark fw-bold">Dahlia St. Main Gate</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Est. Baseline Loop Time:</span>
              <span class="meta-value text-dark">14 mins</span>
            </div>-->
            <div class="meta-item">
              <span class="meta-label">Current Route</span>
              <span class="meta-label text-danger">No Route yet</span>
            </div>
          </div>
        </div>

        <div class="diversion-routes-heading">
          <h4><i class="fas fa-directions"></i> Local Diversion Options (5 Suggestions)</h4>
          <p>Select a route suggestion block to map coordinates or review narrow street limits.</p>
        </div>

        <div class="diversion-routes-container" id="diversionRoutesContainer">
          
        </div>
      </div>
    </div>
  `;

  const puvAlternateRoute = initMap("puvDiversionMap");

  const puvDiversionDetailsContainer = document.querySelector(".puv-diversion-details-container");
  const puvSelect = document.getElementById("puvGroupSelect");
  const diversionRoutesContainer = document.getElementById("diversionRoutesContainer");
  const routeMetaCard = document.getElementById("routeMetaCard");
  const setDefaultRouteBtn = document.getElementById("btnCreateCurrentRoute");


  async function loadRouteStatus() {
    const puvGroupId = puvSelect.value;

    const result = await getCurrentRoute(puvGroupId);

    currentRoutePolyline.forEach(polyline => {
      puvAlternateRoute.removeLayer(polyline);
    });

    currentRoutePolyline = [];

    if(terminalMarker) {
      puvAlternateRoute.removeLayer(terminalMarker);
      terminalMarker = null;
    }

    if(destinationMarker) {
      puvAlternateRoute.removeLayer(destinationMarker);
      destinationMarker = null;
    }

    if(result.status === "success" && result.data) {
      setDefaultRouteBtn.style.display = "none";

      routeMetaCard.innerHTML = `
        <div class="meta-item">
          <span class="meta-label">Destination</span>

          <span class="meta-value text-dark fw-bold">
            ${result.data.destination_name}
          </span>
        </div>

        <div class="meta-item">
          <span class="meta-label">Route Type:</span>

          <span class="meta-value text-success">Current Route Assigned</span>
        </div>
      `;

      const routeData = JSON.parse(result.data.route_json);

      const selectedGroup = puvGroups.data.find(
        group => group.puv_group_id == puvGroupId
      );

      const diversionResult = await getDiversionRoutes(selectedGroup.latitude, selectedGroup.longitude);

      if(diversionResult.status === "success" && diversionResult.data.length > 0) {
        diversionRoutesContainer.innerHTML = diversionResult.data.map((route, index) => {
          let badgeClass = "badge-neutral";
          let badgeText = `Option ${index + 1}`;

          if(index === 0) {
            badgeClass = "badge-success";
            badgeText = "Option 1 (Optimal)";
          }

          if(index === 1) {
            badgeClass = "badge-warning";
            badgeText = "Option 2 (Secondary)";
          }

          return `
            <div class="diversion-card" data-route-index="${index}">
              <div class="div-card-header">
                <span class="badge ${badgeClass}">${badgeText}</span>
                <span class="exit-counter"><i class="fas fa-door-open"></i> ${route.exit_name}</span>
              </div>

              <h5>${route.exit_name}</h5>

              <p class="div-card-desc">${route.description}</p>

              <div class="div-card-footer">
                <span>Distance: <strong>${route.distance.toFixed(4)}</strong></span>

                <button class="btn-preview-route">Activate Route</button>
              </div>
            </div>
          `;
        }).join("");

        const diversionCards = document.querySelectorAll(".diversion-card");

        diversionCards.forEach(card => {
          card.addEventListener("click", () => {

            diversionCards.forEach(c => {
              c.classList.remove("active-suggestion");

              const btn = c.querySelector(".btn-preview-route");

              btn.classList.remove("show-route-btn");
            });

            card.classList.add("active-suggestion");

            const btn = card.querySelector(".btn-preview-route");
            btn.classList.add("show-route-btn");

          });
        });

      } else {
        diversionRoutesContainer.innerHTML = `
          <div class="diversion-card">
            <p>No diversion routes available.</p>
          </div>
        `;
      }

      const terminalIcon = L.divIcon({
        html: `
          <div class="terminal-marker">
            <i class="fas fa-bus"></i>
          </div>
        `,
        className: "",
        iconSize: [30, 30],
        iconAnchor: [15, 30]
      });

      terminalMarker = L.marker([
        selectedGroup.latitude,
        selectedGroup.longitude
      ], { icon: terminalIcon })
      .addTo(puvAlternateRoute)
      .bindPopup(`
        <b>${selectedGroup.puv_group_name}</b><br>
        Terminal Location
      `);

      const barangayCoords = routeData.barangay_coords.map(coord => [
        Number(coord[1]),
        Number(coord[0])
      ]);

      const osrmCoords = routeData.osrm_route.routes[0].geometry.coordinates.map(coord => [
        coord[1],
        coord[0]
      ]);

      const lastCoord = routeData.osrm_route.routes[0].geometry.coordinates.slice(-1)[0];

      const destinationIcon = L.divIcon({
        html: `
          <div class="destination-marker">
            <i class="fas fa-flag-checkered"></i>
          </div>
        `,
        className: "",
        iconSize: [30, 30],
        iconAnchor: [15, 30]
      });

      destinationMarker = L.marker([
        lastCoord[1],
        lastCoord[0]
      ], { icon: destinationIcon })
      .addTo(puvAlternateRoute)
      .bindPopup(`
        <b>${result.data.destination_name}</b>
      `);

      const fullRoute = [
        ...barangayCoords,
        ...osrmCoords.slice(1)
      ];

      const outline = L.polyline(fullRoute, {
        color: "#ffffff",
        weight: 10
      }).addTo(puvAlternateRoute);

      const route = L.polyline(fullRoute, {
        color: "#475569",
        weight: 6
      }).addTo(puvAlternateRoute);

      currentRoutePolyline.push(outline);
      currentRoutePolyline.push(route);

      puvAlternateRoute.fitBounds(route.getBounds());

    } else {
      setDefaultRouteBtn.style.display = "inline-flex";

      routeMetaCard.innerHTML = `
        <div class="meta-item">
          <span class="meta-label">
            Current Route
          </span>

          <span class="meta-label text-danger">
            No Route Yet
          </span>
        </div>
      `;
    }
  }


  const puvGroups = await getPuvGroup();
  if(puvGroups.status === "success") {

    puvSelect.innerHTML = puvGroups.data.map(group => `
      <option value="${group.puv_group_id}">${group.puv_group_name}</option>
    `).join("");

    await loadRouteStatus();

    puvSelect.addEventListener("change", loadRouteStatus);
  }

  setDefaultRouteBtn.addEventListener("click", async () => {

    const puvGroupId = puvSelect.value;

    const selectedGroup = puvGroups.data.find(group => group.puv_group_id == puvGroupId);

    puvDiversionDetailsContainer.innerHTML = '';

    renderAddCurrentRoute(
      puvDiversionDetailsContainer, 
      selectedGroup, 
      puvAlternateRoute,
      () => renderPuvDiversion(container)
    );
  });
}