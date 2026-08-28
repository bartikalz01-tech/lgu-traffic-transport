export function openTicketDetail(container, ticket) {

  container.innerHTML = `

    <div class="ticket-detail-modal">

      <div class="ticket-detail-header">

        <div>

          <span class="ticket-detail-label">
            TICKET DETAILS
          </span>

          <h2>
            ${escapeHtml(
              ticket.public_ticket_id || "—"
            )}
          </h2>

        </div>


        <button
          type="button"
          class="ticket-detail-close"
          id="closeTicketDetail"
          title="Close"
        >

          <i class="fas fa-times"></i>

        </button>

      </div>


      <div class="ticket-detail-body">


        <!-- TICKET INFORMATION -->

        <section class="ticket-detail-section">

          <div class="ticket-detail-section-title">

            <i class="fas fa-ticket"></i>

            <span>
              Ticket Information
            </span>

          </div>


          <div class="ticket-detail-grid">

            <div class="ticket-detail-field">

              <span class="field-label">
                Public Ticket ID
              </span>

              <span class="field-value ticket-id">
                ${escapeHtml(
                  ticket.public_ticket_id || "—"
                )}
              </span>

            </div>


            <div class="ticket-detail-field">

              <span class="field-label">
                Violation ID
              </span>

              <span class="field-value">
                ${escapeHtml(
                  ticket.public_violation_id || "—"
                )}
              </span>

            </div>


            <div class="ticket-detail-field">

              <span class="field-label">
                Violation Type
              </span>

              <span class="field-value">

                <span class="badge ${getViolationBadgeClass(
                  ticket.violation_type
                )}">

                  ${escapeHtml(
                    ticket.violation_type || "—"
                  )}

                </span>

              </span>

            </div>


            <div class="ticket-detail-field">

              <span class="field-label">
                Offense Level
              </span>

              <span class="field-value">
                ${escapeHtml(
                  ticket.offense_level || "—"
                )}
              </span>

            </div>


            <div class="ticket-detail-field">

              <span class="field-label">
                Issued At
              </span>

              <span class="field-value">
                ${formatDateTime(
                  ticket.issued_at
                )}
              </span>

            </div>


            <div class="ticket-detail-field">

              <span class="field-label">
                Due Date
              </span>

              <span class="field-value">
                ${formatDateTime(
                  ticket.due_date
                )}
              </span>

            </div>

          </div>

        </section>


        <!-- VIOLATION INFORMATION -->

        <section class="ticket-detail-section">

          <div class="ticket-detail-section-title">

            <i class="fas fa-triangle-exclamation"></i>

            <span>
              Violation Information
            </span>

          </div>


          <div class="ticket-detail-grid">

            <div class="ticket-detail-field">

              <span class="field-label">
                Road / Street
              </span>

              <span class="field-value">
                ${escapeHtml(
                  ticket.road_name || "—"
                )}
              </span>

            </div>


            <div class="ticket-detail-field">

              <span class="field-label">
                Violation Date & Time
              </span>

              <span class="field-value">
                ${formatDateTime(
                  ticket.violation_datetime
                )}
              </span>

            </div>


            <div class="ticket-detail-field full">

              <span class="field-label">
                Location Details
              </span>

              <span class="field-value">
                ${escapeHtml(
                  ticket.location_details || "—"
                )}
              </span>

            </div>


            <div class="ticket-detail-field full">

              <span class="field-label">
                Description
              </span>

              <span class="field-value description">
                ${escapeHtml(
                  ticket.description || "—"
                )}
              </span>

            </div>

          </div>

        </section>


        <!-- SUBJECT INFORMATION -->

        <section class="ticket-detail-section">

          <div class="ticket-detail-section-title">

            <i class="fas fa-user"></i>

            <span>
              Subject Information
            </span>

          </div>


          <div class="ticket-detail-grid">

            <div class="ticket-detail-field">

              <span class="field-label">
                Subject Type
              </span>

              <span class="field-value">
                ${escapeHtml(
                  ticket.subject_type || "—"
                )}
              </span>

            </div>


            <div class="ticket-detail-field">

              <span class="field-label">
                Person ID
              </span>

              <span class="field-value">
                ${escapeHtml(
                  ticket.person_id || "Not assigned"
                )}
              </span>

            </div>


            <div class="ticket-detail-field">

              <span class="field-label">
                Vehicle Plate
              </span>

              <span class="field-value">
                ${escapeHtml(
                  ticket.plate_number || "—"
                )}
              </span>

            </div>


            <div class="ticket-detail-field">

              <span class="field-label">
                Vehicle Type
              </span>

              <span class="field-value">
                ${escapeHtml(
                  ticket.vehicle_type || "—"
                )}
              </span>

            </div>

          </div>

        </section>


        <!-- OFFICER INFORMATION -->

        <section class="ticket-detail-section">

          <div class="ticket-detail-section-title">

            <i class="fas fa-user-shield"></i>

            <span>
              Assigned Officer
            </span>

          </div>


          <div class="ticket-officer-card">

            <div class="ticket-officer-icon">

              <i class="fas fa-user-shield"></i>

            </div>


            <div class="ticket-officer-info">

              <strong>
                ${escapeHtml(
                  ticket.officer_name || "Unassigned"
                )}
              </strong>

              <span>
                ${escapeHtml(
                  ticket.officer_contact ||
                  "No contact number"
                )}
              </span>

            </div>


            <span class="officer-status">

              Assigned

            </span>

          </div>

        </section>


        <!-- NOTES -->

        <section class="ticket-detail-section">

          <div class="ticket-detail-section-title">

            <i class="fas fa-note-sticky"></i>

            <span>
              Notes
            </span>

          </div>


          <div class="ticket-notes">

            ${escapeHtml(
              ticket.notes || "No notes available."
            )}

          </div>

        </section>


        <!-- EVIDENCE -->

        ${
          ticket.cloudinary_url
            ? `

              <section class="ticket-detail-section">

                <div class="ticket-detail-section-title">

                  <i class="fas fa-camera"></i>

                  <span>
                    Evidence
                  </span>

                </div>


                <div class="ticket-evidence">

                  <img
                    src="${escapeHtml(
                      ticket.cloudinary_url
                    )}"
                    alt="Violation evidence"
                  >

                </div>

              </section>

            `
            : ""
        }

      </div>


      <div class="ticket-detail-footer">

        <button
          type="button"
          class="ticket-detail-close-btn"
          id="closeTicketDetailFooter"
        >
          Close
        </button>

      </div>

    </div>

  `;


  container.classList.remove(
    "detail-overlay-hidden"
  );


  function closeModal() {

    container.classList.add(
      "detail-overlay-hidden"
    );

    container.innerHTML = "";

  }


  const closeButton =
    document.getElementById(
      "closeTicketDetail"
    );


  const closeFooterButton =
    document.getElementById(
      "closeTicketDetailFooter"
    );


  closeButton?.addEventListener(
    "click",
    closeModal
  );


  closeFooterButton?.addEventListener(
    "click",
    closeModal
  );


  // Close when clicking dark overlay

  container.addEventListener(
    "click",
    event => {

      if (
        event.target === container
      ) {

        closeModal();

      }

    }
  );


  // Close with Escape

  document.addEventListener(
    "keydown",
    function handleEscape(event) {

      if (
        event.key === "Escape" &&
        !container.classList.contains(
          "detail-overlay-hidden"
        )
      ) {

        closeModal();

        document.removeEventListener(
          "keydown",
          handleEscape
        );

      }

    }
  );

}


function formatDateTime(datetime) {

  if (!datetime) {

    return "—";

  }


  const date =
    new Date(
      datetime.replace(" ", "T")
    );


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return escapeHtml(
      datetime
    );

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
    violationType.toLowerCase();


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