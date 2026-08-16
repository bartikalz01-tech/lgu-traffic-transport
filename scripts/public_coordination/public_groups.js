export function openPublicTransportCoordination(container) {

  container.innerHTML = `
    <div class="ptc-page">

      <!-- HEADER -->
      <div class="ptc-page-header">

        <div>
          <span class="ptc-module-label">
            Public Transport Coordination
          </span>

          <h2 class="ptc-page-title">
            PUV Group Coordination
          </h2>

          <p class="ptc-page-description">
            Register and manage public transport groups operating
            within the barangay.
          </p>
        </div>

        <button
          type="button"
          class="ptc-primary-btn"
          id="registerPuvGroupBtn"
        >
          <i class="fas fa-plus"></i>
          Register PUV Group
        </button>

      </div>


      <!-- SUMMARY CARDS -->
      <div class="ptc-summary-grid">

        <div class="ptc-summary-card">

          <div class="ptc-summary-icon">
            <i class="fas fa-users"></i>
          </div>

          <div>
            <span class="ptc-summary-label">
              Registered PUV Groups
            </span>

            <strong
              class="ptc-summary-value"
              id="registeredPuvGroups"
            >
              0
            </strong>
          </div>

        </div>


        <div class="ptc-summary-card">

          <div class="ptc-summary-icon active">
            <i class="fas fa-check-circle"></i>
          </div>

          <div>
            <span class="ptc-summary-label">
              Active Groups
            </span>

            <strong
              class="ptc-summary-value"
              id="activePuvGroups"
            >
              0
            </strong>
          </div>

        </div>


        <div class="ptc-summary-card">

          <div class="ptc-summary-icon pending">
            <i class="fas fa-clock"></i>
          </div>

          <div>
            <span class="ptc-summary-label">
              Pending Coordination
            </span>

            <strong
              class="ptc-summary-value"
              id="pendingPuvGroups"
            >
              0
            </strong>
          </div>

        </div>


        <div class="ptc-summary-card">

          <div class="ptc-summary-icon location">
            <i class="fas fa-location-dot"></i>
          </div>

          <div>
            <span class="ptc-summary-label">
              Registered Locations
            </span>

            <strong
              class="ptc-summary-value"
              id="registeredPuvLocations"
            >
              0
            </strong>
          </div>

        </div>

      </div>


      <!-- REGISTERED GROUPS -->
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
              <!--<tr class="ptc-empty-row">
                <td colspan="8">
                  <div class="ptc-empty-state">

                    <div class="ptc-empty-icon">
                      <i class="fas fa-bus"></i>
                    </div>

                    <h4>
                      No PUV Groups Registered
                    </h4>

                    <p>
                      Register a PUV group to begin
                      public transport coordination.
                    </p>

                    <button
                      type="button"
                      class="ptc-secondary-btn"
                      id="emptyRegisterPuvBtn"
                    >
                      <i class="fas fa-plus"></i>
                      Register PUV Group
                    </button>
                  </div>
                </td>
              </tr>-->

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
                  <strong>San Isidro Jeepney Operators Association</strong>
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
                  <strong>Central UV Express Association</strong>
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

    </div>


    <!-- REGISTER PUV MODAL -->
    <div
      class="ptc-modal-overlay ptc-modal-hidden"
      id="registerPuvModal"
    >

      <div class="ptc-modal">

        <div class="ptc-modal-header">

          <div>

            <span class="ptc-modal-label">
              Public Transport
            </span>

            <h3>
              Register PUV Group
            </h3>

            <p>
              Record the basic information of a PUV group
              operating within the barangay.
            </p>

          </div>

          <button
            type="button"
            class="ptc-modal-close"
            id="closeRegisterPuvModal"
          >
            <i class="fas fa-times"></i>
          </button>

        </div>


        <form id="registerPuvForm">

          <!-- GROUP INFORMATION -->
          <div class="ptc-form-section">

            <div class="ptc-form-section-header">

              <div>
                <h4>
                  <i class="fas fa-users"></i>
                  PUV Group Information
                </h4>

                <p>
                  Identify the transport group or association.
                </p>
              </div>

              <span class="ptc-required-badge">
                Required Information
              </span>

            </div>


            <div class="ptc-form-grid">

              <div class="ptc-form-group ptc-full-width">

                <label>
                  Group / Association Name
                  <span>*</span>
                </label>

                <input
                  type="text"
                  id="puvGroupName"
                  class="ptc-form-control"
                  placeholder="e.g. Mabini TODA"
                  required
                >

              </div>


              <div class="ptc-form-group">

                <label>
                  PUV Type
                  <span>*</span>
                </label>

                <select
                  id="puvType"
                  class="ptc-form-control"
                  required
                >

                  <option value="">
                    Select PUV Type
                  </option>

                  <option value="Tricycle / TODA">
                    Tricycle / TODA
                  </option>

                  <option value="Jeepney">
                    Jeepney
                  </option>

                  <option value="UV Express">
                    UV Express
                  </option>

                  <option value="Bus">
                    Bus
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>


              <div class="ptc-form-group">

                <label>
                  Number of Units
                </label>

                <input
                  type="number"
                  id="puvUnitCount"
                  class="ptc-form-control"
                  min="0"
                  placeholder="e.g. 25"
                >

              </div>

            </div>

          </div>


          <!-- REPRESENTATIVE -->
          <div class="ptc-form-section">

            <div class="ptc-form-section-header">

              <div>
                <h4>
                  <i class="fas fa-user"></i>
                  Group Representative
                </h4>

                <p>
                  Person authorized to coordinate with the barangay.
                </p>
              </div>

            </div>


            <div class="ptc-form-grid">

              <div class="ptc-form-group">

                <label>
                  Representative Name
                  <span>*</span>
                </label>

                <input
                  type="text"
                  id="puvRepresentative"
                  class="ptc-form-control"
                  placeholder="Full name"
                  required
                >

              </div>


              <div class="ptc-form-group">

                <label>
                  Contact Number
                  <span>*</span>
                </label>

                <input
                  type="tel"
                  id="puvContact"
                  class="ptc-form-control"
                  placeholder="09XXXXXXXXX"
                  required
                >

              </div>


              <div class="ptc-form-group ptc-full-width">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  id="puvEmail"
                  class="ptc-form-control"
                  placeholder="Optional"
                >

              </div>

            </div>

          </div>


          <!-- OPERATION LOCATION -->
          <div class="ptc-form-section">

            <div class="ptc-form-section-header">

              <div>
                <h4>
                  <i class="fas fa-location-dot"></i>
                  Operation Information
                </h4>

                <p>
                  Record where the group operates or coordinates
                  its local loading / terminal activity.
                </p>
              </div>

            </div>


            <div class="ptc-form-grid">

              <div class="ptc-form-group">

                <label>
                  Assigned Area / Destination
                  <span>*</span>
                </label>

                <input
                  type="text"
                  id="puvAssignedArea"
                  class="ptc-form-control"
                  placeholder="e.g. Barangay Public Market"
                  required
                >

              </div>


              <div class="ptc-form-group">

                <label>
                  Street / Road
                  <span>*</span>
                </label>

                <input
                  type="text"
                  id="puvStreet"
                  class="ptc-form-control"
                  placeholder="e.g. Rizal Street"
                  required
                >

              </div>


              <div class="ptc-form-group ptc-full-width">

                <label>
                  Current Terminal / Loading Area
                </label>

                <input
                  type="text"
                  id="puvTerminal"
                  class="ptc-form-control"
                  placeholder="Optional — e.g. Barangay Market Entrance"
                >

              </div>


              <div class="ptc-form-group ptc-full-width">

                <label>
                  Remarks
                </label>

                <textarea
                  id="puvRemarks"
                  class="ptc-form-control ptc-textarea"
                  rows="3"
                  placeholder="Additional information or coordination notes..."
                ></textarea>

              </div>

            </div>

          </div>


          <!-- ACTIONS -->
          <div class="ptc-modal-actions">

            <button
              type="button"
              class="ptc-cancel-btn"
              id="cancelRegisterPuvBtn"
            >
              Cancel
            </button>

            <button
              type="submit"
              class="ptc-primary-btn"
            >
              <i class="fas fa-save"></i>
              Register PUV Group
            </button>

          </div>

        </form>

      </div>

    </div>
  `;


  // --------------------------------------------------
  // ELEMENTS
  // --------------------------------------------------

  const modal =
    container.querySelector("#registerPuvModal");

  const registerBtn =
    container.querySelector("#registerPuvGroupBtn");

  const emptyRegisterBtn =
    container.querySelector("#emptyRegisterPuvBtn");

  const closeModalBtn =
    container.querySelector("#closeRegisterPuvModal");

  const cancelBtn =
    container.querySelector("#cancelRegisterPuvBtn");

  const form =
    container.querySelector("#registerPuvForm");

  const searchInput =
    container.querySelector("#ptcSearchInput");


  // --------------------------------------------------
  // MODAL
  // --------------------------------------------------

  function openRegisterModal() {
    modal.classList.remove("ptc-modal-hidden");
  }

  function closeRegisterModal() {
    modal.classList.add("ptc-modal-hidden");
  }


  registerBtn.addEventListener(
    "click",
    openRegisterModal
  );

  emptyRegisterBtn.addEventListener(
    "click",
    openRegisterModal
  );

  closeModalBtn.addEventListener(
    "click",
    closeRegisterModal
  );

  cancelBtn.addEventListener(
    "click",
    closeRegisterModal
  );


  modal.addEventListener("click", event => {

    if (event.target === modal) {
      closeRegisterModal();
    }

  });


  // --------------------------------------------------
  // FORM
  // --------------------------------------------------

  form.addEventListener("submit", event => {

    event.preventDefault();

    const formData = {

      group_name:
        container.querySelector("#puvGroupName").value.trim(),

      puv_type:
        container.querySelector("#puvType").value,

      unit_count:
        container.querySelector("#puvUnitCount").value,

      representative:
        container.querySelector("#puvRepresentative").value.trim(),

      contact_number:
        container.querySelector("#puvContact").value.trim(),

      email:
        container.querySelector("#puvEmail").value.trim(),

      assigned_area:
        container.querySelector("#puvAssignedArea").value.trim(),

      street:
        container.querySelector("#puvStreet").value.trim(),

      terminal:
        container.querySelector("#puvTerminal").value.trim(),

      remarks:
        container.querySelector("#puvRemarks").value.trim()

    };


    console.log(
      "[PUV] Registration data:",
      formData
    );


    Swal.fire({
      icon: "success",
      title: "PUV Group Registered",
      text: `${formData.group_name} has been registered successfully.`,
      confirmButtonText: "OK"
    });


    form.reset();

    closeRegisterModal();

  });


  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

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

        if (
          row.classList.contains(
            "ptc-empty-row"
          )
        ) {
          return;
        }

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