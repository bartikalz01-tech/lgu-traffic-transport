import { fetchSaveTicketReportDetails } from "../data/tickets/fetch_tickets.js";

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


            <!--<div class="ticket-detail-field">

              <span class="field-label">
                Person ID
              </span>

              <span
                class="field-value"
                id="ticketPersonId"
              >
                ${escapeHtml(
                  ticket.person_id || "Not assigned"
                )}
              </span>

            </div>-->


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


          ${
            ticket.person_id
              ? `

                <!-- SAVED PERSON INFORMATION -->

                <div class="ticket-saved-report-details">

                  <div class="ticket-detail-section-title">

                    <i class="fas fa-circle-check"></i>

                    <span>
                      Report Details
                    </span>

                  </div>


                  <div class="ticket-detail-grid">


                    <!-- FIRST NAME -->

                    <div class="ticket-detail-field">

                      <span class="field-label">
                        First Name
                      </span>

                      <span class="field-value">

                        ${escapeHtml(
                          ticket.first_name || "—"
                        )}

                      </span>

                    </div>


                    <!-- MIDDLE NAME -->

                    <div class="ticket-detail-field">

                      <span class="field-label">
                        Middle Name
                      </span>

                      <span class="field-value">

                        ${escapeHtml(
                          ticket.middle_name || "—"
                        )}

                      </span>

                    </div>


                    <!-- LAST NAME -->

                    <div class="ticket-detail-field">

                      <span class="field-label">
                        Last Name
                      </span>

                      <span class="field-value">

                        ${escapeHtml(
                          ticket.last_name || "—"
                        )}

                      </span>

                    </div>


                    <!-- CONTACT NUMBER -->

                    <div class="ticket-detail-field">

                      <span class="field-label">
                        Contact Number
                      </span>

                      <span class="field-value">

                        ${escapeHtml(
                          ticket.person_contact_number || "—"
                        )}

                      </span>

                    </div>


                    <!-- ADDRESS -->

                    <div class="ticket-detail-field full">

                      <span class="field-label">
                        Address
                      </span>

                      <span class="field-value">

                        ${escapeHtml(
                          ticket.person_address || "—"
                        )}

                      </span>

                    </div>


                    <!-- INVESTIGATION NOTES -->

                    <div class="ticket-detail-field full">

                      <span class="field-label">
                        Investigation Notes
                      </span>

                      <span class="field-value description">

                        ${escapeHtml(
                          ticket.notes || "—"
                        )}

                      </span>

                    </div>


                  </div>

                </div>

              `
              : `

                <button
                  type="button"
                  class="ticket-person-add-btn"
                  id="addTicketReportDetails"
                >

                  <i class="fas fa-user-plus"></i>

                  Add Report Information

                </button>

              `
          }


          <!-- PERSON FORM -->

          <div
            class="ticket-report-details-form"
            id="ticketReportDetailsForm"
            style="display: none;"
          >

            <div class="ticket-detail-section-title">

              <i class="fas fa-user-pen"></i>

              <span>
                Report Details
              </span>

            </div>


            <div class="ticket-detail-grid">


              <div class="ticket-detail-field">

                <label
                  class="field-label"
                  for="personFirstName"
                >
                  First Name
                </label>

                <input
                  type="text"
                  id="personFirstName"
                  class="ticket-person-input"
                  placeholder="Enter first name"
                  maxlength="100"
                  required
                >

              </div>


              <div class="ticket-detail-field">

                <label
                  class="field-label"
                  for="personMiddleName"
                >
                  Middle Name
                </label>

                <input
                  type="text"
                  id="personMiddleName"
                  class="ticket-person-input"
                  placeholder="Enter middle name"
                  maxlength="100"
                >

              </div>


              <div class="ticket-detail-field">

                <label
                  class="field-label"
                  for="personLastName"
                >
                  Last Name
                </label>

                <input
                  type="text"
                  id="personLastName"
                  class="ticket-person-input"
                  placeholder="Enter last name"
                  maxlength="100"
                  required
                >

              </div>


              <div class="ticket-detail-field">

                <label
                  class="field-label"
                  for="personContactNumber"
                >
                  Contact Number
                </label>

                <input
                  type="text"
                  id="personContactNumber"
                  class="ticket-person-input"
                  placeholder="Enter contact number"
                  maxlength="50"
                >

              </div>


              <div class="ticket-detail-field full">

                <label
                  class="field-label"
                  for="personAddress"
                >
                  Address
                </label>

                <textarea
                  id="personAddress"
                  class="ticket-person-input"
                  placeholder="Enter complete address"
                  rows="3"
                ></textarea>

              </div>


              <div class="ticket-detail-field full">

                <label
                  class="field-label"
                  for="ticketNotes"
                >
                  Investigation Notes
                </label>

                <textarea
                  id="ticketNotes"
                  class="ticket-person-input"
                  placeholder="Enter notes about what happened during the investigation..."
                  rows="5"
                  maxlength="5000"
                >${escapeHtml(ticket.notes || "")}</textarea>

              </div>
            </div>

            <div
              class="ticket-person-form-message"
              id="ticketPersonFormMessage"
            ></div>


            <button
              type="button"
              class="ticket-person-save-btn"
              id="saveTicketReportDetails"
            >

              <i class="fas fa-save"></i>

              Save Report Details

            </button>

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
          class="ticket-detail-print-btn"
          id="printTicket"
        >

          <i class="fas fa-print"></i>

          Print Ticket

        </button>


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


  /*
  ============================================================
  CLOSE BUTTONS
  ============================================================
  */

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


  /*
  ============================================================
  ADD PERSON INFORMATION
  ============================================================
  */

  const addReportDetailsButton =
    document.getElementById(
      "addTicketReportDetails"
    );

  const reportDetailsForm =
    document.getElementById(
      "ticketReportDetailsForm"
    );

  addReportDetailsButton?.addEventListener(
    "click",
    () => {

      if (!reportDetailsForm) {
        return;
      }

      reportDetailsForm.style.display = "block";

      addReportDetailsButton.style.display = "none";

    }
  );


  /*
  ============================================================
  SAVE PERSON INFORMATION
  ============================================================
  */

  const saveReportDetailsButton =
    document.getElementById(
      "saveTicketReportDetails"
    );

  saveReportDetailsButton?.addEventListener(
    "click",
    async () => {

      await saveTicketReportDetails(
        ticket,
        saveReportDetailsButton
      );

    }
  );


  /*
  ============================================================
  PRINT TICKET
  ============================================================
  */

  const printButton =
    document.getElementById(
      "printTicket"
    );


  printButton?.addEventListener(
    "click",
    () => {

      printTicket(ticket);

    }
  );


  /*
  ============================================================
  CLOSE WHEN CLICKING DARK OVERLAY
  ============================================================
  */

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


  /*
  ============================================================
  ESCAPE KEY
  ============================================================
  */

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

/*
============================================================
SAVE PERSON TO BACKEND
============================================================
*/

async function saveTicketReportDetails(
  ticket,
  button
) {

  const firstName =
    document
      .getElementById(
        "personFirstName"
      )
      ?.value
      .trim();


  const middleName =
    document
      .getElementById(
        "personMiddleName"
      )
      ?.value
      .trim();


  const lastName =
    document
      .getElementById(
        "personLastName"
      )
      ?.value
      .trim();


  const contactNumber =
    document
      .getElementById(
        "personContactNumber"
      )
      ?.value
      .trim();


  const address =
    document
      .getElementById(
        "personAddress"
      )
      ?.value
      .trim();


  const notes =
    document
      .getElementById(
        "ticketNotes"
      )
      ?.value
      .trim();


  const message =
    document.getElementById(
      "ticketPersonFormMessage"
    );


  /*
  ============================================================
  VALIDATION
  ============================================================
  */

  if (!firstName || !lastName) {

    if (message) {

      message.textContent =
        "First name and last name are required.";

      message.className =
        "ticket-person-form-message error";

    }

    return;

  }


  if (!ticket.ticket_id) {

    if (message) {

      message.textContent =
        "Ticket ID is missing.";

      message.className =
        "ticket-person-form-message error";

    }

    return;

  }


  button.disabled = true;

  button.innerHTML = `

    <i class="fas fa-spinner fa-spin"></i>

    Saving...

  `;


  try {

    /*
    ============================================================
    PREPARE DATA
    ============================================================
    */

    const ticketData = {

      ticket_id:
        Number(
          ticket.ticket_id
        ),

      first_name:
        firstName,

      middle_name:
        middleName || null,

      last_name:
        lastName,

      contact_number:
        contactNumber || null,

      address:
        address || null,

      notes:
        notes || null

    };


    /*
    ============================================================
    SEND TO FETCH LAYER
    ============================================================
    */

    const result =
      await fetchSaveTicketReportDetails(
        ticketData
      );


    /*
    ============================================================
    UPDATE CURRENT TICKET OBJECT
    ============================================================
    */

    if (result.person_id) {

      ticket.person_id =
        result.person_id;

    }


    ticket.notes =
      notes || null;


    /*
    ============================================================
    SUCCESS MESSAGE
    ============================================================
    */

    if (message) {

      message.textContent =
        "Report details saved successfully.";

      message.className =
        "ticket-person-form-message success";

    }


    /*
    ============================================================
    DISABLE FORM AFTER SUCCESS
    ============================================================
    */

    document
      .querySelectorAll(
        ".ticket-person-input"
      )
      .forEach(input => {

        input.disabled = true;

      });


    button.disabled = true;

    button.innerHTML = `

      <i class="fas fa-check"></i>

      Report Details Saved

    `;


  } catch(error) {

    console.error(
      "Failed to save report details:",
      error
    );


    if (message) {

      message.textContent =
        error.message ||
        "Failed to save report details.";

      message.className =
        "ticket-person-form-message error";

    }


    button.disabled = false;

    button.innerHTML = `

      <i class="fas fa-save"></i>

      Save Report Details

    `;

  }

}


/*
============================================================
PRINT TICKET
============================================================
*/

function printTicket(ticket) {

  const printWindow =
    window.open(
      "",
      "_blank",
      "width=900,height=1000"
    );


  if (!printWindow) {

    alert(
      "Unable to open print window. Please allow pop-ups for this site."
    );

    return;

  }


  const hasPerson =
    Boolean(
      ticket.person_id ||
      ticket.first_name ||
      ticket.last_name
    );


  const hasNotes =
    Boolean(
      ticket.notes &&
      ticket.notes.trim()
    );


  /*
  ============================================================
  PERSON INFORMATION
  ============================================================
  */

  const personSection = hasPerson
    ? `

      <div class="section">

        <div class="section-title">
          PERSON INFORMATION
        </div>


        <div class="person-grid">

          <div class="field">
            <span class="label">
              First Name
            </span>

            <span class="value">
              ${escapeHtml(
                ticket.first_name || "—"
              )}
            </span>
          </div>


          <div class="field">
            <span class="label">
              Middle Name
            </span>

            <span class="value">
              ${escapeHtml(
                ticket.middle_name || "—"
              )}
            </span>
          </div>


          <div class="field">
            <span class="label">
              Last Name
            </span>

            <span class="value">
              ${escapeHtml(
                ticket.last_name || "—"
              )}
            </span>
          </div>


          <div class="field">
            <span class="label">
              Contact Number
            </span>

            <span class="value">
              ${escapeHtml(
                ticket.person_contact_number || "—"
              )}
            </span>
          </div>


          <div class="field full">
            <span class="label">
              Address
            </span>

            <span class="value">
              ${escapeHtml(
                ticket.person_address || "—"
              )}
            </span>
          </div>

        </div>

      </div>

    `
    : `

      <div class="section">

        <div class="section-title">
          PERSON INFORMATION
        </div>


        <div class="writing-grid">

          <div class="write-field">
            <span>
              First Name
            </span>

            <div class="write-line"></div>
          </div>


          <div class="write-field">
            <span>
              Middle Name
            </span>

            <div class="write-line"></div>
          </div>


          <div class="write-field">
            <span>
              Last Name
            </span>

            <div class="write-line"></div>
          </div>


          <div class="write-field">
            <span>
              Contact Number
            </span>

            <div class="write-line"></div>
          </div>


          <div class="write-field full">
            <span>
              Address
            </span>

            <div class="write-line"></div>
          </div>

        </div>

      </div>

    `;


  /*
  ============================================================
  INVESTIGATION NOTES
  ============================================================
  */

  const notesSection = hasNotes
    ? `

      <div class="section">

        <div class="section-title">
          INVESTIGATION NOTES
        </div>


        <div class="notes-box">
          ${escapeHtml(ticket.notes)}
        </div>

      </div>

    `
    : `

      <div class="section">

        <div class="section-title">
          INVESTIGATION NOTES
        </div>


        <div class="notes-writing-area">

          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>

        </div>

      </div>

    `;


  /*
  ============================================================
  PRINT DOCUMENT
  ============================================================
  */

  printWindow.document.write(`

    <!DOCTYPE html>

    <html>

      <head>

        <meta charset="UTF-8">

        <title>
          Traffic Violation Ticket
          ${escapeHtml(
            ticket.public_ticket_id || ""
          )}
        </title>


        <style>

          * {
            box-sizing: border-box;
          }


          body {

            margin: 0;

            padding: 30px;

            font-family:
              Arial,
              Helvetica,
              sans-serif;

            color: #111827;

            background: #ffffff;

          }


          .ticket {

            width: 100%;

            max-width: 800px;

            margin: 0 auto;

            border: 2px solid #111827;

            padding: 28px;

          }


          .header {

            text-align: center;

            border-bottom:
              2px solid #111827;

            padding-bottom: 18px;

            margin-bottom: 20px;

          }


          .header h1 {

            margin: 0 0 6px;

            font-size: 22px;

            letter-spacing: 0.05em;

          }


          .header p {

            margin: 0;

            font-size: 12px;

            color: #4b5563;

          }


          .ticket-id {

            margin-top: 12px;

            font-size: 18px;

            font-weight: bold;

            letter-spacing: 0.08em;

          }


          .section {

            margin-bottom: 22px;

          }


          .section-title {

            padding-bottom: 7px;

            margin-bottom: 12px;

            border-bottom:
              1px solid #9ca3af;

            font-size: 12px;

            font-weight: bold;

            letter-spacing: 0.06em;

          }


          .grid,
          .person-grid,
          .writing-grid {

            display: grid;

            grid-template-columns:
              repeat(2, 1fr);

            gap: 14px 20px;

          }


          .field {

            display: flex;

            flex-direction: column;

            gap: 4px;

          }


          .field.full,
          .write-field.full {

            grid-column:
              1 / -1;

          }


          .label,
          .write-field span {

            font-size: 10px;

            font-weight: bold;

            color: #6b7280;

            text-transform: uppercase;

          }


          .value {

            min-height: 20px;

            font-size: 13px;

            line-height: 1.4;

          }


          .violation-box {

            padding: 14px;

            border:
              1px solid #9ca3af;

            background: #f9fafb;

          }


          .violation-name {

            margin-bottom: 8px;

            font-size: 17px;

            font-weight: bold;

          }


          .description {

            font-size: 12px;

            line-height: 1.5;

          }


          .writing-grid {

            gap: 20px;

          }


          .write-field {

            display: flex;

            flex-direction: column;

            gap: 8px;

          }


          .write-line {

            height: 28px;

            border-bottom:
              1px solid #111827;

          }


          .notes-box {

            min-height: 80px;

            padding: 12px;

            border:
              1px solid #9ca3af;

            font-size: 12px;

            line-height: 1.5;

            white-space: pre-wrap;

          }


          .notes-writing-area {

            min-height: 150px;

            border:
              1px solid #9ca3af;

            padding: 10px 12px;

          }


          .notes-writing-area div {

            height: 26px;

            border-bottom:
              1px solid #d1d5db;

          }


          .footer {

            margin-top: 28px;

            padding-top: 16px;

            border-top:
              1px solid #9ca3af;

            display: grid;

            grid-template-columns:
              1fr 1fr;

            gap: 30px;

          }


          .signature {

            padding-top: 35px;

            border-bottom:
              1px solid #111827;

            text-align: center;

            font-size: 11px;

          }


          .signature-label {

            margin-top: 6px;

            text-align: center;

            font-size: 10px;

            color: #6b7280;

          }


          .notice {

            margin-top: 20px;

            padding: 10px;

            border:
              1px solid #d1d5db;

            font-size: 10px;

            line-height: 1.4;

            color: #4b5563;

          }


          @media print {

            body {

              padding: 0;

            }


            .ticket {

              max-width: none;

              border: 2px solid #111827;

            }

          }


          @page {

            size: A4;

            margin: 12mm;

          }

        </style>

      </head>


      <body>

        <div class="ticket">


          <!-- HEADER -->

          <div class="header">

            <h1>
              TRAFFIC VIOLATION TICKET
            </h1>

            <p>
              Barangay Traffic and Transport Management
            </p>

            <div class="ticket-id">

              Ticket ID:
              ${escapeHtml(
                ticket.public_ticket_id || "—"
              )}

            </div>

          </div>


          <!-- TICKET INFORMATION -->

          <div class="section">

            <div class="section-title">
              TICKET INFORMATION
            </div>


            <div class="grid">

              <div class="field">

                <span class="label">
                  Violation ID
                </span>

                <span class="value">
                  ${escapeHtml(
                    ticket.public_violation_id || "—"
                  )}
                </span>

              </div>


              <div class="field">

                <span class="label">
                  Offense Level
                </span>

                <span class="value">
                  ${escapeHtml(
                    ticket.offense_level || "—"
                  )}
                </span>

              </div>


              <div class="field">

                <span class="label">
                  Issued At
                </span>

                <span class="value">
                  ${formatPlainDateTime(
                    ticket.issued_at
                  )}
                </span>

              </div>


              <div class="field">

                <span class="label">
                  Due Date
                </span>

                <span class="value">
                  ${formatPlainDateTime(
                    ticket.due_date
                  )}
                </span>

              </div>

            </div>

          </div>


          <!-- VIOLATION -->

          <div class="section">

            <div class="section-title">
              VIOLATION INFORMATION
            </div>


            <div class="violation-box">

              <div class="violation-name">

                ${escapeHtml(
                  ticket.violation_type || "—"
                )}

              </div>


              <div class="grid">

                <div class="field">

                  <span class="label">
                    Road / Street
                  </span>

                  <span class="value">
                    ${escapeHtml(
                      ticket.road_name || "—"
                    )}
                  </span>

                </div>


                <div class="field">

                  <span class="label">
                    Violation Date & Time
                  </span>

                  <span class="value">
                    ${formatPlainDateTime(
                      ticket.violation_datetime
                    )}
                  </span>

                </div>


                <div class="field full">

                  <span class="label">
                    Location Details
                  </span>

                  <span class="value">
                    ${escapeHtml(
                      ticket.location_details || "—"
                    )}
                  </span>

                </div>


                <div class="field full">

                  <span class="label">
                    Description
                  </span>

                  <span class="value description">
                    ${escapeHtml(
                      ticket.description || "—"
                    )}
                  </span>

                </div>

              </div>

            </div>

          </div>


          <!-- VEHICLE -->

          <div class="section">

            <div class="section-title">
              VEHICLE INFORMATION
            </div>


            <div class="grid">

              <div class="field">

                <span class="label">
                  Plate Number
                </span>

                <span class="value">
                  ${escapeHtml(
                    ticket.plate_number || "—"
                  )}
                </span>

              </div>


              <div class="field">

                <span class="label">
                  Vehicle Type
                </span>

                <span class="value">
                  ${escapeHtml(
                    ticket.vehicle_type || "—"
                  )}
                </span>

              </div>

            </div>

          </div>


          ${personSection}


          ${notesSection}


          <!-- OFFICER -->

          <div class="section">

            <div class="section-title">
              ASSIGNED OFFICER
            </div>


            <div class="grid">

              <div class="field">

                <span class="label">
                  Officer
                </span>

                <span class="value">
                  ${escapeHtml(
                    ticket.officer_name ||
                    "Unassigned"
                  )}
                </span>

              </div>


              <div class="field">

                <span class="label">
                  Contact
                </span>

                <span class="value">
                  ${escapeHtml(
                    ticket.officer_contact ||
                    "—"
                  )}
                </span>

              </div>

            </div>

          </div>


          <!-- SIGNATURES -->

          <div class="footer">

            <div>

              <div class="signature"></div>

              <div class="signature-label">
                Issuing Officer Signature
              </div>

            </div>


            <div>

              <div class="signature"></div>

              <div class="signature-label">
                Recipient / Driver Signature
              </div>

            </div>

          </div>


          <div class="notice">

            This document records the traffic violation
            identified by the issuing officer. The information
            written in the designated fields should be completed
            by the authorized officer during or after the
            investigation.

          </div>


        </div>

      </body>

    </html>

  `);


  printWindow.document.close();


  printWindow.focus();


  /*
  ============================================================
  WAIT FOR DOCUMENT TO RENDER
  ============================================================
  */

  setTimeout(() => {

    printWindow.focus();

    printWindow.print();

  }, 500);

}


/*
============================================================
DATE/TIME
============================================================
*/

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

/*
============================================================
PLAIN DATE/TIME FOR PRINT
============================================================
*/

function formatPlainDateTime(datetime) {

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


  return `${formattedDate} ${formattedTime}`;

}


/*
============================================================
VIOLATION BADGE
============================================================
*/

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


/*
============================================================
HTML ESCAPING
============================================================
*/

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