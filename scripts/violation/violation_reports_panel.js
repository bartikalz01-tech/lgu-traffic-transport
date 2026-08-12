export function renderViolationReportsPanel(container, violation) {

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
        <input type="text" placeholder="Search violation reports..." />
      </div>

      <div class="violation-filter-group">
        <select>
          <option value="">All Status</option>
          <option value="Pending Review">Pending Review</option>
          <option value="Verified">Verified</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div class="violation-filter-group">
        <select>
          <option value="">All Violation Types</option>
          <option value="Illegal Parking">Illegal Parking</option>
          <option value="Road Obstruction">Road Obstruction</option>
          <option value="Route Violation">Route Violation</option>
        </select>
      </div>

      <div class="violation-filter-group">
        <input type="date" title="Filter by date" />
      </div>
    </div>

    <div class="violation-table-wrapper">
      <table class="violation-table">
        <thead>
          <tr>
            <th>Violation ID</th>
            <th>Violation Type</th>
            <th>Date & Time</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              <span class="violation-public-id">
                VIO-20260809-A84F21
              </span>
            </td>
            <td>
              <span class="violation-type-badge parking">
                Illegal Parking
              </span>
            </td>
            <td>
              <div class="violation-datetime">
                <strong>Aug 9, 2026</strong>
                <small>10:42 AM</small>
              </div>
            </td>
            <td>
              <span class="violation-status pending">
                <i class="fas fa-clock"></i>
                Pending Review
              </span>
            </td>
            <td>
              <button type="button" class="violation-action-btn" title="View Report">
                <i class="fas fa-eye"></i>
              </button>
            </td>
          </tr>

          <tr>
            <td>
              <span class="violation-public-id">
                VIO-20260809-B72C19
              </span>
            </td>
            <td>
              <span class="violation-type-badge obstruction">
                Road Obstruction
              </span>
            </td>
            <td>
              <div class="violation-datetime">
                <strong>Aug 9, 2026</strong>
                <small>09:18 AM</small>
              </div>
            </td>
            <td>
              <span class="violation-status verified">
                <i class="fas fa-circle-check"></i>
                Verified
              </span>
            </td>
            <td>
              <button type="button" class="violation-action-btn" title="View Report">
                <i class="fas fa-eye"></i>
              </button>
            </td>
          </tr>

          <tr>
            <td>
              <span class="violation-public-id">
                VIO-20260808-C51D03
              </span>
            </td>
            <td>
              <span class="violation-type-badge route">
                Route Violation
              </span>
            </td>
            <td>
              <div class="violation-datetime">
                <strong>Aug 8, 2026</strong>
                <small>04:45 AM</small>
              </div>
            </td>
            <td>
              <span class="violation-status rejected">
                <i class="fas fa-circle-xmark"></i>
                Rejected
              </span>
            </td>
            <td>
              <button type="button" class="violation-action-btn" title="View Report">
                <i class="fas fa-eye"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="violation-table-footer">
      <span>Showing 1-4 of 128 reports</span>
      <div class="violation-pagination">
        <button disabled>
          <i class="fas fa-chevron-left"></i>
        </button>

        <button class="active">1</button>
        <button>2</button>
        <button>3</button>

        <span>...</span>
        <button>32</button>

        <button>
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  `

}