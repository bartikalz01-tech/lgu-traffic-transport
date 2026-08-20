import { renderPuvGroupMap } from "./puv_group_map.js";

export function renderPendingGroupDetails(container, group) {

  const locations = Array.isArray(group.locations) ? group.locations : [];

  const vehicleStaging = locations.find(location => location.location_type === "Vehicle Staging");

  const passengerLoading = locations.filter(location => location.location_type === "Passenger Loading");

  const meetingDate = formatMeetingDate(group.meeting_date);

  const meetingTime = formatMeetingTime(group.meeting_time);

  const meetingStatus = group.meeting_status || "Pending";

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
            ${escapeHtml(group.group_name)}
          </h2>


          <p class="puv-details-subtitle">
            ${escapeHtml(group.puv_type || "N/A")}
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
              ${escapeHtml(group.representative_name ||"N/A")}
            </strong>
          </div>

          <div class="puv-info-grid bottom-part">
            <div class="puv-info-item">
              <span class="puv-info-label">
                Contact Number
              </span>

              <strong>
                ${escapeHtml(group.contact_number ||"N/A")}
              </strong>
            </div>
            <div class="puv-info-item">
              <span class="puv-info-label">
                Meeting Date
              </span>

              <strong>
                ${escapeHtml(meetingDate)}
              </strong>
            </div>

            <div class="puv-info-item">
              <span class="puv-info-label">
                Meeting time
              </span>

              <strong>
                ${escapeHtml(meetingTime)}
              </strong>
            </div>

            <div class="puv-info-item">
              <span class="puv-info-label">
                Meeting Status
              </span>

              <strong>${escapeHtml(meetingStatus)}</strong>
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
                ${escapeHtml(group.clearance_status ||"N/A")}
              </strong>
            </div>
          </div>

          <div class="puv-clearance-details">
            <div class="puv-info-item">

              <span class="puv-info-label">
                Clearance Number
              </span>

              <strong>
                 ${escapeHtml(group.clearance_number ||"N/A")}
              </strong>

            </div>


            <div class="puv-info-item">

              <span class="puv-info-label">
                Valid Until
              </span>

              <strong>
                ${escapeHtml(group.expiration_date ||"N/A")}
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
            ${vehicleStaging ? `
              <strong>${escapeHtml(vehicleStaging.location_name)}</strong>  
            ` : `
              <button type="button" class="puv-location-action-btn" id="puvVehicleStaging">
                <i class="fas fa-location-dot"></i>
                Set Vehicle Staging
              </button>
            `}
          </div>


          <div class="puv-location-item">

            <span class="puv-info-label">
              Passenger Loading Area
            </span>

            ${passengerLoading.length > 0 ? `
              <strong>
                ${passengerLoading.length}
                loading area(s) configured
              </strong>
            ` : `
              <button type="button" class="puv-location-action-btn" id="puvPassengerLoading">
                <i class="fas fa-map-location-dot"></i>
                Set Loading Areas
              </button>
            `}
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

function formatMeetingDate(value) {

  if (!value) {
    return "Pending";
  }

  const date = new Date(value + "T00:00:00");

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function formatMeetingTime(value) {

  if (!value) {
    return "Pending";
  }

  const [hours, minutes] = value.split(":");

  const date = new Date();

  date.setHours(
    Number(hours),
    Number(minutes),
    0,
    0
  );

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });
}

function escapeHtml(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}