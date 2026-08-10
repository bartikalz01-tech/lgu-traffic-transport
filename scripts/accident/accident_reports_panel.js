import { detailedAccidentReport } from "./detailed_accident.js";

export async function renderAccidentReportsPanel(container, accidentDetails) {

  container.innerHTML = `
    <div class="accident-panel-header">
      <div>
        <h2>Accident Reports</h2>
        <p>Monitor and manage reported traffic accidents.</p>
      </div>

      <button class="accident-refresh-btn">
        <i class="fas fa-sync-alt"></i>
        Refresh
      </button>
    </div>

    <div class="accident-toolbar">
      <div class="accident-search-box">
        <i class="fas fa-search"></i>
        <input type="text" id="accidentSearchInput" placeholder="Search accident ID, road, or location..." autocomplete="off">
      </div>

      <div class="accident-date-filter">
        <label for="accidentFromDate">From</label>
        <input type="date" id="accidentFromDate">
      </div>

      <div class="accident-date-filter">
        <label for="accidentToDate">To</label>
        <input type="date" id="accidentToDate">
      </div>

      <button type="button" class="accident-filter-btn" id="accidentFilterBtn">
        <i class=fas fa-filter></i>
        Filter
      </button>

    </div>

    <div class="accident-table-wrapper">
      <table class="accident-table">
        <thead>
          <th>Public Accident ID</th>
          <th>Road / Street</th>
          <th>Date & Time</th>
          <th>Accident Type</th>
          <th>Location</th>
          <th>Status</th>
          <th>Action</th>
        </thead>

        <tbody id="accidentTbody"></tbody>
      </table>
    </div>

    <div class="accident-table-footer">
      <span id="accidentTableCount"></span>

      <div class="accident-pagination" id="accidentPagination"></div>
    </div>

    <div class="detailed-reports-overlay detailed-reports-hidden" id="detailAccidentContainer"></div>
  `;

  const accidentTbody = document.getElementById("accidentTbody");
  const detailAccidentContainer = document.getElementById("detailAccidentContainer");

  const searchInput = container.querySelector("#accidentSearchInput");
  const tableCount = container.querySelector("#accidentTableCount");

  const fromDateInput = container.querySelector("#accidentFromDate");
  const toDateInput = container.querySelector("#accidentToDate");
  const filterBtn = container.querySelector("#accidentFilterBtn");

  const pagination = container.querySelector("#accidentPagination");
  const ITEMS_PER_PAGE = 5;
  let currentPage = 1;

  function renderTable(accidents) {
    accidentTbody.innerHTML = "";

    const totalAccidents = accidents.length;
    const totalPages = Math.ceil(totalAccidents / ITEMS_PER_PAGE);

    if(currentPage > totalPages && totalPages > 0) {
      currentPage = totalPages;
    }

    if(totalAccidents === 0) {
      accidentTbody.innerHTML = `
        <tr>
          <td colspan="7" class="accident-empty-state">
            <div>
              <i class="fas fa-search"></i>
              <h3>No Accident reports found</h3>
              <p>Try searching with a different accident ID, road, or location</p>
            </div>
          </td>
        </tr>
      `;

      tableCount.innerHTML = `
        Showing <strong>0</strong> accident reports
      `;

      renderPagination(0);

      return;
    }

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalAccidents);

    const paginatedAccidents = accidents.slice(startIndex, endIndex);

    paginatedAccidents.forEach(accident => {
      let statusClass = null;
      const status = accident.status;


      if (status === "Reported") {
        statusClass = "reported";
      }
      else if (status === "Dispatched") {
        statusClass = "dispatched";
      }
      else if (status === "On Scene") {
        statusClass = "on-scene";
      }
      else if (status === "Cleared") {
        statusClass = "cleared";
      }

      accidentTbody.innerHTML += `
        <tr>
          <td>
            <span class="accident-public-id">${accident.public_accident_id}</span>
          </td>
          <td>
            <div class="road-cell">
              <i class="fas fa-road"></i>
              <span>${accident.road_name}</span>
            </div>
          </td>
          <td>
            <div class="date-cell">
              <strong>${accident.accident_date}</strong>
              <small>${accident.accident_time}</small>
            </div>
          </td>
          <td>${accident.accident_type}</td>
          <td>${accident.specific_location}</td>
          <td>
            <span class="accident-status ${statusClass}">${status}</span>
          </td>
          <td>
            <button class="accident-view-btn" id="viewAccidentDetailBtn" data-accident="${accident.accident_id}">
              <i class="fas fa-eye"></i>
              View
            </button>
          </td>
        </tr>
      `;
    });

    tableCount.innerHTML = `
      Showing
      <strong>${startIndex + 1}-${endIndex}</strong>
      of
      <strong>${totalAccidents}</strong>
      accident reports
    `;

    renderPagination(totalPages);

    const viewButtons = accidentTbody.querySelectorAll(".accident-view-btn");

    viewButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const selectedAccident = accidentDetails.find(
          accident => String(accident.accident_id) === String(btn.dataset.accident)
        );

        if(!selectedAccident) {
          console.error("Accident not found:", btn.dataset.accident);
          return;
        }

        detailedAccidentReport(detailAccidentContainer, selectedAccident);
      });
    });
  }

  function renderPagination(totalPages) {
    pagination.innerHTML = "";

    if(totalPages <= 1) {
      return;
    }

    const previousButton = document.createElement("button");

    previousButton.innerHTML = `
      <i class="fas fa-chevron-left"></i>
    `;

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

      if (currentPage < totalPages) {
        currentPage++;

        applyFilters();
      }

    });

    pagination.appendChild(nextButton);
  }
  

  function applyFilters() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    const fromDate = fromDateInput.value;
    const toDate = toDateInput.value;

    const filteredAccidents = accidentDetails.filter(accident => {
      const publicId = String(accident.public_accident_id ?? "").toLowerCase();

      const roadName = String(accident.road_name ?? "").toLowerCase();

      const location = String(accident.specific_location ?? "").toLowerCase();

      const accidentType = String(accident.accident_type ?? "").toLowerCase();

      const status = String(accident.status ?? "").toLowerCase();

      const matchesSearch =
        !searchTerm ||
        publicId.includes(searchTerm) ||
        roadName.includes(searchTerm) ||
        location.includes(searchTerm) ||
        accidentType.includes(searchTerm) ||
        status.includes(searchTerm);

      const accidentDate = String(accident.accident_date ?? "");

      const matchesFromDate = !fromDate || accidentDate >= fromDate;

      const matchesToDate = !toDate || accidentDate <= toDate;

      return (matchesSearch && matchesFromDate && matchesToDate);
    });

    renderTable(filteredAccidents);
  }

  renderTable(accidentDetails);

  searchInput.addEventListener("input", () => {
    currentPage = 1;

    applyFilters();
  });

  filterBtn.addEventListener("click", () => {
    const fromDate = fromDateInput.value;
    const toDate = toDateInput.value;

    if(fromDate && toDate && fromDate > toDate) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Date Range",
        text: "The From date cannot be later than the To date.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      });

      fromDateInput.value = "";
      toDateInput.value = "";

      currentPage = 1;

      return;
    }

    applyFilters();
  });

}