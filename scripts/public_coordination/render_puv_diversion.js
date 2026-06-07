import { initMap } from "../utils/traffic_and_events.js";

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
          <div class="section-badge">Current Status</div>
          <div class="puv-group-selector-row">
            <label for="puvGroupSelect">Select PUV Group:</label>
            <select id="puvGroupSelect" class="form-select-custom">
              <option value="group1">PUV Group 1</option>
              <option value="group2">PUV Group 2</option>
              <option value="group3">PUV Group 3</option>
            </select>
          </div>

          <div class="route-meta-card">
            <div class="meta-item">
              <span class="meta-label">Primary Barangay Exit:</span>
              <span class="meta-value text-dark fw-bold">Dahlia St. Main Gate</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Est. Baseline Loop Time:</span>
              <span class="meta-value text-dark">14 mins</span>
            </div>
          </div>
        </div>

        <div class="diversion-routes-heading">
          <h4><i class="fas fa-directions"></i> Local Diversion Options (5 Suggestions)</h4>
          <p>Select a route suggestion block to map coordinates or review narrow street limits.</p>
        </div>

        <div class="diversion-routes-container">
          <div class="diversion-card active-suggestion">
            <div class="div-card-header">
              <span class="badge badge-success">Option 1 (Optimal)</span>
              <span class="exit-counter"><i class="fas fa-door-open"></i> 2 Local Exits</span>
            </div>
            <h5>Via Sampaguita St. Shortcut</h5>
            <p class="div-card-desc">Bypasses main avenue intersection block. Uses minor residential street outlet</p>
            <div class="div-card-footer">
              <span>Est: <strong>+3 mins</strong></span>
              <button class="btn-preview-route active">Active on Map</button>
            </div>
          </div>

          <div class="diversion-card">
            <div class="div-card-header">
              <span class="badge badge-warning">Option 2 (Secondary)</span>
              <span class="exit-counter"><i class="fas fa-door-open"></i> 1 Exit Used</span>
            </div>
            <h5>Barangay Hall Perimeter Loop</h5>
            <p class="div-card-desc">Redirects traffic through well-lit alternative boulevard. Avoids narrow corridors.</p>
            <div class="div-card-footer">
              <span>Est: <strong>+6 mins</strong></span>
              <button class="btn-preview-route">Preview Route</button>
            </div>
          </div>

          <div class="diversion-card disabled-card">
            <div class="div-card-header">
              <span class="badge badge-danger">Option 3 (High-Load)</span>
              <span class="exit-counter text-danger"><i class="fas fa-exclamation-triangle"></i> Narrow Exit</span>
            </div>
            <h5>Back-Alley Outflow Corridor</h5>
            <p class="div-card-desc">Tight clearances. Not recommended for full-size commuter modern jeeps.</p>
            <div class="div-card-footer">
              <span>Est: <strong>+11 mins</strong></span>
              <button class="btn-preview-route">Preview Route</button>
            </div>
          </div>

          <div class="diversion-card">
            <div class="div-card-header">
              <span class="badge badge-neutral">Option 4</span>
              <span class="exit-counter"><i class="fas fa-door-open"></i> 3 Exits Used</span>
            </div>
            <h5>Boundary Road Intersect</h5>
            <p class="div-card-desc">Exits early into the adjacent neighboring barangay roadway system.</p>
            <div class="div-card-footer">
              <span>Est: <strong>+8 mins</strong></span>
              <button class="btn-preview-route">Preview Route</button>
            </div>
          </div>

          <div class="diversion-card">
            <div class="div-card-header">
              <span class="badge badge-neutral">Option 5</span>
              <span class="exit-counter"><i class="fas fa-door-open"></i> 2 Exits Used</span>
            </div>
            <h5>School Zone Bypass System</h5>
            <p class="div-card-desc">Utilizes school service access roads. Best applied only during non-school hours.</p>
            <div class="div-card-footer">
              <span>Est: <strong>+5 mins</strong></span>
              <button class="btn-preview-route">Preview Route</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;

  const puvAlternateRoute = initMap("puvDiversionMap");
}