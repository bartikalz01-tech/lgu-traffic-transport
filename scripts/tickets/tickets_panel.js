import { fetchTickets } from "../data/tickets/fetch_tickets.js";
import { openTicketDetail } from "./ticket_details.js";

export async function renderTicketPanel(container) {

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
              Assigned Officer
            </th>

            <th>
              Action
            </th>

          </tr>

        </thead>


        <tbody id="ticketsTbody">

          <tr>

            <td colspan="7">

              <div class="ticket-loading">

                <i class="fas fa-spinner fa-spin"></i>

                Loading tickets...

              </div>

            </td>

          </tr>

        </tbody>

      </table>

    </div>


    <div class="tickets-table-footer">

      <span class="ticket-result-count">

        Showing
        <strong id="ticketShowingStart">0</strong>-
        <strong id="ticketShowingEnd">0</strong>
        of
        <strong id="ticketTotalCount">0</strong>
        tickets

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

    <div class="ticket-detail-overlay detail-overlay-hidden"></div> <!-- HERE NEXUS -->

  `;


  const tbody =
    document.getElementById(
      "ticketsTbody"
    );


  try {

    const tickets =
      await fetchTickets();


    renderTickets(
      tbody,
      tickets
    );


  } catch(error) {

    console.error(
      "Failed to load ticket panel:",
      error
    );


    tbody.innerHTML = `

      <tr>

        <td colspan="7">

          <div class="ticket-error">

            <i class="fas fa-circle-exclamation"></i>

            <span>
              Failed to load tickets.
            </span>

          </div>

        </td>

      </tr>

    `;

  }

}


function renderTickets(tbody, tickets) {

  if (!tickets.length) {

    tbody.innerHTML = `

      <tr>

        <td colspan="7">

          <div class="ticket-empty">

            <i class="fas fa-ticket"></i>

            <span>
              No tickets found.
            </span>

          </div>

        </td>

      </tr>

    `;

    updateTicketCount(0);

    return;

  }


  tbody.innerHTML =
    tickets
      .map(ticket => createTicketRow(ticket))
      .join("");


  updateTicketCount(
    tickets.length
  );


  attachTicketActions(
    tbody,
    tickets
  );

}

function attachTicketActions(
  tbody,
  tickets
) {

  const detailContainer =
    document.querySelector(
      ".ticket-detail-overlay"
    );


  if (!detailContainer) {

    console.error(
      "Ticket detail container not found."
    );

    return;

  }


  tbody
    .querySelectorAll(".btn-action.view")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const ticketId =
            Number(
              button.dataset.ticketId
            );


          const ticket =
            tickets.find(
              item =>
                Number(item.ticket_id) === ticketId
            );


          if (!ticket) {

            console.error(
              "Ticket not found:",
              ticketId
            );

            return;

          }


          openTicketDetail(
            detailContainer,
            ticket
          );

        }
      );

    });

}


function createTicketRow(ticket) {

  return `

    <tr data-ticket-id="${ticket.ticket_id}">

      <td>

        <span class="ticket-id">

          ${escapeHtml(
            ticket.public_ticket_id || "—"
          )}

        </span>

      </td>


      <td>

        <span class="violation-id">

          ${escapeHtml(
            ticket.public_violation_id || "—"
          )}

        </span>

      </td>


      <td>

        <span class="badge ${getViolationBadgeClass(
          ticket.violation_type
        )}">

          ${escapeHtml(
            ticket.violation_type || "—"
          )}

        </span>

      </td>


      <td>

        <div class="road-cell">

          <i class="fas fa-road"></i>

          <span>

            ${escapeHtml(
              ticket.road_name || "—"
            )}

          </span>

        </div>

      </td>


      <td>

        ${formatDateTime(
          ticket.violation_datetime
        )}

      </td>


      <td>

        ${escapeHtml(
          ticket.officer_name || "Unassigned"
        )}

      </td>


      <td>

        <div class="action-buttons">

          <button
            type="button"
            class="btn-action view"
            title="View Details"
            data-ticket-id="${ticket.ticket_id}"
          >

            <i class="fas fa-eye"></i>

          </button>


          <button
            type="button"
            class="btn-action delete"
            title="Delete Ticket"
            data-ticket-id="${ticket.ticket_id}"
          >

            <i class="fas fa-trash"></i>

          </button>

        </div>

      </td>

    </tr>

  `;

}

function formatDateTime(datetime) {

  if (!datetime) {

    return "—";

  }


  const date =
    new Date(
      datetime.replace(" ", "T")
    );


  if (Number.isNaN(date.getTime())) {

    return `
      <div class="datetime-cell">

        <span class="date">
          ${escapeHtml(datetime)}
        </span>

      </div>
    `;

  }


  const formattedDate =
    date.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "2-digit",
        year: "numeric"
      }
    );


  const formattedTime =
    date.toLocaleTimeString(
      "en-US",
      {
        hour: "2-digit",
        minute: "2-digit"
      }
    );


  return `

    <div class="datetime-cell">

      <span class="date">
        ${formattedDate}
      </span>

      <span class="time">
        ${formattedTime}
      </span>

    </div>

  `;

}

function getViolationBadgeClass(
  violationType
) {

  if (!violationType) {

    return "";

  }


  const type =
    violationType
      .toLowerCase();


  if (
    type.includes("parking")
  ) {

    return "badge-parking";

  }


  if (
    type.includes("speed")
  ) {

    return "badge-speeding";

  }


  if (
    type.includes("red")
  ) {

    return "badge-beating";

  }


  if (
    type.includes("obstruction")
  ) {

    return "badge-obstruction";

  }


  if (
    type.includes("route")
  ) {

    return "badge-route";

  }


  return "badge-default";

}

function updateTicketCount(
  total
) {

  const start =
    document.getElementById(
      "ticketShowingStart"
    );

  const end =
    document.getElementById(
      "ticketShowingEnd"
    );

  const count =
    document.getElementById(
      "ticketTotalCount"
    );


  if (!start || !end || !count) {

    return;

  }


  if (total === 0) {

    start.textContent = "0";
    end.textContent = "0";
    count.textContent = "0";

    return;

  }


  start.textContent = "1";

  end.textContent =
    total;

  count.textContent =
    total;

}

function escapeHtml(value) {

  if (
    value === null ||
    value === undefined
  ) {

    return "";

  }


  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}