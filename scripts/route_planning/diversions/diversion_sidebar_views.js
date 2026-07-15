import { fetchDiversions, fetchDiversionDetails, fetchGeneratedDiversion, updateDiversionRoute, deleteDiversionRoute } from "../../data/fetch_road_map.js";
import { drawSimpleLine } from "../../utils/diversions.js";
import { updateActiveDiversions } from "./diversion_management.js";

let activeDiversionPolyline = null;
let editingDiversionId = null;
let previewDiversionPolyline = null;
let generatedPreviewRoutes = [];

let startDiversionMarker = null;
let endDiversionMarker = null;

let originalDiversion = null;

function drawSimpleDiversionMarkers(map, points, routeConfig) {
  if(startDiversionMarker) {
    map.removeLayer(startDiversionMarker);
    startDiversionMarker = null;
  }

  if(endDiversionMarker) {
    map.removeLayer(endDiversionMarker);
    endDiversionMarker = null;
  }

  /*if(routeConfig !== "one-way") {
    return;
  }*/

  const startPoint = points[0];
  const endPoint = points[points.length - 1];

  if(routeConfig === "one-way") {
    const startIcon = L.divIcon({
      className: "diversion-start-marker",
      html: `
        <div class="marker-circle start">
          <i class="fas fa-traffic-light"></i>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    const endIcon = L.divIcon({
      className: "diversion-end-marker",
      html: `
        <div class="marker-circle end">
          <i class="fas fa-flag-checkered"></i>
        </div>
      `,
      iconSize: [34,34],
      iconAnchor: [17,17]
    });

    startDiversionMarker = L.marker(
      [startPoint.lat, startPoint.lng],
      {
        icon: startIcon
      }
    ).addTo(map);

    endDiversionMarker = L.marker(
      [endPoint.lat, endPoint.lng],
      {
        icon: endIcon
      }
    ).addTo(map);

  } else if(routeConfig === "two-way") {
    const pointIcon = L.divIcon({
      className: "diversion-two-way-marker",
      html: `
        <div class="marker-circle two-way">
          <i class="fas fa-map-marker-alt"></i>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    startDiversionMarker = L.marker(
      [startPoint.lat, startPoint.lng],
      { icon: pointIcon }
    ).addTo(map);

    endDiversionMarker = L.marker(
      [endPoint.lat, endPoint.lng],
      { icon: pointIcon }
    ).addTo(map);
  }

}

export function renderRouteSelectionSidebar() {

  return `
    <div class="d-sidebar-header">
      <h3>Route Selection</h3>
    </div>

    <div class="selection-group">
      <div class="point-item start">
        <span class="dot"></span>
        <div class="point-info">
          <label id="startPointLabel">Point A</label>
          <p id="startPointName">Awaiting Selection...</p>
        </div>
      </div>

      <div class="point-item end">
        <span class="dot"></span>
        <div class="point-info">
          <label id="endPointLabel">Point B</label>
          <p id="endPointName">Awaiting Selection...</p>
        </div>
      </div>
    </div>

    <div class="distance-summary">
      <span>Total Distance:</span>
      <strong id="calcDistance">0.00 km</strong>
    </div>

    <div class="route-config">
      <label class="list-label">Route Configuration</label>
      <button class="toggle-btn" id="directionToggle" data-mode="two-way">
        <i class="fas fa-arrows-left-right"></i>
        <span>Two way route</span>
      </button>
    </div>

    <div class="suggestions-list">
      <label class="list-label">Diversion Suggesstions</label>
      <div id="suggestionPlaceholder" class="sugestions-loading suggestions-empty">
        <div class="spinner"></div>
        
        <div class="empty-state-icon">
          <i class="fas fa-route"></i>
        </div>

        <h4>No Route Generated Yet</h4>

        <p>Select two intersections on the map to generate diversion route suggestions</p>
      </div>
    </div>

    <div class="sidebar-actions hidden" id="sidebarActions">
      <button class="btn btn-primary btn-full" id="activateDiversion">
        <i class="fas fa-check-circle"></i>
        Activate Diversion
      </button>
    </div>
  `;
}

export async function renderActiveDiversionsSidebar(map) {

  const diversions = await fetchDiversions();

  let html = `
    <div class="d-sidebar-header">
      <button class="back-btn" id="backToPlanner">
        <i class="fas fa-arrow-left"></i>
      </button>

      <h3>Active Diversions</h3>
    </div>

    <div class="selection-group">
      <div class="point-item start two-way">
        <span class="dot"></span>

        <div class="point-info">
          <label>Point A</label>
          <p>Active Diversion Start</p>
        </div>
      </div>

      <div class="point-item end two-way">
        <span class="dot"></span>

        <div class="point-info">
          <label>Point B</label>
          <p>Active Diversion End</p>
        </div>
      </div>
    </div>

    <div class="distance-summary">
      <span>Total Distance:</span>
      <strong>Select a diversion</strong>
    </div>

    <div class="route-config">
      <label class="list-label">
        Active Diversion Routes
      </label>

      <div class="toggle-btn">
        <i class="fas fa-route"></i>
        <span>Live Diversion Monitoring</span>
      </div>
    </div>

    <div class="suggestions-list">
      <label class="list-label">
        Active Diversions
      </label>
  `;

  if (diversions.length === 0) {

    html += `
      <div class="no-route">
        No active diversions found
      </div>
    `;

  } else {

    for (const [index, diversion] of diversions.entries()) {

      const details = await fetchDiversionDetails(diversion.diversion_id);

      const uniqueRoads = [
        ...new Set(
          details.map(point => point.road_name).filter(Boolean)
        )
      ];

      html += `
        <div 
          class="suggestion-card diversion-history-card"
          data-diversion-id="${diversion.diversion_id}"
          data-distance="${diversion.distance}"
          data-start="${diversion.start_name}"
          data-end="${diversion.end_name}"
          data-config="${diversion.route_config}"
          data-start-road-id="${diversion.start_road_id}"
          data-end-road-id="${diversion.end_road_id}"
          data-start-node-id="${diversion.start_node_id}"
          data-end-node-id="${diversion.end_node_id}"
        >

          <div class="suggestion-meta">

            <span class="badge ${index === 0
          ? "fastest"
          : index === 1
            ? "shortest"
            : "alternative"
        }">
              Route ${index + 1}
            </span>

            <div class="card-management-actions">
              <button class="action-btn edit-btn js-update-diversion" title="Update Route">
                <i class="fas fa-pen-to-square"></i>
              </button>
              <button class="action-btn delete-btn js-delete-diversion" title="Remove Diversion">
                <i class="fas fa-trash-can"></i>
              </button>
            </div>

            <span class="eta">
              ${diversion.distance} km
            </span>

          </div>

          <ul class="affected-roads-list">
            ${uniqueRoads.map(road => `
              <li>${road}</li>
            `).join("")}
          </ul>

        </div>
      `;
    };

  }

  html += `</div>`;

  const diversionSidebar = document.querySelector(".diversion-sidebar");

  diversionSidebar.innerHTML = html;

  const backBtn = document.getElementById("backToPlanner");

  backBtn.addEventListener("click", async () => {
    if (activeDiversionPolyline) {
      map.removeLayer(activeDiversionPolyline);
      activeDiversionPolyline = null;
    }

    if(startDiversionMarker) {
      map.removeLayer(startDiversionMarker);
      startDiversionMarker = null;
    }

    if(endDiversionMarker) {
      map.removeLayer(endDiversionMarker);
      endDiversionMarker = null
    }

    diversionSidebar.innerHTML = renderRouteSelectionSidebar();

    initRouteSelectionSidebar();
  });

  attachDiversionHistoryEvents(map);
}

async function attachDiversionHistoryEvents(map) {

  const cards = document.querySelectorAll(".diversion-history-card");

  cards.forEach(card => {

    card.addEventListener("click", async () => {

      const diversionId = card.dataset.diversionId;

      const details = await fetchDiversionDetails(diversionId);

      if (!details || details.length === 0) {
        return;
      }

      /*
      =========================================
      DRAW ROUTE
      =========================================
      */

      const points = details.map(point => ({
        lat: parseFloat(point.lat),
        lng: parseFloat(point.lng)
      }));

      if (activeDiversionPolyline) {
        map.removeLayer(activeDiversionPolyline);
        activeDiversionPolyline = null
      }

      if(startDiversionMarker) {
        map.removeLayer(startDiversionMarker);
        startDiversionMarker = null;
      }

      if(endDiversionMarker) {
        map.removeLayer(endDiversionMarker);
        endDiversionMarker = null;
      }

      activeDiversionPolyline = drawSimpleLine(
        map,
        points,
        null
      );

      drawSimpleDiversionMarkers(map, points, card.dataset.config);

      map.fitBounds(
        L.latLngBounds(points.map(p => [p.lat, p.lng])),
        {
          padding: [50, 50]
        }
      );

      /*
      =========================================
      ACTIVE CARD UI
      =========================================
      */

      cards.forEach(c => {
        c.classList.remove("active-route");
      });

      card.classList.add("active-route");

      /*
      =========================================
      UPDATE SIDEBAR TOP SECTION
      =========================================
      */

      const startName = card.dataset.start;
      const endName = card.dataset.end;
      const distance = card.dataset.distance;
      const config = card.dataset.config;

      const startLabel = document.querySelector(".point-item.start label");
      const endLabel = document.querySelector(".point-item.end label");

      const startItem = document.querySelector(".point-item.start");
      const endItem = document.querySelector(".point-item.end");

      if (config === "one-way") {
        startLabel.textContent = "Starting Point";
        endLabel.textContent = "End Point";

        startItem.classList.remove("two-way");
        endItem.classList.remove("two-way");
      } else {
        startLabel.textContent = "Point A";
        endLabel.textContent = "Point B";

        startItem.classList.add("two-way");
        endItem.classList.add("two-way");
      }

      /*
      POINTS
      */

      document.querySelector(
        ".point-item.start .point-info p"
      ).textContent = startName;

      document.querySelector(
        ".point-item.end .point-info p"
      ).textContent = endName;

      /*
      DISTANCE
      */

      document.querySelector(
        ".distance-summary strong"
      ).textContent = `${distance} km`;

      /*
      ROUTE CONFIG LABEL
      */

      const routeConfigSpan = document.querySelector(
        ".route-config .toggle-btn span"
      );

      routeConfigSpan.textContent =
        config === "one-way"
          ? "One-Way Diversion"
          : "Two-Way Diversion";

      /*
      =========================================
      AFFECTED ROADS
      =========================================
      */

      const uniqueRoads = [
        ...new Set(
          details.map(point => point.road_name).filter(Boolean)
        )
      ];

      const affectedRoadsHTML = uniqueRoads.map(road => `
        <li>${road}</li>
      `).join("");

      const oldAffectedRoads =
        document.querySelector(".live-affected-roads");

      if (oldAffectedRoads) {
        oldAffectedRoads.remove();
      }

      const suggestionsList = document.querySelector(".suggestions-list");
    });

  });

  const editButtons = document.querySelectorAll('.js-update-diversion');
  const deleteButtons = document.querySelectorAll('.js-delete-diversion');

  editButtons.forEach(btn => {
    btn.addEventListener("click", async (e) => {

      e.stopPropagation();

      const card = e.target.closest(".suggestion-card");

      const diversionId = card.dataset.diversionId;

      editingDiversionId = diversionId;

      const startNodeId = card.dataset.startNodeId;

      const endNodeId = card.dataset.endNodeId;

      const details = await fetchDiversionDetails(diversionId);

      if(!details || details.length === 0) {
        return;
      }

      originalDiversion = {
        route_config: card.dataset.config,
        distance: parseFloat(card.dataset.distance),
        route_signature: details.map(point => point.road_id).join("-"),
        points: details
      };

      const diversionSidebar = document.querySelector(".diversion-sidebar");

      diversionSidebar.innerHTML = renderRouteSelectionSidebar();

      initRouteSelectionSidebar(card.dataset.config);

      document.getElementById("startPointName").textContent = card.dataset.start;

      document.getElementById("endPointName").textContent = card.dataset.end;

      document.getElementById("calcDistance").textContent = `${card.dataset.distance} km`;

      const placeholder = document.getElementById("suggestionPlaceholder");

      if(placeholder) {
        placeholder.remove();
      }

      if(activeDiversionPolyline) {
        map.removeLayer(activeDiversionPolyline);
        activeDiversionPolyline = null;
      }

      if(previewDiversionPolyline) {
        map.removeLayer(previewDiversionPolyline);
        previewDiversionPolyline = null;
      }

      const generatedRoutes = await fetchGeneratedDiversion(startNodeId, endNodeId);

      if(!generatedRoutes || generatedRoutes.length === 0) {
        console.log("No generated routes");
        return;
      }

      generatedPreviewRoutes = generatedRoutes;

      const suggestionsList = document.querySelector(".suggestions-list");

      generatedRoutes.forEach((route, index) => {
        const roads = [
          ...new Set(
            route.points.map(p => p.road_name).filter(Boolean)
          )
        ];

        suggestionsList.insertAdjacentHTML(
          "beforeend",
          `
            <div class="suggestion-card generated-route-card" data-index="${index}">
              <div class="suggestion-meta">
                <span class="badge">Route ${index + 1}</span>

                <span class="eta">${route.distance} km</span>
              </div>

              <ul class="affected-roads-list">
                ${roads.map(road => `
                  <li>${road}</li>  
                `).join("")}
              </ul>
            </div>
          `
        );
      });

      const originalPoints = details.map(point => ({
        lat: parseFloat(point.lat),
        lng: parseFloat(point.lng)
      }));

      previewDiversionPolyline = drawSimpleLine(map, originalPoints, null);

      map.fitBounds(
        L.latLngBounds(
          originalPoints.map(
            p => [p.lat, p.lng]
          )
        ),
        {
          padding: [50, 50]
        }
      );

      const generatedCards = document.querySelectorAll(".generated-route-card");

      generatedCards.forEach(cardEl => {
        cardEl.addEventListener("click", () => {
          const route = generatedPreviewRoutes[parseInt(cardEl.dataset.index)];

          if(!route) return;

          if(previewDiversionPolyline) {
            map.removeLayer(previewDiversionPolyline);
          }

          const routePoints = route.points.map(point => ({
            lat: parseFloat(point.lat),
            lng: parseFloat(point.lng)
          }));

          previewDiversionPolyline = drawSimpleLine(map, routePoints, null);

          generatedCards.forEach(c => {
            c.classList.remove("active-route");
          });

          cardEl.classList.add("active-route");

          document.getElementById("calcDistance").textContent = `${route.distance} km`;
        });
      });

      const activateBtn = document.getElementById("activateDiversion");

      activateBtn.innerHTML = `
        <i class="fas fa-pen"></i>
        Update Diversion
      `;

      document.getElementById("sidebarActions").classList.remove("hidden");

      /*activateBtn.addEventListener("click", async () => {
        const selectedCard = document.querySelector(".generated-route-card.active-route");

        if(!selectedCard) {
          alert("Please Select a diversion route first.");
          return;
        }

        const selectedIndex = parseInt(selectedCard.dataset.index);

        const selectedRoute = generatedPreviewRoutes[selectedIndex];

        if(!selectedRoute) {
          alert("Invalid Route selected");
          return;
        }

        const routeConfig = document.getElementById("directionToggle").dataset.mode;

        const routeSignature = selectedRoute.points.map(point => point.road_id).join("-");

        const payload = {
          diversion_id: editingDiversionId,
          route_config: routeConfig,
          route_signature: routeSignature,
          distance: selectedRoute.distance,
          points: selectedRoute.points
        };

        console.log("UPDATE PAYLOAD:", payload);

        const result = await updateDiversionRoute(payload);

        console.log(result);

        if(result.success) {
          alert("Diversion updated successfully!");

          if(previewDiversionPolyline) {
            map.removeLayer(previewDiversionPolyline);
            previewDiversionPolyline = null;
          }

          if(activeDiversionPolyline) {
            map.removeLayer(activeDiversionPolyline);
            activeDiversionPolyline = null;
          }

          renderActiveDiversionsSidebar(map);
        } else {
          alert(result.message || "Failed to update diversion.");
        }
      });*/

      activateBtn.addEventListener("click", async () => {
        const routeConfig = document.getElementById("directionToggle").dataset.mode;

        const selectedCard = document.querySelector(".generated-route-card.active-route");

        let payload = {
          diversion_id: editingDiversionId
        };

        if(routeConfig !== originalDiversion.route_config) {
          payload.route_config = routeConfig;
        }

        if(selectedCard) {
          const selectedRoute = generatedPreviewRoutes[Number(selectedCard.dataset.index)];

          payload.route_signature = 
            selectedRoute.points.map(point => point.road_id).join("-");

          payload.distance = selectedRoute.distance;

          payload.points = selectedRoute.points;
        }

        if(Object.keys(payload).length === 1) {
          alert("No changes were made.");
          return;
        }

        console.log(payload);

        const result = await updateDiversionRoute(payload);

        if(result.success) {
          alert("Diversion updated successfully!");

          if(previewDiversionPolyline) {
            map.removeLayer(previewDiversionPolyline);
            previewDiversionPolyline = null;
          }

          if(activeDiversionPolyline){
            map.removeLayer(activeDiversionPolyline);
            activeDiversionPolyline = null;
          }

          renderActiveDiversionsSidebar(map);
        } else {
          alert(result.message || "Failed to update diversion");
        }

      });

    });
  });

  deleteButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation(); // Stops the card click event
      
      const card = e.target.closest('.suggestion-card');

      const diversionId = card.dataset.diversionId;

      const confirmed = confirm("Are you sure you wan to delete this diversion?");

      if(!confirmed) {
        return;
      }

      const result = await deleteDiversionRoute(diversionId);

      if(result.success) {

        const updateDiversionCount = await fetchDiversions();

        if(activeDiversionPolyline) {
          map.removeLayer(activeDiversionPolyline);
          activeDiversionPolyline = null;
        }

        if(previewDiversionPolyline) {
          map.removeLayer(previewDiversionPolyline);
          previewDiversionPolyline = null;
        }

        renderActiveDiversionsSidebar(map);

        updateActiveDiversions(updateDiversionCount);

        alert("Diversion deleted successfully");
      } else {
        alert(result.message || "Failed to delete diversion.");
      }
    });
  });

}

export function initRouteSelectionSidebar(initialMode = "two-way") {
  const dirToggle = document.getElementById("directionToggle");

  if (!dirToggle) return;

  const startLabel = document.getElementById("startPointLabel");
  const endLabel = document.getElementById("endPointLabel");

  const startItem = document.querySelector(".point-item.start");
  const endItem = document.querySelector(".point-item.end");

  if (initialMode === "one-way") {
    dirToggle.setAttribute(
      "data-mode",
      "one-way"
    );

    dirToggle.innerHTML = `
      <i class="fas fa-arrow-right"></i>
      <span>One-Way Only</span>
    `;

    dirToggle.classList.add("one-way-active");

    startLabel.textContent = "Starting Point";
    endLabel.textContent = "End Point";

    startItem.classList.remove("two-way");
    endItem.classList.remove("two-way")
  } else {
    dirToggle.setAttribute(
      "data-mode",
      "two-way"
    );

    dirToggle.innerHTML = `
      <i class="fas fa-arrows-left-right"></i>
      <span>Two-Way Route</span>
    `;

    dirToggle.classList.remove("one-way-active");

    startLabel.textContent = "Point A";
    endLabel.textContent = "Point B";

    startItem.classList.add("two-way");
    endItem.classList.add("two-way");
  }

  dirToggle.addEventListener("click", () => {
    const isTwoWay = dirToggle.getAttribute("data-mode") === "two-way";

    if (isTwoWay) {
      dirToggle.setAttribute("data-mode", "one-way");

      dirToggle.innerHTML = `
        <i class="fas fa-arrow-right"></i>
        <span>One-Way Only</span>
      `;

      dirToggle.classList.add("one-way-active");

      startLabel.textContent = "Starting Point";
      endLabel.textContent = "End Point";

      startItem.classList.remove("two-way");
      endItem.classList.remove("two-way");
    } else {
      dirToggle.setAttribute("data-mode", "two-way");

      dirToggle.innerHTML = `
        <i class="fas fa-arrows-left-right"></i>
        <span>Two-Way Route</span>
      `;

      dirToggle.classList.remove("one-way-active");

      startLabel.textContent = "Point A";
      endLabel.textContent = "Point B";

      startItem.classList.add("two-way");
      endItem.classList.add("two-way");
    }

  });
}