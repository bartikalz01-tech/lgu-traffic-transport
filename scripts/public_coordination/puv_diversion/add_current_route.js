import { getRouteSuggestions } from "../../data/fetch_public_group_trans.js";

let puvMarker = null;

export async function renderAddCurrentRoute(container, selectedGroup, map, onCancel) {

  const {
    puv_group_id,
    puv_group_name,
    latitude,
    longitude,
  } = selectedGroup;

  container.innerHTML = `
    <div class="add-route-form-card">
      <div class="form-card-header">
        <div class="section-badge-alt">Baseline Properties</div>
        <button class="btn-cancel-action" id="btnCancelAddRoute">
          <i class="fas fa-times"></i> Cancel
        </button>
      </div>

      <div class="form-static-group">
        <span class="field-label">Target PUV Fleet Group:</span>
        <span class="field-value-highlight" id="targetGroupName">
          ${puv_group_name}
        </span>
      </div>

      <div class="form-input-group">
        <label for="puvDestinationInput">Define Primary Target Destination:</label>
        <div class="input-with-icon">
          <i class="fas fa-flag-checkered"></i>
          <input 
            type="text" 
            id="puvDestinationInput" 
            class="form-input-custom" 
            placeholder="e.g., Barangay Hall Main Exit / Gate 3..."
          />
        </div>
      </div>
    </div>

    <div class="reference-routes-heading">
      <h4><i class="fas fa-info-circle"></i> Neighborhood Reference Options</h4>
      <p>Review the standard 5 alternate corridors to ensure the new default path optimizes traffic flow.</p>
    </div>

    <div class="reference-cards-container" id="routeSuggestionsContainer">
      <div class="route-placeholder-state">
        <div class="placeholder-icon-wrap">
          <i class="fas fa-search-location"></i>
        </div>
        <h6>No Target Destination Set</h6>
        <p>Please enter a destination avenue or landmark above and press <strong>Enter</strong> to see reference options.</p>
      </div>
    </div>

    <div class="add-route-actions-footer">
      <button class="btn-save-baseline-route" id="btnSaveBaselineRoute">
        <i class="fas fa-check"></i> Save Default Route
      </button>
    </div>
  `;

  map.setView(
    [latitude, longitude], 18
  );

  if(puvMarker) {
    map.removeLayer(puvMarker);
  }

  puvMarker = L.marker([
    latitude,
    longitude
  ]).addTo(map)
    .bindPopup(`<b>${puv_group_name}</b>`)
    .openPopup();

  
  const destinationInput = document.getElementById("puvDestinationInput");
  const routeSuggestionsContainer = document.getElementById("routeSuggestionsContainer");

  destinationInput.addEventListener("keydown", async (event) => {
    if(event.key !== "Enter") {
      return;
    } 

    const destination = destinationInput.value.trim();
    if(!destination) return;

    routeSuggestionsContainer.innerHTML = `
      <div class="route-loading-state">
        <div class="spinner-element"></div>
        <p>Analyzing optimal neighborhood corridors for <strong>${destination}</strong>...</p>
      </div>
    `;

    try {
      const result = await getRouteSuggestions({
        latitude: latitude,
        longitude: longitude,
        destination: destination
      });
      
      if(result.status !== "success" || !result.routes || result.routes.length === 0) {
        routeSuggestionsContainer.innerHTML = `
          <div class="route-placeholder-state">
            <div class="placeholder-icon-wrap alert-mode">
              <i class="fas fa-exclamation-circle"></i>
            </div>
            <h6>No Routes Found</h6>
            <p>Could not calculate trajectories for this terminal zone point. Try checking the spelling.</p>
          </div>
        `;
        return;
      }

      routeSuggestionsContainer.innerHTML = result.routes.map((route, index) => `
        <div class="ref-mini-card" data-index="${index}">
          <div class="ref-card-meta">
            <span class="ref-badge green">Option ${index + 1}</span>
            <span class="ref-metric">+3 mins</span>
          </div>
          <h6>${route.exit_name}</h6>
          <p>${route.description}</p>
        </div>
      `).join("");

    } catch(error) {
      console.error("Error fetching path suggestions: ", error);
      routeSuggestionsContainer.innerHTML = `
        <div class="route-placeholder-state">
          <div class="placeholder-icon-wrap alert-mode">
            <i class="fas fa-wifi"></i>
          </div>
          <h6>Network Exception</h6>
          <p>Failed to communicate with the routing pipeline engine. Please try again.</p>
        </div>
      `;
    }

  });
  

  document.getElementById("btnSaveBaselineRoute").addEventListener("click", async () => {
    console.log(puvGroupId);
  });



  document.getElementById("btnCancelAddRoute").addEventListener("click", () => {
    if(puvMarker) {
      map.removeLayer(puvMarker);
      puvMarker = null;
    }

    if(routePolyLine) {
      map.removeLayer(routePolyLine);
      routePolyLine = null;
    }

    onCancel();
  });
}