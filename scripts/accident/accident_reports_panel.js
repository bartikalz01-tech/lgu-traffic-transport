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
        <input type="text" placeholder="Search accident ID, road, or location...">
      </div>

      <select class="accident-filter">
        <option>All statuses</option>
        <option value="">Reported</option>
        <option value="">Investigating</option>
        <option value="">Resolved</option>
      </select>

      <select class="accident-filter">
        <option value="">All Accident Types</option>
        <option value="">Vehicle Collision</option>
        <option value="">Road Obstruction</option>
        <option value="">Hit and Run</option>
        <option value="">Other</option>
      </select>

      <button class="accident-filter-btn">
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
      <span>
        Showing <strong>1-5</strong> of <strong>24</strong> accident reports
      </span>

      <div class="accident-pagination">
        <button disabled>
          <i class="fas fa-chevron-left"></i>
        </button>

        <button class="active">1</button>
        <button>2</button>
        <button>3</button>
        <button>4</button>
        <button>5</button>

        <button>
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <div class="detailed-reports-overlay detailed-reports-hidden" id="detailAccidentContainer"></div>
  `;

  const accidentTbody = document.getElementById("accidentTbody");
  const detailAccidentContainer = document.getElementById("detailAccidentContainer");

  accidentDetails.forEach(accident => {
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
          <span class="accident-status reported">${accident.status}</span>
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

  const viewAccidentDetailBtn = document.querySelectorAll(".accident-view-btn");

  viewAccidentDetailBtn.forEach(btn => {

    btn.addEventListener("click", () => {
      const selectedAccident = accidentDetails.find(
        accident => String(accident.accident_id) === String(btn.dataset.accident)
      );

      detailedAccidentReport(detailAccidentContainer, selectedAccident);
    });

  });

}