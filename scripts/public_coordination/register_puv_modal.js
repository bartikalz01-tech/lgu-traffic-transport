export function renderRegisterPuvModal(container) {

  container.innerHTML = `
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


          <div class="ptc-modal-actions">

            <button
              type="button"
              class="ptc-cancel-btn"
              id="cancelRegisterPuvBtn"
            >
              Cancel
            </button>

            <button type="submit" class="ptc-primary-btn">
              <i class="fas fa-save"></i>
              Register PUV Group
            </button>
          </div>
        </form>
      </div>
    </div>
  `;


  const modal =
    container.querySelector("#registerPuvModal");

  const closeBtn =
    container.querySelector("#closeRegisterPuvModal");

  const cancelBtn =
    container.querySelector("#cancelRegisterPuvBtn");

  const form =
    container.querySelector("#registerPuvForm");


  function openModal() {
    modal.classList.remove("ptc-modal-hidden");
  }


  function closeModal() {
    modal.classList.add("ptc-modal-hidden");
  }


  closeBtn.addEventListener(
    "click",
    closeModal
  );


  cancelBtn.addEventListener(
    "click",
    closeModal
  );


  modal.addEventListener(
    "click",
    event => {

      if(event.target === modal) {
        closeModal();
      }

    }
  );


  form.addEventListener(
    "submit",
    event => {

      event.preventDefault();

      const formData = {

        group_name:
          form.querySelector("#puvGroupName").value.trim(),

        puv_type:
          form.querySelector("#puvType").value,

        unit_count:
          form.querySelector("#puvUnitCount").value,

        representative:
          form.querySelector("#puvRepresentative").value.trim(),

        contact_number:
          form.querySelector("#puvContact").value.trim(),

        email:
          form.querySelector("#puvEmail").value.trim(),

        assigned_area:
          form.querySelector("#puvAssignedArea").value.trim(),

        street:
          form.querySelector("#puvStreet").value.trim(),

        terminal:
          form.querySelector("#puvTerminal").value.trim(),

        remarks:
          form.querySelector("#puvRemarks").value.trim()

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

      closeModal();

    }
  );


  return {
    openModal,
    closeModal
  };

}