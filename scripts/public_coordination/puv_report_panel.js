import { puvGroupDetails } from "./puv_group_details.js";

export function renderPuvReportPanel(container, puvGroups) {

  container.innerHTML = `
    <div class="ptc-content-card">

      <div class="ptc-content-header">

        <div>
          <h3>
            <i class="fas fa-bus"></i>
            PUV Groups
          </h3>

          <p>
            Public transport groups currently recorded
            by the barangay.
          </p>
        </div>

        <div class="ptc-table-actions">
          <div class="ptc-search-box">

            <i class="fas fa-search"></i>

            <input
              type="text"
              id="ptcSearchInput"
              placeholder="Search PUV groups..."
            >

          </div>
        </div>

      </div>


      <div class="ptc-table-wrapper">

        <table class="ptc-table">

          <thead>
            <tr>
              <th>PUV Group</th>
              <th>PUV Type</th>
              <th>Representative</th>
              <th>Contact</th>
              <th>Vehicle Staging</th>
              <th>Passenger Loading Locations</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody id="ptcGroupsTableBody">

            <tr>
              <td colspan="8" class="ptc-loading-row">
                <i class="fas fa-spinner fa-spin"></i>
                Loading PUV groups...
              </td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>

    <div id="puvGroupDetailsModal" class="puv-group-detail-modal detail-hidden"></div>
  `;


  const searchInput = container.querySelector("#ptcSearchInput");

  const puvGroupDetailsModal = container.querySelector("#puvGroupDetailsModal")
  //const puvGroupDetailsBtn = container.querySelectorAll("#viewPuvGroupBtn");

  const tableBody = container.querySelector("#ptcGroupsTableBody");

  if(!puvGroups || puvGroups.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="8" class="ptc-empty-row">
          <i class="fas fa-bus"></i>
          <span>No PUV groups found.</span>
        </td>
      </tr>
    `;

    return;
  }

  tableBody.innerHTML = puvGroups.map(group => renderPuvGroupRow(group)).join("");

  searchInput.addEventListener(
    "input",
    event => {

      const searchTerm =
        event.target.value
          .toLowerCase()
          .trim();


      const rows = tableBody.querySelectorAll("tr");

      rows.forEach(row => {

        const text =
          row.textContent.toLowerCase();

        row.style.display =
          text.includes(searchTerm)
            ? ""
            : "none";

      });

    }
  );

  tableBody.addEventListener("click", event => {
    const button = event.target.closest(".view-puv-group-btn");

    if(!button) {
      return;
    }

    const puvGroupId = button.dataset.puvGroupId;

    const group = puvGroups.find(item => String(item.puv_group_id) === String(puvGroupId));

    if(!group) {
      console.error("PUV group not found:", puvGroupId);

      return;
    }

    puvGroupDetailsModal.classList.remove("detail-hidden");

    puvGroupDetails(puvGroupDetailsModal, group)
  });

}

function renderPuvGroupRow(group) {
  const locations = Array.isArray(group.locations) ? group.locations : [];

  const vehicleStaging = locations.filter(location => location.location_type === "Vehicle Staging");

  const passengerLoading = locations.filter(location => location.location_type === "Passenger Loading");

  let vehicleStagingDisplay = "Pending";

  if (vehicleStaging.length > 0) {
    vehicleStagingDisplay = vehicleStaging.map(location => location.location_name).join(", ");
  }

  let passengerLoadingDisplay = "Pending";

  if (passengerLoading.length > 0) {
    passengerLoadingDisplay = passengerLoading.length;
  }

  const status = group.status || "Pending";

  const statusClass = getStatusClass(status);

  return `
    <tr data-puv-group-id="${escapeHtml(group.puv_group_id)}">
      <td>
        <strong>
          ${escapeHtml(group.group_name)}
        </strong>
      </td>

      <td>
        ${escapeHtml(group.puv_type || "N/A")}
      </td>

      <td>
        ${escapeHtml(group.representative_name || "N/A")}
      </td>

      <td>
        ${escapeHtml(group.contact_number || "N/A")}
      </td>

      <td>
        ${escapeHtml(vehicleStagingDisplay)}
      </td>

      <td>
        ${escapeHtml(passengerLoadingDisplay)}
      </td>

      <td>
        <span class="ptc-status-badge ${statusClass}">
          ${escapeHtml(status)}
        </span>
      </td>

      <td>
        <button
          type="button"
          class="ptc-action-btn view-puv-group-btn"
          title="View Details"
          data-puv-group-id="${escapeHtml(group.puv_group_id)}"
        >
          <i class="fas fa-eye"></i>
        </button>
      </td>
    </tr>
  `;
}

function getStatusClass(status) {

  switch (status) {

    case "Active":
      return "active";

    case "Pending":
      return "pending";

    case "Inactive":
      return "inactive";

    case "Rejected":
      return "rejected";

    default:
      return "pending";

  }

}

function escapeHtml(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}