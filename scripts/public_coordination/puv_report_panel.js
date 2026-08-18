export function renderPuvReportPanel(container) {

  container.innerHTML = `
    <div class="ptc-content-card">

      <div class="ptc-content-header">

        <div>
          <h3>
            <i class="fas fa-bus"></i>
            Registered PUV Groups
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
              <th>Assigned Area</th>
              <th>Street / Location</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody id="ptcGroupsTableBody">

            <tr>
              <td>
                <strong>Mabini TODA</strong>
              </td>

              <td>
                Tricycle / TODA
              </td>

              <td>
                Juan Dela Cruz
              </td>

              <td>
                09171234567
              </td>

              <td>
                Barangay Public Market
              </td>

              <td>
                Rizal Street
              </td>

              <td>
                <span class="ptc-status-badge active">
                  Active
                </span>
              </td>

              <td>
                <button
                  type="button"
                  class="ptc-action-btn"
                  title="View Details"
                >
                  <i class="fas fa-eye"></i>
                </button>
              </td>
            </tr>


            <tr>
              <td>
                <strong>
                  San Isidro Jeepney Operators Association
                </strong>
              </td>

              <td>
                Jeepney
              </td>

              <td>
                Pedro Santos
              </td>

              <td>
                09181234567
              </td>

              <td>
                Municipal Transport Terminal
              </td>

              <td>
                Mabini Avenue
              </td>

              <td>
                <span class="ptc-status-badge active">
                  Active
                </span>
              </td>

              <td>
                <button
                  type="button"
                  class="ptc-action-btn"
                  title="View Details"
                >
                  <i class="fas fa-eye"></i>
                </button>
              </td>
            </tr>


            <tr>
              <td>
                <strong>
                  Central UV Express Association
                </strong>
              </td>

              <td>
                UV Express
              </td>

              <td>
                Maria Garcia
              </td>

              <td>
                09201234567
              </td>

              <td>
                City Transport Hub
              </td>

              <td>
                Bonifacio Street
              </td>

              <td>
                <span class="ptc-status-badge pending">
                  Pending
                </span>
              </td>

              <td>
                <button
                  type="button"
                  class="ptc-action-btn"
                  title="View Details"
                >
                  <i class="fas fa-eye"></i>
                </button>
              </td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>
  `;


  const searchInput =
    container.querySelector("#ptcSearchInput");


  searchInput.addEventListener(
    "input",
    event => {

      const searchTerm =
        event.target.value
          .toLowerCase()
          .trim();


      const rows =
        container.querySelectorAll(
          "#ptcGroupsTableBody tr"
        );


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

}