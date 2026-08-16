import { fetchDiversions, fetchDiversionDetails } from "../../data/fetch_road_map.js";
import { drawSimpleLine } from "../../utils/diversions.js";
import {
  state,
  clearDiversionMap,
  drawSimpleDiversionMarkers,
  renderRouteSelectionSidebar,
  initRouteSelectionSidebar,
  setPlannerMode,
  resetDiversionPlanner
} from "./diversion_state.js";
import { bindActivateButton } from "./create_diversion_route.js";
import { attachEditEvents } from "./edit_diversion.js";
import { attachDeleteEvents } from "./delete_diversion.js";

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

    setPlannerMode(true);
    
    clearDiversionMap(map);

    diversionSidebar.innerHTML = renderRouteSelectionSidebar();

    initRouteSelectionSidebar();

    resetDiversionPlanner();

    bindActivateButton(map);
  });

  attachDiversionViewEvents(map);
  attachEditEvents(map);
  attachDeleteEvents(map);

  const firstCard = document.querySelector(".diversion-history-card");

  if(firstCard) {
    firstCard.click();
  }
}

function attachDiversionViewEvents(map) {

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
      
      clearDiversionMap(map);

      state.activeDiversionPolyline = drawSimpleLine(
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

}
