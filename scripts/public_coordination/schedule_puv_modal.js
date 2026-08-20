import { insertPuvGroup } from "../data/fetch_public_group_trans.js";

export function renderSchedulePuvModal(container) {

  container.innerHTML = `
    <div
      class="ptc-modal-overlay ptc-modal-hidden"
      id="registerPuvModal"
    >

      <div class="ptc-modal">

        <div class="ptc-modal-header">

          <div>

            <span class="ptc-modal-label">
              Public Transport Coordination
            </span>

            <h3>
              Schedule Coordination Meeting
            </h3>

            <p>
              Schedule a coordination meeting with the PUV Group
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


              <div class="ptc-form-group ptc-full-width">

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
                  <i class="fas fa-calendar-days"></i> Meeting Schedule
                <h4>

                <p>
                  Select the date and time for the coordination meeting.
                </p>
              </div>

              <span class="ptc-required-badge">
                Required Information
              </span>
            </div>

            <div class="ptc-form-grid">
              <div class="ptc-form-group">
                <label>
                  Meeting Date
                  <span>*</span>
                </label>

                <input type="date" id="meetingDate" class="ptc-form-control" required>
              </div>

              <div class="ptc-form-group">
                <label>
                  Meeting Time
                  <span>*</span>
                </label>

                <input type="time" id="meetingTime" class="ptc-form-control" required>
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
              Schedule PUV Group
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


  form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const puvGroupName = container.querySelector('#puvGroupName').value;
      const puvType = container.querySelector('#puvType').value;
      const puvRepresentative = container.querySelector('#puvRepresentative').value;
      const puvContactNum = container.querySelector('#puvContact').value;
      const puvEmail = container.querySelector('#puvEmail').value || null;
      const meetingDate = container.querySelector('#meetingDate').value;
      const meetingTime = container.querySelector('#meetingTime').value;

      const payload = {
        group_name: puvGroupName,
        puv_type: puvType,
        representative_name: puvRepresentative,
        contact_number: puvContactNum,
        meeting_date: meetingDate,
        meeting_time: meetingTime
      };


      console.log(
        "[PUV] Registration data:",
        payload
      );

      try {

        const data = await insertPuvGroup(payload);

        await Swal.fire({
          icon: "success",
          title: "PUV Group Registered",
          text: `${payload.group_name} has been registered successfully.`,
          confirmButtonText: "OK"
        });

        form.reset();

        closeModal();

      } catch(error) {
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: error.message || "Unable to schedule PUV Group.",
          confirmButtonText: "OK"
        });
      }

  });


  return {
    openModal,
    closeModal
  };

}