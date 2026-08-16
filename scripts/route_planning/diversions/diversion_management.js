import { fetchRoadNodes, fetchRoadMap, fetchDiversions } from "../../data/fetch_road_map.js";
import { initMap } from "../../utils/diversions.js";
import {
  state,
  renderRouteSelectionSidebar,
  initRouteSelectionSidebar,
  setPlannerMode,
  resetDiversionPlanner,
  updateActiveDiversions
} from "./diversion_state.js";
import { renderActiveDiversionsSidebar } from "./view_active_diversions.js";
import {
  bindRefreshButton,
  bindActivateButton,
  resetDiversionUI,
  renderHighTrafficRoads,
  updateHighTrafficCount,
  renderRoadNodes
} from "./create_diversion_route.js";

export {
  setPlannerMode,
  resetDiversionPlanner,
  updateActiveDiversions
} from "./diversion_state.js";

export {
  bindRefreshButton,
  resetDiversionUI,
  bindActivateButton,
  renderHighTrafficRoads,
  updateHighTrafficCount,
  renderRoadNodes
} from "./create_diversion_route.js";

async function renderDiversionManagement(container) {
  container.innerHTML = `
    <div class="map-view-container">
      <div id="map-placeholder">
        <div class="map-overlay-hint">
          <i class="fas fa-crosshairs"></i>
          <p>Click two intersections to plan a diversion</p>
        </div>
        <!-- Map will render here -->
      </div>
    </div>

    <aside class="diversion-sidebar">
      ${renderRouteSelectionSidebar()}
    </aside>
  `;

  initRouteSelectionSidebar();

  const diversionMap = initMap("map-placeholder");

  bindRefreshButton(diversionMap);

  const roadMap = await fetchRoadMap();
  const activeDiversions = await fetchDiversions();
  renderHighTrafficRoads(diversionMap, roadMap);
  updateHighTrafficCount(roadMap);
  updateActiveDiversions(activeDiversions);

  const nodes = await fetchRoadNodes();
  renderRoadNodes(diversionMap, nodes);

  //const activateBtn = document.getElementById("activateDiversion"); 

  bindActivateButton(diversionMap);

  const activeDiversionCard = document.querySelector(".overview-card.active-diversions");

  activeDiversionCard.addEventListener("click", async () => {

    state.plannerMode = false;

    if(state.routeLine) {
      diversionMap.removeLayer(state.routeLine);
      state.routeLine = null;
    }

    await renderActiveDiversionsSidebar(diversionMap);
  })

}

document.addEventListener('DOMContentLoaded', async () => {
  const diversionContent = document.querySelector('.diversion-main-content');

  await renderDiversionManagement(diversionContent);
});
