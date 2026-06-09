export async function renderAddCurrentRoute(container, puvGroupId, puvGroupName) {
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
        <span class="field-value-highlight" id="targetGroupName">Test</span>
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

    <div class="reference-cards-container">
      
      <div class="ref-mini-card">
        <div class="ref-card-meta">
          <span class="ref-badge green">Option 1</span>
          <span class="ref-metric">+3 mins</span>
        </div>
        <h6>Via Sampaguita St. Shortcut</h6>
        <p>Bypasses main avenue intersection block. Uses minor residential street outlet</p>
      </div>

      <div class="ref-mini-card">
        <div class="ref-card-meta">
          <span class="ref-badge orange">Option 2</span>
          <span class="ref-metric">+6 mins</span>
        </div>
        <h6>Barangay Hall Perimeter Loop</h6>
        <p>Redirects traffic through well-lit alternative boulevard. Avoids narrow corridors.</p>
      </div>

      <div class="ref-mini-card restricted">
        <div class="ref-card-meta">
          <span class="ref-badge red">Option 3</span>
          <span class="ref-metric text-danger">Narrow</span>
        </div>
        <h6>Back-Alley Outflow Corridor</h6>
        <p>Tight clearances. Not recommended for full-size commuter modern jeeps.</p>
      </div>

      <div class="ref-mini-card">
        <div class="ref-card-meta">
          <span class="ref-badge gray">Option 4</span>
          <span class="ref-metric">+8 mins</span>
        </div>
        <h6>Boundary Road Intersect</h6>
        <p>Exits early into the adjacent neighboring barangay roadway system.</p>
      </div>

      <div class="ref-mini-card">
        <div class="ref-card-meta">
          <span class="ref-badge gray">Option 5</span>
          <span class="ref-metric">+5 mins</span>
        </div>
        <h6>School Zone Bypass System</h6>
        <p>Utilizes school service access roads. Best applied only during non-school hours.</p>
      </div>

    </div>

    <div class="add-route-actions-footer">
      <button class="btn-save-baseline-route" id="btnSaveBaselineRoute">
        <i class="fas fa-check"></i> Save Default Route
      </button>
    </div>
  `;
}