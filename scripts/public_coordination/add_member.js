import { insertPuvMember } from "../data/fetch_public_group_trans.js";

export async function renderAddMember(container, selectedGroupId) {
  container.innerHTML = `
    <button class="exit-add-member-btn js-exit-add-member">
      <i class="fas fa-times"></i>
    </button>

    <div class="add-member-modal">
      <div class="member-modal-header">
        <h2><i class="fas fa-user-plus"></i> Add New PUV Member</h2>
        <p>Fill in the details to register a new personnel to the group.</p>
      </div>

      <form id="addMemberForm" class="member-modal-body">
        <div class="form-grid">
          <div class="form-group">
            <label>First Name</label>
            <input type="text" id="firstName" placeholder="e.g. Juan" required>
          </div>
          <div class="form-group">
            <label>Middle Name</label>
            <input type="text" id="middleName" placeholder="e.g. Ramos">
          </div>
          <div class="form-group">
            <label>Last Name</label>
            <input type="text" id="lastName" placeholder="e.g. Dela Cruz" required>
          </div>
        </div>

        <div class="form-grid two-cols">
          <div class="form-group">
            <label>Birthdate</label>
            <input type="date" id="birthDate" required>
          </div>
          <div class="form-group">
            <label>Contact Number</label>
            <input type="tel" id="contactNum" placeholder="09XXXXXXXXX" required>
          </div>
        </div>

        <div class="form-grid two-cols">
          <div class="form-group">
            <label>Is this member a Driver?</label>
            <select id="isDriverSelect">
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          <div class="form-group">
            <label>Verification Status</label>
            <select class="status-select" id="verificationStatus">
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        <hr class="form-divider">

        <div id="nonDriverFields" class="form-group">
          <label>Personnel Type</label>
          <select id="personnelType">
            <option value="conductor">Conductor</option>
            <option value="operator">Operator</option>
          </select>
        </div>

        <div id="driverFields" class="form-grid two-cols hidden-fields">
          <div class="form-group">
            <label>License Number</label>
            <input type="text" id="licenseNum" placeholder="ABC-DE-FGHIJK">
          </div>
          <div class="form-group">
            <label>License Type</label>
            <select id="licenseType">
              <option value="professional">Professional</option>
              <option value="non-professional">Non-Professional</option>
            </select>
          </div>
        </div>

        <div class="modal-footer">
          <button type="submit" class="btn btn-primary btn-full" id="saveMember">Save Member</button>
        </div>
      </form>
    </div>
  `;

  const isDriverSelect = document.getElementById("isDriverSelect");

  const nonDriverFields = document.getElementById("nonDriverFields");
  const driverFields = document.getElementById("driverFields");

  isDriverSelect.addEventListener("change", () => {
    const isDriver = isDriverSelect.value;

    if(isDriver === "yes") {
      nonDriverFields.classList.add("hidden-fields");

      driverFields.classList.remove("hidden-fields");
    } else {
      nonDriverFields.classList.remove("hidden-fields");

      driverFields.classList.add("hidden-fields");
    }
  });


  document.getElementById("addMemberForm").addEventListener("submit", async (e) => {

    e.preventDefault();

    const firstName = document.getElementById("firstName").value;
    const middleName = document.getElementById("middleName").value;
    const lastName = document.getElementById("lastName").value;

    const birthDate = document.getElementById("birthDate").value;
    const contactNum = document.getElementById("contactNum").value;

    const verificationStatus = document.getElementById("verificationStatus").value;

    const isDriver = document.getElementById("isDriverSelect").value;

    let personnelType = '';
    let licenseNum = null;
    let licenseType = null;

    if(isDriver === "yes") {
      personnelType = "driver";
      licenseNum = document.getElementById("licenseNum").value;
      licenseType = document.getElementById("licenseType").value;
    } else {
      personnelType = document.getElementById("personnelType").value;
    }

    const payload = {
      puv_group_id: selectedGroupId,
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      birth_date: birthDate,
      contact_number: contactNum,
      personnel_type: personnelType,
      verification_status: verificationStatus,
      license_number: licenseNum,
      license_type: licenseType
    };

    const result = await insertPuvMember(payload);

    if(result.status === "success") {
      Swal.fire({
        icon: "success",
        title: "Member Added",
        text: result.message,
        confirmButtonColor: "#2563eb"
      });

      document.activeElement.blur();

      container.classList.add("add-member-hidden");

      setTimeout(() => {
        container.innerHTML = '';
      }, 200);
    } else {

      Swal.fire({
        icon: "error",
        title: "Failed",
        text: result.message || "Something went wrong"
      });
    }

  });


  const exitAddMemberBtn = document.querySelector(".js-exit-add-member");

  exitAddMemberBtn.addEventListener("click", () => {
    document.activeElement.blur();

    container.classList.add("add-member-hidden");

    container.innerHTML = '';
  });
}