export function renderTicketPanel(container) {
  container.innerHTML = `
    <div class="tickets-toolbar">

      <div class="ticket-search">

        <i class="fas fa-search"></i>

        <input
          type="text"
          id="ticketSearch"
          placeholder="Search ticket ID, violation ID, or road..."
        >

      </div>


      <div class="ticket-filters">

        <select
          id="ticketViolationFilter"
          class="ticket-filter"
        >

          <option value="">
            All Violations
          </option>

          <option value="Illegal Parking">
            Illegal Parking
          </option>

          <option value="Obstruction">
            Road Obstruction
          </option>

          <option value="Route Violation">
            Route Violation
          </option>

          <option value="Speeding">
            Speeding
          </option>

          <option value="Beating Red Light">
            Beating Red Light
          </option>

        </select>


        <select
          id="ticketStatusFilter"
          class="ticket-filter"
        >

          <option value="">
            All Status
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Paid">
            Paid
          </option>

          <option value="Disputed">
            Disputed
          </option>

          <option value="Overdue">
            Overdue
          </option>

          <option value="Cancelled">
            Cancelled
          </option>

        </select>

      </div>
    </div>

    <div class="tickets-table-wrapper">

      <table class="ticket-table">

        <thead>

          <tr>

            <th>
              Public Ticket ID
            </th>

            <th>
              Violation ID
            </th>

            <th>
              Violation
            </th>

            <th>
              Road / Street
            </th>

            <th>
              Date & Time
            </th>

            <th>
              Action
            </th>

          </tr>

        </thead>


        <tbody id="ticketsTbody">

          <tr>

            <td>

              <span class="ticket-id">
                TKT-2026-001
              </span>

            </td>


            <td>

              <span class="violation-id">
                VIO-8492
              </span>

            </td>


            <td>

              <span class="badge badge-speeding">
                Speeding
              </span>

            </td>


            <td>

              <div class="road-cell">

                <i class="fas fa-road"></i>

                <span>
                  EDSA / Ayala Ave
                </span>

              </div>

            </td>


            <td>

              <div class="datetime-cell">

                <span class="date">
                  Aug 27, 2026
                </span>

                <span class="time">
                  02:30 PM
                </span>

              </div>

            </td>

            <td>

              <div class="action-buttons">

                <button
                  type="button"
                  class="btn-action view"
                  title="View Details"
                >
                  <i class="fas fa-eye"></i>
                </button>

                <button
                  type="button"
                  class="btn-action delete"
                  title="Delete Ticket"
                >
                  <i class="fas fa-trash"></i>
                </button>

              </div>

            </td>

          </tr>

          <tr>

            <td>

              <span class="ticket-id">
                TKT-2026-002
              </span>

            </td>


            <td>

              <span class="violation-id">
                VIO-8493
              </span>

            </td>


            <td>

              <span class="badge badge-parking">
                Illegal Parking
              </span>

            </td>


            <td>

              <div class="road-cell">

                <i class="fas fa-road"></i>

                <span>
                  Roxas Boulevard
                </span>

              </div>

            </td>


            <td>

              <div class="datetime-cell">

                <span class="date">
                  Aug 27, 2026
                </span>

                <span class="time">
                  09:15 AM
                </span>

              </div>

            </td>

            <td>

              <div class="action-buttons">

                <button
                  type="button"
                  class="btn-action view"
                  title="View Details"
                >
                  <i class="fas fa-eye"></i>
                </button>

                <button
                  type="button"
                  class="btn-action delete"
                  title="Delete Ticket"
                >
                  <i class="fas fa-trash"></i>
                </button>

              </div>

            </td>

          </tr>

          <tr>

            <td>

              <span class="ticket-id">
                TKT-2026-003
              </span>

            </td>


            <td>

              <span class="violation-id">
                VIO-8494
              </span>

            </td>


            <td>

              <span class="badge badge-beating">
                Beating Red Light
              </span>

            </td>


            <td>

              <div class="road-cell">

                <i class="fas fa-road"></i>

                <span>
                  Quezon Ave / Araneta
                </span>

              </div>

            </td>


            <td>

              <div class="datetime-cell">

                <span class="date">
                  Aug 26, 2026
                </span>

                <span class="time">
                  06:45 PM
                </span>

              </div>

            </td>

            <td>
              <div class="action-buttons">

                <button
                  type="button"
                  class="btn-action view"
                  title="View Details"
                >
                  <i class="fas fa-eye"></i>
                </button>

                <button
                  type="button"
                  class="btn-action delete"
                  title="Delete Ticket"
                >
                  <i class="fas fa-trash"></i>
                </button>

              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="tickets-table-footer">

      <span class="ticket-result-count">
        Showing <strong>1-3</strong> of <strong>128</strong> tickets
      </span>


      <div class="ticket-pagination">

        <button
          type="button"
          class="pagination-btn disabled"
          disabled
        >
          <i class="fas fa-chevron-left"></i>
        </button>


        <button
          type="button"
          class="pagination-btn active"
        >
          1
        </button>


        <button
          type="button"
          class="pagination-btn"
        >
          2
        </button>


        <button
          type="button"
          class="pagination-btn"
        >
          3
        </button>


        <span class="pagination-ellipsis">
          ...
        </span>


        <button
          type="button"
          class="pagination-btn"
        >
          43
        </button>


        <button
          type="button"
          class="pagination-btn"
        >
          <i class="fas fa-chevron-right"></i>
        </button>

      </div>

    </div>
  `;
}