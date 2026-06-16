import { getPuvGroup, getCurrentRoute, getDiversionRoutes, insertActivatePuvDiversion } from "../data/fetch_public_group_trans.js";
import { renderAddCurrentRoute } from "./puv_diversion/add_current_route.js";
import { initMap } from "../utils/traffic_and_events.js";

let currentRoutePolyline = [];
let diversionPolyline = [];

let terminalMarker = null;
let destinationMarker = null;

let showCurrentRoute = true;
let showDiversionRoute = true;

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
          <span class="legend-item" id="toggleCurrentRoute"><span class="dot primary"></span> Normal Route</span>
          <span class="legend-item" id="toggleDiversionRoute"><span class="dot alternate"></span> Proposed Diversion</span>
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
          <h4 id="diversionHeading"><i class="fas fa-directions"></i> Local Diversion Options</h4>
          <p id="diversionDescription">Waiting for diversion routes...</p>
        </div>

        <div class="diversion-routes-container" id="diversionRoutesContainer"></div>
      </div>
    </div>
  `;

  const puvAlternateRoute = initMap("puvDiversionMap");

  const puvDiversionDetailsContainer = document.querySelector(".puv-diversion-details-container");
  const puvSelect = document.getElementById("puvGroupSelect");
  const diversionRoutesContainer = document.getElementById("diversionRoutesContainer");
  const diversionHeading = document.getElementById("diversionHeading");
  const diversionDescription = document.getElementById("diversionDescription");
  const routeMetaCard = document.getElementById("routeMetaCard");
  const setDefaultRouteBtn = document.getElementById("btnCreateCurrentRoute");

  const toggleCurrentRouteBtn = document.getElementById("toggleCurrentRoute");
  const toggleDiversionRouteBtn = document.getElementById("toggleDiversionRoute");

  function togglePolylineVisibility(polylines, visible) {
    polylines.forEach(polyline => {
      if(polyline._path) {
        polyline._path.style.display = visible ? "block" : "none";
      }
    });
  }

  toggleCurrentRouteBtn.addEventListener("click", () => {
    showCurrentRoute = !showCurrentRoute;

    togglePolylineVisibility(
      currentRoutePolyline,
      showCurrentRoute
    );

    toggleCurrentRouteBtn.classList.toggle("active", showCurrentRoute);
  });

  toggleDiversionRouteBtn.addEventListener("click", () => {
    showDiversionRoute = !showDiversionRoute;

    togglePolylineVisibility(diversionPolyline, showDiversionRoute);

    toggleDiversionRouteBtn.classList.toggle("active", showDiversionRoute);
  });


  async function loadRouteStatus() {
    const puvGroupId = puvSelect.value;

    diversionRoutesContainer.innerHTML = `
      <div class="diversion-card">
        <p>Loading Diversion Routes...</p>
      </div>
    `;

    diversionHeading.innerHTML = `<i class="fas fa-directions"></i> Local Diversion Options`;

    diversionDescription.textContent = "Loading diversion routes...";

    const result = await getCurrentRoute(puvGroupId);

    currentRoutePolyline.forEach(polyline => {
      puvAlternateRoute.removeLayer(polyline);
    });

    currentRoutePolyline = [];

    diversionPolyline.forEach(polyline => {
      puvAlternateRoute.removeLayer(polyline);
    })

    diversionPolyline = [];

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

      const diversionResult = await getDiversionRoutes(puvGroupId);

      if(diversionResult.status === "success" && diversionResult.routes.length) {
        
        diversionHeading.innerHTML = `
          <i class="fas fa-directions"></i>
          Local Diversion Options (${diversionResult.routes.length} Suggestions)
        `;

        diversionDescription.textContent = "Select a route suggestion block to map coordinates";

        diversionRoutesContainer.innerHTML = diversionResult.routes.map((route, index) => `
          <div class="diversion-card" data-index="${index}">
            <div class="div-card-header">
              <span class="badge ${route.current_diversion ? "badge-success" : "badge_warning"}">
                ${route.current_diversion ? "Current Diversion" : "Diversion Option"}
              </span>
            </div>

            <h5>Diversion Route ${index + 1}</h5>

            <p class="div-card-desc">
              Distance: ${route.distance.toFixed(2)}
            </p>

            <div class="div-card-footer">
              <button 
                class="btn-preview-route show-route-btn" 
                id="activatePuvDiversion" 
                data-index="${index}"
                ${route.current_diversion ? "disabled" : ""}>
                ${route.current_diversion ? "Current Diversion" : "Activate Diversion"}
              </button>
            </div>
          </div>
        `).join("");

        document.querySelectorAll(".diversion-card").forEach(card => {
          card.addEventListener("click", () => {
            const routeIndex = Number(card.dataset.index);

            const selectedDiversionRoute = diversionResult.routes[routeIndex];

            document.querySelectorAll(".diversion-card").forEach(c => {
              c.classList.remove("active-suggestion");

              const footer = c.querySelector(".div-card-footer");

              footer.classList.add("hidden-footer");
            });

            card.classList.add("active-suggestion");

            card.querySelector(".div-card-footer").classList.remove("hidden-footer");

            diversionPolyline.forEach(polyline => {
              puvAlternateRoute.removeLayer(polyline);
            });

            diversionPolyline = [];

            console.log(selectedDiversionRoute.barangay_coords);

            const barangayCoords = selectedDiversionRoute.barangay_coords.map(coord => [
              Number(coord[0]),
              Number(coord[1])
            ]);

            console.log("Barangay converted:", barangayCoords);

            console.log(
              selectedDiversionRoute.osrm_route.routes[0]
              .geometry.coordinates.slice(0, 5)
            );

            const osrmCoords = selectedDiversionRoute.osrm_route.routes[0].geometry.coordinates.map(coord => [
              coord[1],
              coord[0]
            ]);

            const diversionCoords = [
              ...barangayCoords,
              ...osrmCoords.slice(1)
            ];

            const outline = L.polyline(diversionCoords, {
              color: "#ffffff",
              weight: 8
            }).addTo(puvAlternateRoute);

            const diversion = L.polyline(diversionCoords, {
              color: "#3498db",
              weight: 5
            }).addTo(puvAlternateRoute);

            diversionPolyline.push(outline);
            diversionPolyline.push(diversion);

            togglePolylineVisibility(diversionPolyline, showDiversionRoute);

            puvAlternateRoute.fitBounds(
              diversion.getBounds()
            );

            const activatePuvDiversionBtn = card.querySelector(".show-route-btn");

            activatePuvDiversionBtn.addEventListener("click", async (event) => {
              event.stopPropagation();

              const routeIndex = Number(activatePuvDiversionBtn.dataset.index);

              const selectedDiversionRoute = diversionResult.routes[routeIndex];

              console.log(selectedDiversionRoute);

              const payload = {
                puv_group_id: puvGroupId,
                destination_name: result.data.destination_name,
                exit_node_id: selectedDiversionRoute.exit_node_id,
                route_json: JSON.stringify({
                  coordinates: diversionCoords
                }),
                route_type: "diversion"
              };

              const saveResult = await insertActivatePuvDiversion(payload);

              if(saveResult.status === "success") {
                alert("Diversion route activated.");

                await loadRouteStatus();
              } else {
                alert(JSON.stringify(saveResult, null, 2));
              }

            });

          });
        });

      } else {
        diversionRoutesContainer.innerHTML = `
          <div class="diversion-card">
            <p>No Diversion Route assigned.</p>
          </div>
        `;

        diversionHeading.innerHTML = `
          <i class="fas fa-directions"></i>
          Local Diversion Options (0 Suggestions)
        `;

        diversionDescription.textContent = "No Diversion routes available for this PUV Group";
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

      togglePolylineVisibility(currentRoutePolyline, showCurrentRoute);

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