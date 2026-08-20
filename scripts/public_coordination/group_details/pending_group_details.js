export function renderPendingGroupDetails(container) {
  container.innerHTML = `
    <div class="puv-details-header">
      <div class="puv-details-header-left">
        <button
          type="button"
          class="puv-details-back-btn"
          id="closePuvGroupDetails"
          title="Close"
        >
          <i class="fas fa-arrow-left"></i>
        </button>
        <div>
          <span class="puv-details-module-label">
            PUBLIC TRANSPORT COORDINATION
          </span>

          <h2 class="puv-details-title">
            Mabini TODA
          </h2>


          <p class="puv-details-subtitle">
            Tricycle / TODA
          </p>
        </div>
      </div>

      <div class="puv-details-status">
        <span class="ptc-status-badge pending">
          Pending
        </span>
      </div>
    </div>

    <div class="puv-details-content">
      <section class="puv-details-card">
        <div class="puv-details-card-header">
          <div>
            <h3><i class="fas fa-users"></i> Group Information</h3>
          </div>
        </div>

        <div class="puv-info-grid">
          <div class="puv-info-item">

            <span class="puv-info-label">
              PUV Group
            </span>

            <strong>
              Mabini TODA
            </strong>

          </div>


          <div class="puv-info-item">

            <span class="puv-info-label">
              Vehicle Type
            </span>

            <strong>
              Tricycle
            </strong>

          </div>

          <div class="puv-info-item">
            <span class="puv-info-label">
              Representative
            </span>

            <strong>
              Juan Dela Cruz
            </strong>
          </div>
          <div class="puv-info-grid bottom-part">
            <div class="puv-info-item">
              <span class="puv-info-label">
                Contact Number
              </span>

              <strong>
                0917 123 4567
              </strong>
            </div>
            <div class="puv-info-item">
              <span class="puv-info-label">
                Meeting Date
              </span>

              <strong>
                Jan 1, 2026
              </strong>
            </div>

            <div class="puv-info-item">
              <span class="puv-info-label">
                Meeting time
              </span>

              <strong>
                12:00 pm
              </strong>
            </div>

            <div class="puv-info-item">
              <span class="puv-info-label">
                Meeting Status
              </span>

              <strong>Scheduled</strong>
            </div>
          </div>
        </div>
      </section>

      <section class="puv-details-card">
        <div class="puv-details-card-header">
          <div>
            <h3>
              <i class="fas fa-file-circle-check"></i>
              Barangay Clearance
            </h3>

            <p>
              Barangay authorization status of this PUV group.
            </p>
          </div>
        </div>

        <div class="puv-clearance-content">
          <div class="puv-clearance-status">
            <div class="puv-clearance-icon not-created">
              <i class="fas fa-file-circle-exclamation"></i>
            </div>

            <div>
              <span class="puv-info-label">
                Clearance Status
              </span>

              <strong class="puv-clearance-not-created">
                Not Created
              </strong>
            </div>
          </div>

          <div class="puv-clearance-details">
            <div class="puv-info-item">

              <span class="puv-info-label">
                Clearance Number
              </span>

              <strong>
                Pending
              </strong>

            </div>


            <div class="puv-info-item">

              <span class="puv-info-label">
                Valid Until
              </span>

              <strong>
                Pending
              </strong>

            </div>
          </div>

          <div class="puv-clearance-actions">
            <button
              type="button"
              class="ptc-primary-btn"
            >
              <i class="fas fa-plus"></i>
              Create Clearance
            </button>
          </div>
        </div>
      </section>

      <section class="puv-details-card puv-location-card">
        <div class="puv-details-card-header">
          <div>
            <h3>
              <i class="fas fa-map-location-dot"></i>
              Authorize Locations
            </h3>
            <p>
              Set authorize locations around barangay.
            </p>
          </div>
        </div>

        <div class="puv-map-container" id="puvGroupMap">

          <div class="puv-map-placeholder">

            <i class="fas fa-map"></i>

            <span>
              Map will be displayed here
            </span>

            <small>
              Vehicle and passenger loading locations
            </small>

          </div>
        </div>

        <div class="puv-map-legend">

          <div class="puv-map-legend-item">

            <span class="puv-map-marker vehicle">
              <i class="fas fa-location-dot"></i>
            </span>

            <span>
              Official Vehicle Location
            </span>

          </div>


          <div class="puv-map-legend-item">

            <span class="puv-map-marker loading">
              <i class="fas fa-square"></i>
            </span>

            <span>
              Passenger Loading Area
            </span>

          </div>

        </div>

        <div class="puv-location-details">

          <div class="puv-location-item">

            <span class="puv-info-label">
              Official Vehicle Location
            </span>

            <button type="button" class="puv-location-action-btn" id="puvVehicleStaging">
              <i class="fas fa-location-dot"></i>
              Set Vehicle Staging
            </button>
          </div>


          <div class="puv-location-item">

            <span class="puv-info-label">
              Passenger Loading Area
            </span>

            <button type="button" class="puv-location-action-btn" id="puvPassengerLoading">
              <i class="fas fa-map-location-dot"></i>
              Set Loading Areas
            </button>
          </div>
        </div>
      </section>
    </div>
  `;
}