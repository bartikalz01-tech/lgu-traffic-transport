export function renderPuvSummaryCards(container) {

  container.innerHTML = `
    <div class="ptc-summary-grid">

      <div class="ptc-summary-card">
        <div class="ptc-summary-icon">
          <i class="fas fa-users"></i>
        </div>

        <div>
          <span class="ptc-summary-label">
            Registered PUV Groups
          </span>

          <strong
            class="ptc-summary-value"
            id="registeredPuvGroups"
          >
            0
          </strong>
        </div>
      </div>


      <div class="ptc-summary-card">
        <div class="ptc-summary-icon active">
          <i class="fas fa-check-circle"></i>
        </div>

        <div>
          <span class="ptc-summary-label">
            Active Groups
          </span>

          <strong
            class="ptc-summary-value"
            id="activePuvGroups"
          >
            0
          </strong>
        </div>
      </div>


      <div class="ptc-summary-card">
        <div class="ptc-summary-icon pending">
          <i class="fas fa-clock"></i>
        </div>

        <div>
          <span class="ptc-summary-label">
            Pending Coordination
          </span>

          <strong
            class="ptc-summary-value"
            id="pendingPuvGroups"
          >
            0
          </strong>
        </div>
      </div>


      <div class="ptc-summary-card">
        <div class="ptc-summary-icon location">
          <i class="fas fa-location-dot"></i>
        </div>

        <div>
          <span class="ptc-summary-label">
            Registered Locations
          </span>

          <strong
            class="ptc-summary-value"
            id="registeredPuvLocations"
          >
            0
          </strong>
        </div>
      </div>

    </div>
  `;

}