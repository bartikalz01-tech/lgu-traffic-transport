export const state = {
  selectedStart: null,
  selectedEnd: null,
  routeLine: null,
  activeSelectedRoute: null,
  activatedRouteIndex: null,
  plannerMode: true,
  activeDiversionPolyline: null,
  editingDiversionId: null,
  previewDiversionPolyline: null,
  generatedPreviewRoutes: [],
  startDiversionMarker: null,
  endDiversionMarker: null,
  originalDiversion: null
};

export function setPlannerMode(value) {
  state.plannerMode = value;
}

export function resetDiversionPlanner() {
  state.selectedStart = null;
  state.selectedEnd = null;
  state.activeSelectedRoute = null;
  state.activatedRouteIndex = null;
}

export function updateActiveDiversions(roads) {
  const activeDiversionRoads = roads;

  document.getElementById("activeDiversionCount").textContent = activeDiversionRoads.length;
}

export function clearDiversionMap(map) {

  if (state.activeDiversionPolyline) {
    map.removeLayer(state.activeDiversionPolyline);
    state.activeDiversionPolyline = null;
  }

  if (state.previewDiversionPolyline) {
    map.removeLayer(state.previewDiversionPolyline);
    state.previewDiversionPolyline = null;
  }

  if (state.startDiversionMarker) {
    map.removeLayer(state.startDiversionMarker);
    state.startDiversionMarker = null;
  }

  if (state.endDiversionMarker) {
    map.removeLayer(state.endDiversionMarker);
    state.endDiversionMarker = null;
  }
}

export function drawSimpleDiversionMarkers(map, points, routeConfig) {
  if(state.startDiversionMarker) {
    map.removeLayer(state.startDiversionMarker);
    state.startDiversionMarker = null;
  }

  if(state.endDiversionMarker) {
    map.removeLayer(state.endDiversionMarker);
    state.endDiversionMarker = null;
  }

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

    state.startDiversionMarker = L.marker(
      [startPoint.lat, startPoint.lng],
      {
        icon: startIcon
      }
    ).addTo(map);

    state.endDiversionMarker = L.marker(
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

    state.startDiversionMarker = L.marker(
      [startPoint.lat, startPoint.lng],
      { icon: pointIcon }
    ).addTo(map);

    state.endDiversionMarker = L.marker(
      [endPoint.lat, endPoint.lng],
      { icon: pointIcon }
    ).addTo(map);
  }

}

export function renderRouteSelectionSidebar() {

  return `
    <div class="planning-sidebar-header">
      <h3>Route Selection</h3>

      <button class="refresh-btn">
        <p>Refresh Points</p>
      </button>
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
