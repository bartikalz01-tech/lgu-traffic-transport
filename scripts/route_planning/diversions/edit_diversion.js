import { fetchDiversionDetails, fetchGeneratedDiversion, updateDiversionRoute } from "../../data/fetch_road_map.js";
import { drawSimpleLine } from "../../utils/diversions.js";
import {
  state,
  clearDiversionMap,
  drawSimpleDiversionMarkers,
  renderRouteSelectionSidebar,
  initRouteSelectionSidebar
} from "./diversion_state.js";
import { resetDiversionUI, resetDiversionPlanner } from "./create_diversion_route.js";
import { renderActiveDiversionsSidebar } from "./view_active_diversions.js";

export function attachEditEvents(map) {
  const editButtons = document.querySelectorAll('.js-update-diversion');

  editButtons.forEach(btn => {
    btn.addEventListener("click", async (e) => {

      e.stopPropagation();

      const card = e.target.closest(".suggestion-card");

      const diversionId = card.dataset.diversionId;

      state.editingDiversionId = diversionId;

      const startNodeId = card.dataset.startNodeId;

      const endNodeId = card.dataset.endNodeId;

      const details = await fetchDiversionDetails(diversionId);

      if(!details || details.length === 0) {
        return;
      }

      state.originalDiversion = {
        route_config: card.dataset.config,
        distance: parseFloat(card.dataset.distance),
        route_signature: details.map(point => point.road_id).join("-"),
        points: details
      };

      const diversionSidebar = document.querySelector(".diversion-sidebar");
      diversionSidebar.innerHTML = `
        <div class="d-sidebar-header">
          <button class="back-btn" id="backToActiveDiversions">
            <i class="fas fa-arrow-left"></i>
          </button>

          <h3>Edit Diversion</h3>
        </div>

        ${renderRouteSelectionSidebar()}
      `;

      initRouteSelectionSidebar(card.dataset.config);

      const backBtn = document.getElementById("backToActiveDiversions");

      backBtn.addEventListener("click", async() => {
        clearDiversionMap(map);

        await renderActiveDiversionsSidebar(map);
      });

      document.getElementById("startPointName").textContent = card.dataset.start;

      document.getElementById("endPointName").textContent = card.dataset.end;

      document.getElementById("calcDistance").textContent = `${card.dataset.distance} km`;

      const placeholder = document.getElementById("suggestionPlaceholder");

      if(placeholder) {
        placeholder.remove();
      }

      clearDiversionMap(map);

      const generatedRoutes = await fetchGeneratedDiversion(startNodeId, endNodeId);

      if(!generatedRoutes || generatedRoutes.length === 0) {
        console.log("No generated routes");
        return;
      }

      state.generatedPreviewRoutes = generatedRoutes;

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

      state.previewDiversionPolyline = drawSimpleLine(map, originalPoints, null);

      drawSimpleDiversionMarkers(map, originalPoints, card.dataset.config)

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
          const route = state.generatedPreviewRoutes[parseInt(cardEl.dataset.index)];

          if(!route) return;

          clearDiversionMap(map);

          const routePoints = route.points.map(point => ({
            lat: parseFloat(point.lat),
            lng: parseFloat(point.lng)
          }));

          state.previewDiversionPolyline = drawSimpleLine(map, routePoints, null);

          drawSimpleDiversionMarkers(map, routePoints, document.getElementById("directionToggle").dataset.mode);

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

      activateBtn.addEventListener("click", async () => {
        const routeConfig = document.getElementById("directionToggle").dataset.mode;

        const selectedCard = document.querySelector(".generated-route-card.active-route");

        let payload = {
          diversion_id: state.editingDiversionId
        };

        if(routeConfig !== state.originalDiversion.route_config) {
          payload.route_config = routeConfig;
        }

        if(selectedCard) {
          const selectedRoute = state.generatedPreviewRoutes[Number(selectedCard.dataset.index)];

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

          clearDiversionMap(map);

          resetDiversionUI(map);

          resetDiversionPlanner(map);

          renderActiveDiversionsSidebar(map);
        } else {
          alert(result.message || "Failed to update diversion");
        }

      });

    });
  });
}
