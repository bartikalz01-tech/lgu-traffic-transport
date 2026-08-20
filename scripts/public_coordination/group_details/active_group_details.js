import { renderPuvGroupMap } from "./puv_group_map.js";


export function renderActiveGroupDetails(container, group) {

  const locations = Array.isArray(group.locations) ? group.locations : [];

  const vehicleStaging = locations.find(location => location.location_type === "Vehicle Staging");

  const passengerLoading = locations.filter(location => location.location_type === "Passenger Loading");

  const vehicleStagingName = vehicleStaging?.location_name || "Not specified";

  const passengerLoadingName = passengerLoading.length > 0 
    ? passengerLoading.map(location => location.location_name).join(", ") : "Not Specified";

  const clearanceStatus = group.clearance_status || "Not Created";

  const clearanceNumber = group.clearance_number || "Pending";

  const expirationDate = group.expiration_date || "Pending";

  container.innerHTML = `
    <!-- HEADER -->
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
            ${escapeHtml(group.group_name)}
          </h2>

          <p class="puv-details-subtitle">
            ${escapeHtml(group.puv_type || "N/A")}
          </p>

        </div>

      </div>


      <div class="puv-details-status">
        <span class="ptc-status-badge active">
          Active
        </span>
      </div>

    </div>


    <!-- MAIN CONTENT -->
    <div class="puv-details-content">


      <!-- GROUP INFORMATION -->
      <section class="puv-details-card">

        <div class="puv-details-card-header">

          <div>
            <h3>
              <i class="fas fa-users"></i>
              Group Information
            </h3>

            <p>
              Basic information about the registered PUV group.
            </p>
          </div>

        </div>


        <div class="puv-info-grid">

          <div class="puv-info-item">

            <span class="puv-info-label">
              PUV Group
            </span>

            <strong>
              ${escapeHtml(group.group_name)}
            </strong>

          </div>


          <div class="puv-info-item">

            <span class="puv-info-label">
              Vehicle Type
            </span>

            <strong>
              ${escapeHtml(group.puv_type || "N/A")}
            </strong>

          </div>


          <div class="puv-info-item">

            <span class="puv-info-label">
              Representative
            </span>

            <strong>
              ${escapeHtml(group.representative_name || "N/A")}
            </strong>

          </div>


          <div class="puv-info-item">

            <span class="puv-info-label">
              Contact Number
            </span>

            <strong>
              ${escapeHtml(group.contact_number || "N/A")}
            </strong>

          </div>


          <div class="puv-info-item">

            <span class="puv-info-label">
              Destination Area
            </span>

            <strong>
              ${escapeHtml(group.destination_name || "N/A")}
            </strong>

          </div>


          <div class="puv-info-item">

            <span class="puv-info-label">
              Vehicle Staging
            </span>

            <strong>
              ${escapeHtml(vehicleStagingName || "N/A")}
            </strong>

          </div>

        </div>

      </section>



      <!-- CLEARANCE -->
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

            <div class="puv-clearance-icon">
              <i class="fas fa-check"></i>
            </div>

            <div>

              <span class="puv-info-label">
                Clearance Status
              </span>

              <strong class="puv-clearance-approved">
                ${escapeHtml(clearanceStatus)}
              </strong>

            </div>

          </div>


          <div class="puv-clearance-details">

            <div class="puv-info-item">

              <span class="puv-info-label">
                Clearance Number
              </span>

              <strong>
                ${escapeHtml(clearanceNumber)}
              </strong>

            </div>


            <div class="puv-info-item">

              <span class="puv-info-label">
                Valid Until
              </span>

              <strong>
                ${escapeHtml(clearanceNumber)}
              </strong>

            </div>

          </div>


          <div class="puv-clearance-actions">

            <button
              type="button"
              class="ptc-secondary-btn"
            >
              <i class="fas fa-file-lines"></i>
              View Clearance
            </button>


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



      <!-- MAP -->
      <section class="puv-details-card puv-location-card">

        <div class="puv-details-card-header">

          <div>

            <h3>
              <i class="fas fa-map-location-dot"></i>
              Authorized Locations
            </h3>

            <p>
              Official vehicle staging and passenger loading areas.
            </p>

          </div>

        </div>


        <div class="puv-map-container" id="puvGroupMap">

          <!--<div class="puv-map-placeholder">

            <i class="fas fa-map"></i>

            <span>
              Map will be displayed here
            </span>

            <small>
              Vehicle and passenger loading locations
            </small>

          </div>-->

        </div>


        <!-- MAP LEGEND -->
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


        <!-- LOCATION DETAILS -->
        <div class="puv-location-details">

          <div class="puv-location-item">

            <span class="puv-info-label">
              Official Vehicle Location
            </span>

            <strong>
              ${escapeHtml(vehicleStagingName?.road_id || "")}
            </strong>

            <span class="puv-location-address">
              ${escapeHtml(vehicleStagingName)}
            </span>

          </div>


          <div class="puv-location-item">

            <span class="puv-info-label">
              Passenger Loading Area
            </span>

            <strong>
              ${escapeHtml(passengerLoadingName)}
            </strong>

            <span class="puv-location-address">
              Designated passenger loading zone
            </span>

          </div>

        </div>

      </section>
    </div>

    <!-- FOOTER -->
    <div class="puv-details-footer">

      <span>
        PUV Group Record
      </span>

      <button
        type="button"
        class="ptc-cancel-btn"
        id="closePuvGroupDetailsFooter"
      >
        <i class="fas fa-xmark"></i>
        Close
      </button>

    </div>
  `;

  const mapContainer = container.querySelector("#puvGroupMap");

  renderPuvGroupMap(mapContainer);
}

function escapeHtml(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}