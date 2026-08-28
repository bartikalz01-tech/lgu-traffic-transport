import {
  fetchVerifiedViolations,
  fetchAvailableOfficers,
  fetchCreateTicket
} from "../data/tickets/fetch_tickets.js";


export async function createTicketModal(container) {

  container.innerHTML = `

    <div class="create-ticket-modal">

      <div class="create-ticket-modal-header">

        <div class="create-ticket-modal-title">

          <div class="create-ticket-modal-icon">
            <i class="fas fa-ticket"></i>
          </div>

          <div>
            <h2>Create Violation Ticket</h2>

            <p>
              Create a ticket from a verified violation report
            </p>
          </div>

        </div>


        <button
          type="button"
          class="create-ticket-close"
          id="closeCreateTicket"
          title="Close"
        >
          <i class="fas fa-xmark"></i>
        </button>

      </div>


      <div class="create-ticket-modal-body">

        <!-- =========================================================
            VIOLATION LOOKUP
            ========================================================= -->

        <section class="ticket-form-section">

          <div class="ticket-section-header">

            <div>

              <h3>Violation Report</h3>

              <p>
                Find the verified violation that this ticket will be issued for.
              </p>

            </div>

            <span class="ticket-required-label">
              Required
            </span>

          </div>


          <div class="ticket-violation-search">

            <label for="ticketViolationSelect">
              Verified Violation
            </label>

            <div class="ticket-select-with-icon">

              <i class="fas fa-ticket"></i>

              <select id="ticketViolationSelect">

                <option value="">
                  Select a verified violation
                </option>

              </select>

            </div>


            <small class="ticket-field-help">

              Only verified violation reports can be issued as tickets.

            </small>

          </div>


          <!-- =====================================================
              FOUND VIOLATION
              ===================================================== -->

          <div
            class="ticket-violation-card"
            id="ticketViolationCard"
          >

            <div class="ticket-violation-card-header">

              <div>

                <span class="ticket-card-label">
                  Selected Violation
                </span>

                <strong id="selectedViolationId">
                  Select Violation
                </strong>

              </div>


              <span class="ticket-verified-badge">

                <i class="fas fa-circle-check"></i>

                Verified

              </span>

            </div>


            <div class="ticket-violation-grid">

              <div class="ticket-detail-item">

                <span class="ticket-detail-label">
                  Violation Type
                </span>

                <strong id="selectedViolationType">
                  -
                </strong>

              </div>


              <div class="ticket-detail-item">

                <span class="ticket-detail-label">
                  Offense Level
                </span>

                <strong id="selectedOffenseLevel">
                  -
                </strong>

              </div>


              <div class="ticket-detail-item">

                <span class="ticket-detail-label">
                  Road / Street
                </span>

                <strong id="selectedViolationRoad">
                  -
                </strong>

              </div>


              <div class="ticket-detail-item">

                <span class="ticket-detail-label">
                  Violation Date & Time
                </span>

                <strong id="selectedViolationDateTime">
                  -
                </strong>

              </div>


              <div class="ticket-detail-item">

                <span class="ticket-detail-label">
                  Subject
                </span>

                <strong id="selectedViolationSubject">
                  -
                </strong>

              </div>


              <div class="ticket-detail-item">

                <span class="ticket-detail-label">
                  Plate Number
                </span>

                <strong id="selectedViolationPlate">
                  -
                </strong>

              </div>

            </div>


            <div class="ticket-violation-description">

              <span class="ticket-detail-label">
                Location / Description
              </span>

              <p id="selectedViolationDescription">
                -
              </p>

            </div>

          </div>

        </section>


        <!-- =========================================================
            OFFICER ASSIGNMENT
            ========================================================= -->

        <section class="ticket-form-section">

          <div class="ticket-section-header">

            <div>

              <h3>Officer Assignment</h3>

              <p>
                Assign an available barangay officer to handle this ticket.
              </p>

            </div>

          </div>


          <div class="ticket-form-grid">

            <div class="ticket-form-group ticket-form-group-full">

              <label for="ticketOfficer">
                Assigned Officer
              </label>


              <div class="ticket-select-with-icon">

                <i class="fas fa-user-shield"></i>

                <select id="ticketOfficer">

                  <option value="">
                    Select an available officer
                  </option>

                </select>

              </div>


              <small class="ticket-field-help">

                Only officers with an Available status should be selectable.

              </small>

            </div>

          </div>

        </section>


        <!-- =========================================================
            TICKET DETAILS
            ========================================================= -->

        <section class="ticket-form-section">

          <div class="ticket-section-header">

            <div>

              <h3>Ticket Details</h3>

              <p>
                Set the settlement deadline and ticket issue time.
              </p>

            </div>

          </div>


          <div class="ticket-form-grid">

            <div class="ticket-form-group">

              <label for="ticketIssuedAt">
                Issued At
              </label>


              <input
                type="datetime-local"
                id="ticketIssuedAt"
              />


              <small class="ticket-field-help">

                Automatically set when the ticket is created.

              </small>

            </div>


            <div class="ticket-form-group">

              <label for="ticketDueDate">
                Due Date
              </label>


              <input
                type="datetime-local"
                id="ticketDueDate"
              />

            </div>

          </div>

        </section>

      </div>


      <!-- =========================================================
          MODAL FOOTER
          ========================================================= -->

      <div class="create-ticket-modal-footer">

        <div class="ticket-footer-note">

          <i class="fas fa-shield-halved"></i>

          <span>
            Ticket will be linked to the selected violation report.
          </span>

        </div>


        <div class="create-ticket-footer-actions">

          <button
            type="button"
            class="btn-ticket-cancel"
            id="cancelCreateTicket"
          >
            Cancel
          </button>


          <button
            type="button"
            class="btn-ticket-create"
            id="confirmCreateTicket"
          >

            <i class="fas fa-ticket"></i>

            Create Ticket

          </button>

        </div>

      </div>

    </div>

  `;


  /*
  ================================================================
  SHOW MODAL
  ================================================================
  */

  container.classList.remove(
    "create-ticket-hidden"
  );


  /*
  ================================================================
  DOM REFERENCES
  ================================================================
  */

  const closeButton =
    document.getElementById(
      "closeCreateTicket"
    );

  const cancelButton =
    document.getElementById(
      "cancelCreateTicket"
    );

  const violationSelect =
    document.getElementById(
      "ticketViolationSelect"
    );

  const violationCard =
    document.getElementById(
      "ticketViolationCard"
    );

  const officerSelect =
    document.getElementById(
      "ticketOfficer"
    );

  const issuedAtInput =
    document.getElementById(
      "ticketIssuedAt"
    );

  const dueDateInput =
    document.getElementById(
      "ticketDueDate"
    );

  const confirmCreateTicket =
    document.getElementById(
      "confirmCreateTicket"
    );


  /*
  ================================================================
  CLOSE MODAL
  ================================================================
  */

  function closeModal() {

    container.classList.add(
      "create-ticket-hidden"
    );

    container.innerHTML = "";

  }


  /*
  ================================================================
  FORMAT VIOLATION DATE
  ================================================================
  */

  function formatViolationDateTime(datetime) {

    if (!datetime) {

      return "—";

    }


    const date =
      new Date(
        String(datetime).replace(
          " ",
          "T"
        )
      );


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return datetime;

    }


    return date.toLocaleString(
      "en-US",
      {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }
    );

  }


  /*
  ================================================================
  RENDER VIOLATION
  ================================================================
  */

  function renderViolation(violation) {

    document.getElementById(
      "selectedViolationId"
    ).textContent =
      violation.public_violation_id || "—";


    document.getElementById(
      "selectedViolationType"
    ).textContent =
      violation.violation_type || "—";


    document.getElementById(
      "selectedOffenseLevel"
    ).textContent =
      violation.offense_level || "—";


    document.getElementById(
      "selectedViolationRoad"
    ).textContent =
      violation.road_name || "—";


    document.getElementById(
      "selectedViolationDateTime"
    ).textContent =
      formatViolationDateTime(
        violation.violation_datetime
      );


    document.getElementById(
      "selectedViolationSubject"
    ).textContent =
      violation.subject_type || "—";


    document.getElementById(
      "selectedViolationPlate"
    ).textContent =
      violation.plate_number || "N/A";


    document.getElementById(
      "selectedViolationDescription"
    ).textContent =
      violation.description ||
      violation.location_details ||
      "No description provided.";


    violationCard.classList.add(
      "visible"
    );

  }


  /*
  ================================================================
  CLOSE BUTTON
  ================================================================
  */

  closeButton.addEventListener(
    "click",
    closeModal
  );


  cancelButton.addEventListener(
    "click",
    closeModal
  );


  /*
  ================================================================
  CLICK OUTSIDE MODAL
  ================================================================
  */

  container.addEventListener(
    "click",
    (event) => {

      if (
        event.target === container
      ) {

        closeModal();

      }

    }
  );


  /*
  ================================================================
  ESCAPE KEY
  ================================================================
  */

  function handleEscape(event) {

    if (
      event.key === "Escape" &&
      !container.classList.contains(
        "create-ticket-hidden"
      )
    ) {

      closeModal();

      document.removeEventListener(
        "keydown",
        handleEscape
      );

    }

  }


  document.addEventListener(
    "keydown",
    handleEscape
  );


  /*
  ================================================================
  SET DEFAULT ISSUED DATE
  ================================================================
  */

  function getLocalDateTimeForInput() {

    const now =
      new Date();


    const year =
      now.getFullYear();


    const month =
      String(
        now.getMonth() + 1
      ).padStart(
        2,
        "0"
      );


    const day =
      String(
        now.getDate()
      ).padStart(
        2,
        "0"
      );


    const hours =
      String(
        now.getHours()
      ).padStart(
        2,
        "0"
      );


    const minutes =
      String(
        now.getMinutes()
      ).padStart(
        2,
        "0"
      );


    return `${year}-${month}-${day}T${hours}:${minutes}`;

  }


  issuedAtInput.value =
    getLocalDateTimeForInput();


  /*
  ================================================================
  LOAD VERIFIED VIOLATIONS
  ================================================================
  */

  try {

    const violations =
      await fetchVerifiedViolations();


    violations.forEach(
      (violation) => {

        const option =
          document.createElement(
            "option"
          );


        option.value =
          violation.violation_id;


        option.textContent =
          `${violation.public_violation_id} — ${violation.violation_type}`;


        option.dataset.violation =
          JSON.stringify(
            violation
          );


        violationSelect.appendChild(
          option
        );

      }
    );

  } catch (error) {

    console.error(
      "Failed to load violations:",
      error
    );


    Swal.fire({

      icon: "error",

      title: "Failed to Load Violations",

      text:
        error.message ||
        "Unable to load verified violations."

    });

  }


  /*
  ================================================================
  LOAD AVAILABLE OFFICERS
  ================================================================
  */

  try {

    const officers =
      await fetchAvailableOfficers();


    officers.forEach(
      (officer) => {

        const option =
          document.createElement(
            "option"
          );


        option.value =
          officer.officer_id;


        option.textContent =
          `${officer.officer_name} - ${officer.contact_number}`;


        officerSelect.appendChild(
          option
        );

      }
    );

  } catch (error) {

    console.error(
      "Failed to load officers:",
      error
    );


    Swal.fire({

      icon: "error",

      title: "Failed to Load Officers",

      text:
        error.message ||
        "Unable to load available officers."

    });

  }


  /*
  ================================================================
  VIOLATION SELECT
  ================================================================
  */

  violationSelect.addEventListener(
    "change",
    () => {

      const selectedOption =
        violationSelect.options[
          violationSelect.selectedIndex
        ];


      if (
        !selectedOption ||
        !selectedOption.value
      ) {

        violationCard.classList.remove(
          "visible"
        );


        document.getElementById(
          "selectedViolationId"
        ).textContent =
          "Select Violation";


        document.getElementById(
          "selectedViolationType"
        ).textContent =
          "—";


        document.getElementById(
          "selectedOffenseLevel"
        ).textContent =
          "—";


        document.getElementById(
          "selectedViolationRoad"
        ).textContent =
          "—";


        document.getElementById(
          "selectedViolationDateTime"
        ).textContent =
          "—";


        document.getElementById(
          "selectedViolationSubject"
        ).textContent =
          "—";


        document.getElementById(
          "selectedViolationPlate"
        ).textContent =
          "—";


        document.getElementById(
          "selectedViolationDescription"
        ).textContent =
          "Select a violation to view its details.";


        return;

      }


      let violation;


      try {

        violation =
          JSON.parse(
            selectedOption.dataset.violation
          );

      } catch (error) {

        console.error(
          "Failed to parse violation data:",
          error
        );

        Swal.fire({

          icon: "error",

          title: "Invalid Violation Data",

          text:
            "The selected violation could not be loaded."

        });

        return;

      }


      renderViolation(
        violation
      );

    }
  );


  /*
  ================================================================
  CREATE TICKET
  ================================================================
  */

  confirmCreateTicket.addEventListener(
    "click",
    async () => {

      /*
      --------------------------------------------------------------
      VIOLATION VALIDATION
      --------------------------------------------------------------
      */

      const selectedViolationOption =
        violationSelect.options[
          violationSelect.selectedIndex
        ];


      if (
        !selectedViolationOption ||
        !selectedViolationOption.value
      ) {

        Swal.fire({

          icon: "warning",

          title: "Violation Required",

          text:
            "Please select a verified violation."

        });

        return;

      }


      /*
      --------------------------------------------------------------
      OFFICER VALIDATION
      --------------------------------------------------------------
      */

      const selectedOfficerOption =
        officerSelect.options[
          officerSelect.selectedIndex
        ];


      if (
        !selectedOfficerOption ||
        !selectedOfficerOption.value
      ) {

        Swal.fire({

          icon: "warning",

          title: "Officer Required",

          text:
            "Please select an available officer."

        });

        return;

      }


      /*
      --------------------------------------------------------------
      DUE DATE
      --------------------------------------------------------------
      */

      const dueDate =
        dueDateInput.value;


      if (!dueDate) {

        Swal.fire({

          icon: "warning",

          title: "Due Date Required",

          text:
            "Please select a due date for this ticket."

        });

        return;

      }


      /*
      --------------------------------------------------------------
      ISSUED DATE
      --------------------------------------------------------------
      */

      const issuedAt =
        issuedAtInput.value;


      /*
      --------------------------------------------------------------
      VALIDATE DATE ORDER
      --------------------------------------------------------------
      */

      if (
        new Date(dueDate) <=
        new Date(issuedAt)
      ) {

        Swal.fire({

          icon: "warning",

          title: "Invalid Due Date",

          text:
            "The due date must be later than the ticket issue date."

        });

        return;

      }


      /*
      --------------------------------------------------------------
      FORMAT DATETIME FOR MYSQL
      --------------------------------------------------------------
      */

      const formattedIssuedAt =
        issuedAt
          ? issuedAt.replace(
              "T",
              " "
            ) + ":00"
          : null;


      const formattedDueDate =
        dueDate.replace(
          "T",
          " "
        ) + ":00";


      /*
      --------------------------------------------------------------
      TICKET DATA
      --------------------------------------------------------------
      */

      const ticketData = {

        violation_id:
          Number(
            selectedViolationOption.value
          ),

        officer_id:
          Number(
            selectedOfficerOption.value
          ),

        issued_at:
          formattedIssuedAt,

        due_date:
          formattedDueDate,

        notes:
          null

      };


      console.log(
        "Creating ticket:",
        ticketData
      );


      /*
      --------------------------------------------------------------
      DISABLE BUTTON
      --------------------------------------------------------------
      */

      confirmCreateTicket.disabled =
        true;


      confirmCreateTicket.innerHTML = `
        <i class="fas fa-spinner fa-spin"></i>
        Creating Ticket...
      `;


      /*
      --------------------------------------------------------------
      CREATE TICKET
      --------------------------------------------------------------
      */

      try {

        const result =
          await fetchCreateTicket(
            ticketData
          );


        console.log(
          "Ticket created:",
          result
        );


        await Swal.fire({

          icon: "success",

          title: "Ticket Created",

          html: `
            <p>
              The violation ticket has been created successfully.
            </p>

            <strong>
              Ticket ID:
              ${result.ticket.public_ticket_id}
            </strong>
          `,

          confirmButtonText:
            "Done"

        });


        closeModal();


      } catch (error) {

        console.error(
          "Create ticket failed:",
          error
        );


        Swal.fire({

          icon: "error",

          title: "Failed to Create Ticket",

          text:
            error.message ||
            "Something went wrong while creating the ticket."

        });


      } finally {

        confirmCreateTicket.disabled =
          false;


        confirmCreateTicket.innerHTML = `
          <i class="fas fa-ticket"></i>
          Create Ticket
        `;

      }

    }
  );

}