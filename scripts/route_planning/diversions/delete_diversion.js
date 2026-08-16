import { fetchDiversions, deleteDiversionRoute } from "../../data/fetch_road_map.js";
import {
  clearDiversionMap,
  setPlannerMode,
  updateActiveDiversions
} from "./diversion_state.js";
import { resetDiversionUI } from "./create_diversion_route.js";
import { renderActiveDiversionsSidebar } from "./view_active_diversions.js";

export function attachDeleteEvents(map) {
  const deleteButtons = document.querySelectorAll('.js-delete-diversion');

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

        clearDiversionMap(map)

        //renderActiveDiversionsSidebar(map);

        updateActiveDiversions(updateDiversionCount);

        if(updateDiversionCount.length === 0) {
          setPlannerMode(true);

          resetDiversionUI(map);
        } else {
          renderActiveDiversionsSidebar(map);
        }

        alert("Diversion deleted successfully");
      } else {
        alert(result.message || "Failed to delete diversion.");
      }
    });
  });
}
