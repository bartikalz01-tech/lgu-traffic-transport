import { fetchVerifiedViolations } from "../data/tickets/fetch_tickets.js";

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
            PERSON INFORMATION
            ========================================================= -->

        <!--<section class="ticket-form-section">

          <div class="ticket-section-header">

            <div>
              <h3>Person Information</h3>

              <p>
                Enter the information collected by the barangay officer
                at the violation location.
              </p>
            </div>

          </div>


          <div class="ticket-person-notice">

            <i class="fas fa-circle-info"></i>

            <span>
              The person record will be associated with this ticket.
              Existing persons can be reused when available.
            </span>

          </div>


          <div class="ticket-form-grid">

            <div class="ticket-form-group">

              <label for="ticketFirstName">
                First Name
              </label>

              <input
                type="text"
                id="ticketFirstName"
                placeholder="Enter first name"
              >

            </div>


            <div class="ticket-form-group">

              <label for="ticketMiddleName">
                Middle Name
              </label>

              <input
                type="text"
                id="ticketMiddleName"
                placeholder="Enter middle name"
              >

            </div>


            <div class="ticket-form-group">

              <label for="ticketLastName">
                Last Name
              </label>

              <input
                type="text"
                id="ticketLastName"
                placeholder="Enter last name"
              >

            </div>


            <div class="ticket-form-group">

              <label for="ticketContactNumber">
                Contact Number
              </label>

              <input
                type="text"
                id="ticketContactNumber"
                placeholder="09XXXXXXXXX"
              >

            </div>


            <div class="ticket-form-group ticket-form-group-full">

              <label for="ticketAddress">
                Address
              </label>

              <input
                type="text"
                id="ticketAddress"
                placeholder="Enter complete address"
              >

            </div>

          </div>

        </section>-->


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

                  <option value="1">
                    John Doe
                  </option>

                  <option value="2">
                    Pedro Penduko
                  </option>

                  <option value="3">
                    Mario Balasbas
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
                Set the settlement deadline and add any relevant notes.
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
              >

              <small class="ticket-field-help">
                Automatically set when the ticket is created.
              </small>

            </div>


            <div class="ticket-form-group">

              <label for="ticketDueDate">
                Due Date
              </label>

              <input
                type="date"
                id="ticketDueDate"
              >

            </div>


            <div class="ticket-form-group ticket-form-group-full">

              <label for="ticketNotes">
                Notes
              </label>

              <textarea
                id="ticketNotes"
                rows="4"
                placeholder="Enter additional notes regarding this ticket..."
              ></textarea>

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

  container.classList.remove("create-ticket-hidden");

  const closeButton = document.getElementById("closeCreateTicket");
  const cancelButton = document.getElementById("cancelCreateTicket");
  const violationSelect = document.getElementById("ticketViolationSelect");
  const violationCard = document.getElementById("ticketViolationCard");

  function closeModal() {
    container.classList.add("create-ticket-hidden");
    container.innerHTML = "";
  }

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

  function formatViolationDateTime(
    datetime
  ) {

    if (!datetime) {
      return "—";
    }

    const date =
      new Date(
        datetime.replace(" ", "T")
      );

    if (Number.isNaN(date.getTime())) {
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

  closeButton.addEventListener("click", closeModal);
  cancelButton.addEventListener("click", closeModal);

  // Close when clicking the dark overlay
  container.addEventListener("click", (event) => {

    if (event.target === container) {
      closeModal();
    }

  });


  // Close with Escape key
  document.addEventListener("keydown", function handleEscape(event) {

    if (
      event.key === "Escape" &&
      !container.classList.contains("create-ticket-hidden")
    ) {

      closeModal();

      document.removeEventListener(
        "keydown",
        handleEscape
      );

    }

  });


  try {

    const violations =
      await fetchVerifiedViolations();

    violations.forEach(violation => {

      const option =
        document.createElement("option");

      option.value =
        violation.violation_id;

      option.textContent =
        `${violation.public_violation_id} — ${violation.violation_type}`;

      option.dataset.violation =
        JSON.stringify(violation);

      violationSelect.appendChild(option);

    });

  } catch(error) {

    Swal.fire({

      icon: "error",

      title: "Failed to Load Violations",

      text: error.message

    });

  }


  violationSelect.addEventListener("change", () => {

    const selectedOption =
      violationSelect.options[
        violationSelect.selectedIndex
      ];


    if (!selectedOption.value) {

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


    const violation =
      JSON.parse(
        selectedOption.dataset.violation
      );


    renderViolation(violation);

  });
  
}