import { subscribeViolations } from "../data/violation_report/violationStore.js"
import { renderViolationDetailModal } from "./detailed_violation.js";

export function renderViolationReportsPanel(container) {

  container.innerHTML = `
    <div class="violation-panel-header">
      <div>
        <h2>Violation Reports</h2>
        <p>Review and manage reported traffic and transport violations</p>
      </div>
    </div>

    <div class="violation-filters">
      <div class="violation-search">
        <i class="fas fa-search"></i>
        <input type="text" id="violationSearchInput" placeholder="Search violation reports..." />
      </div>

      <div class="violation-filter-group">
        <select id="violationStatusFilter">
          <option value="">All Status</option>
          <option value="Pending Review">Pending Review</option>
          <option value="Verified">Verified</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div class="violation-filter-group">
        <select id="violationTypeFilter">
          <option value="">All Violation Types</option>
          <option value="Illegal Parking">Illegal Parking</option>
          <option value="Road Obstruction">Road Obstruction</option>
          <option value="Route Violation">Route Violation</option>
        </select>
      </div>

      <div class="violation-filter-group">
        <input type="date" id="violationDateFilter" title="Filter by date" />
      </div>
    </div>

    <div class="violation-table-wrapper">
      <table class="violation-table">
        <thead>
          <tr>
            <th>Violation ID</th>
            <th>Violation Type</th>
            <td>Road / Street</td>
            <th>Date & Time</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody id="violationTbody"></tbody>
      </table>
    </div>

    <div class="violation-table-footer">
      <span id="violationTableCount"></span>

      <div class="violation-pagination" id="violationPagination"></div>
    </div>

    <div class="detailed-reports-overlay detailed-reports-hidden" id="detailViolationContainer"></div>
  `

  const tbody = container.querySelector("#violationTbody");
  const tableCount = container.querySelector("#violationTableCount");
  const pagination = container.querySelector("#violationPagination");
  const searchInput = container.querySelector("#violationSearchInput")
  const statusFilter = container.querySelector("#violationStatusFilter");
  const typeFilter = container.querySelector("#violationTypeFilter");
  const dateFilter = container.querySelector("#violationDateFilter");

  const violationModalContainer = container.querySelector("#detailViolationContainer");

  const ITEMS_PER_PAGE = 5;

  let currentPage = 1;

  let violationDetails = [];

  function getStatusClass(status) {
    switch(String(status ?? "").trim()) {
      case "Pending Review":
        return {
          className: "pending",
          icon: "fas fa-clock"
        };

      case "Verified":
        return {
          className: "verified",
          icon: "fas fa-circle-check"
        };

      case "Rejected":
        return { 
          className: "rejected",
          icon: "fas fa-circle-xmark"
        };

      default:
        return {
          className: "",
          icon: "fa-circle-question"
        };
    }
  }

  function getViolationTypeClass(type) {
    switch (String(type ?? "").trim()) {

      case "Illegal Parking":
        return "parking";

      case "Road Obstruction":
        return "obstruction";

      case "Route Violation":
        return "route";

      default:
        return "";
    }
  }

  function renderTable(violations) {
    tbody.innerHTML = "";

    const totalViolations = violations.length;

    const totalPages = Math.ceil(totalViolations / ITEMS_PER_PAGE);

    if(totalPages > 0 && currentPage > totalPages) {
      currentPage = totalPages;
    }

    if(totalViolations === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="violation-empty-state">
            <div>
              <i class="fas fa-search"></i>
              <h3>No Violation reports found</h3>
              <p>Try changing your search or filter criteria</p>
            </div>
          </td>
        </tr>
      `;

      tableCount.innerHTML = `Showing <strong>0</strong> violation reports`;

      pagination.innerHTML = "";

      return;
    }

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex =Math.min(startIndex + ITEMS_PER_PAGE, totalViolations);

    const paginatedViolations = violations.slice(startIndex, endIndex);

    paginatedViolations.forEach(violation => {
      const statusConfig = getStatusClass(violation.status);

      const typeClass = getViolationTypeClass(violation.violation_type);

      const dateTime = violation.violation_datetime ? new Date(violation.violation_datetime) : null;

      const dateText = dateTime ? dateTime.toLocaleDateString("en-us", {
        year: "numeric",
        month: "short",
        day: "numeric"
      }) : "-";

      const timeText = dateTime ? dateTime.toLocaleTimeString("en-us", {
        hour: "numeric",
        minute: "2-digit"
      }) : "-";

      tbody.insertAdjacentHTML("beforeend", `
        <tr>
          <td>
            <span class="violation-public-id">
              ${violation.public_violation_id}
            </span>
          </td>
          <td>
            <span class="violation-type-badge ${typeClass}">
              ${violation.violation_type}
            </span>
          </td>
          <td>
            <div class="violation-road-cell">
              <i class="fas fa-road"></i>
              <span>${violation.road_name ?? "-"}</span>
            </div>
          </td>
          <td>
            <div class="violation-datetime">
              <strong>${dateText}</strong>
              <small>${timeText}</small>
            </div>
          </td>
          <td>
            <span class="violation-status ${statusConfig.className}">
              <i class="fas ${statusConfig.icon}"></i>
              ${violation.status ?? "-"}
            </span>
          </td>
          <td>
            <button type="button" class="violation-action-btn" title="View Report" data-violation-id=${violation.violation_report_id}>
              <i class="fas fa-eye"></i>
            </button>
          </td>
        </tr>
      `);
    });

    tableCount.innerHTML = `
      Showing <strong>${startIndex + 1}-${endIndex}</strong>
      of
      <strong>${totalViolations}</strong>
      violation reports
    `;

    renderPagination(totalPages);

    const violationViewDetailBtn = tbody.querySelectorAll(".violation-action-btn");

    violationViewDetailBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        const selectedViolation = violationDetails.find(
          violation => String(violation.violation_report_id) == String(btn.dataset.violationId) 
        );

        renderViolationDetailModal(violationModalContainer)
      });
    });

  }

  function renderPagination(totalPages) {
    pagination.innerHTML = "";

    if(totalPages <= 1) {
      return;
    }

    const previousButton = document.createElement("button");

    previousButton.innerHTML = `<i class="fas fa-chevron-left"></i>`

    previousButton.disabled = currentPage === 1;

    previousButton.addEventListener("click", () => {
      if(currentPage > 1) {
        currentPage--;

        applyFilters();
      }
    });

    pagination.appendChild(previousButton);

    for(let page = 1; page <= totalPages; page++) {
      const pageButton = document.createElement("button");

      pageButton.textContent = page;

      if(page === currentPage) {
        pageButton.classList.add("active");
      }

      pageButton.addEventListener("click", () => {
        currentPage = page;
        applyFilters();
      });

      pagination.appendChild(pageButton);
    }

    const nextButton = document.createElement("button");

    nextButton.innerHTML = `<i class="fas fa-chevron-right"></i>`;

    nextButton.disabled = currentPage === totalPages;

    nextButton.addEventListener("click", () => {
      if(currentPage < totalPages) {

        currentPage++;
        applyFilters();

      }

    });

    pagination.appendChild(nextButton);
  }

  function applyFilters() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    const selectedStatus = statusFilter.value.trim().toLowerCase();

    const selectedType = typeFilter.value.trim().toLowerCase();

    const selectedDate = dateFilter.value;

    const filteredViolations = violationDetails.filter(violation => {
      const publicId = String(violation.public_violation_id ?? "").toLowerCase();

      const roadName = String(violation.road_name ?? "").toLowerCase();

      const location = String(violation.location_details).toLowerCase();

      const plateNumber = String(violation.plate_number ?? "").toLowerCase();

      const violationType =String(violation.violation_type ?? "").toLowerCase();

      const status =String(violation.status ?? "").toLowerCase();

      const matchesSearch = 
        !searchTerm ||
        roadName.includes(searchTerm) ||
        location.includes(searchTerm) ||
        plateNumber.includes(searchTerm) ||
        violationType.includes(searchTerm) ||
        status.includes(searchTerm);

      const matchesStatus = !selectedStatus || status === selectedStatus;

      const matchesType = !selectedType || violationType === selectedType;

      const violationDate = String(violation.violation_datetime ?? "").substring(0, 10);

      const matchesDate = !selectedDate || violationDate === selectedDate;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesDate
      );

    });

    renderTable(filteredViolations)

  }

  subscribeViolations(violations => {
    violationDetails = Array.isArray(violations) ? violations : [];

    applyFilters();
  });

  searchInput.addEventListener("input", () => {
    currentPage = 1;

    applyFilters();
  });

  statusFilter.addEventListener("change", () => {

    currentPage = 1;

    applyFilters();

  });

  typeFilter.addEventListener("change", () => {

    currentPage = 1;

    applyFilters();

  });

  dateFilter.addEventListener("change", () => {

    currentPage = 1;

    applyFilters();

  });

}