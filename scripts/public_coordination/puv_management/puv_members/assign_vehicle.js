import { assignVehicle, getVehiclesByGroup, retirePuvMember } from "../../../data/fetch_public_group_trans.js";


export async function assignVehicleMember(modal, member, refreshMembers) {
  modal.classList.remove("member-info-hidden");

  modal.innerHTML = `
    <div class="member-info-modal">
      <div class="member-info-header">
        <h2><i class="fas fa-user-edit"></i> Member Information</h2>
        <p>View or Update personnel details and vehicle assignments.</p>
      </div>

      <form id="editMemberForm" class="member-info-body">
        <input type="hidden" id="personnelId" value="${member.personnel_id}">
        <input type="hidden" id="puvMemberId" value="${member.puv_member_id}">

        <div class="member-info-grid">
          <div class="member-info-group">
            <label>First Name</label>
            <input type="text" id="editFirstName" value="${member.first_name || ''}">
          </div>
          <div class="member-info-group">
            <label>Middle Name</label>
            <input type="text" id="editMiddleName" value="${member.middle_name || ''}">
          </div>
          <div class="member-info-group">
            <label>Last Name</label>
            <input type="text" id="editLastName" value="${member.last_name || ''}">
          </div>
        </div>

        <div class="member-info-grid info-two-cols">
          <div class="member-info-group">
            <label>Birthdate</label>
            <input type="date" id="editBirthDate" value="${member.birth_date || ''}">
          </div>
          <div class="member-info-group">
            <label>Contact Number</label>
            <input type="tel" id="editContactNum" value="${member.contact_number || ''}">
          </div>
        </div>

        <div class="member-info-grid info-two-cols">
          <div class="member-info-group">
            <label>Personnel Type</label>
            <select id="editPersonnelType">
              <option value="driver" ${member.personnel_type === "driver" ? "selected" : ""}>Driver</option>
              <option value="conductor" ${member.personnel_type === "conductor" ? "selected" : ""}>Conductor</option>
              <option value="operator" ${member.personnel_type === "operator" ? "selected" : ""}>Operator</option>
            </select>
          </div>
          <div class="member-info-group">
            <label>Verification Status</label>
            <select id="editVerificationStatus">
              <option value="pending" ${member.verification_status === "pending" ? "selected" : ""}>Pending</option>
              <option value="verified" ${member.verification_status === "verified" ? "selected" : ""}>Verified</option>
              <option value="suspended" ${member.verification_status === "suspended" ? "selected" : ""}>Suspended</option>
              <option value="retired" ${member.verification_status === "retired" ? "selected" : ""}>Retired</option>
            </select>
          </div>
        </div>

        ${member.personnel_type === "driver" ? `
          <div class="member-info-grid info-two-cols">
            <div class="member-info-group">
              <label>License Number</label>
              <input type="text" id="editLicenseNum" value="${member.license_number ?? ""}">
            </div>
            <div class="member-info-group">
              <label>License Type</label>
              <input type="text" id="editLicenseType" value="${member.license_type ?? ""}"> 
            </div>
          </div>
        ` : ''}

        <hr class="member-info-divider">
        <div class="member-info-selection-label"><i class="fas fa-bus"></i> Vehicle Assignment</div>

        <div class="member-info-grid info-two-cols">
          <div class="member-info-group">
            <label>PUV Number (Fleet #)</label>
            <input type="text" id="editPuvNumber" list="fleetListId" placeholder="e.g. VCHL-101" value="${member.vehicle_number ?? ''}">
            <datalist id="fleetListId"></datalist>
          </div>
          <div class="member-info-group">
            <label>Plate Number</label>
            <input type="text" id="editPlateNumber" list="plateListId" placeholder="e.g. ABC-1234" value="${member.plate_number ?? ''}">
            <datalist id="plateListId"></datalist>
          </div>
        </div>

        <div class="member-info-footer">
          <button type="button" class="btn btn-outline-danger" id="closeEditModal">Cancel</button>
          <button type="submit" class="btn btn-success">Update Member</button>
        </div>
      </form>
    </div>
  `;

  const fleetList = document.getElementById("fleetListId");
  const plateList = document.getElementById("plateListId");

  const vehicleNumberInput = document.getElementById("editPuvNumber");
  const plateNumberInput = document.getElementById("editPlateNumber");

  const vehicleResult = await getVehiclesByGroup(member.puv_group_id);

  let vehicles = [];

  if(vehicleResult.status === "success") {
    vehicles = vehicleResult.data;

    fleetList.innerHTML = vehicles.map(vehicle => `
      <option value="${vehicle.vehicle_number}">
    `).join("");

    plateList.innerHTML = vehicles.map(vehicle => `
      <option value="${vehicle.plate_number}">  
    `);
  }

  vehicleNumberInput.addEventListener("input", () => {
    const selectedVehicle = vehicles.find(vehicle => 
      vehicle.vehicle_number === vehicleNumberInput.value
    );

    if(selectedVehicle) {
      plateNumberInput.value = selectedVehicle.plate_number;
    } else {
      plateNumberInput.value = "";
    }
  });


  const form = document.getElementById("editMemberForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    /*const payload = {
      personnel_id: member.personnel_id,
      puv_member_id: member.puv_member_id,

      first_name: document.getElementById("editFirstName").value,
      middle_name: document.getElementById("editMiddleName").value,
      last_name: document.getElementById("editLastName").value,

      birth_date: document.getElementById("editBirthDate").value,
      contact_number: document.getElementById("editContactNum").value,

      personnel_type: document.getElementById("editPersonnelType").value,
      verification_status: document.getElementById("editVerificationStatus").value,

      license_number: document.getElementById("editLicenseNum")?.value ?? "",
      license_type: document.getElementById("editLicenseType")?.value ?? "",

      puv_vehicle_number: document.getElementById("editPuvNumber").value,
      puv_plate_number: document.getElementById("editPlateNumber").value
    };*/

    let operationSuccess = false;

    const verificationStatus = document.getElementById("editVerificationStatus").value;

    const vehiclePayload = {
      personnel_id: member.personnel_id,
      puv_group_id: member.puv_group_id,

      vehicle_number: document.getElementById("editPuvNumber").value,
      plate_number: document.getElementById("editPlateNumber").value
    };

    if(verificationStatus === "retired") {
      const retireResult = await retirePuvMember({
        personnel_id: member.personnel_id
      })

      if(retireResult.status === "success") {
        operationSuccess = true;
      }

    } else if(vehiclePayload.vehicle_number && vehiclePayload.plate_number) {
      const assignVehicleResult = await assignVehicle(vehiclePayload);

      if(assignVehicleResult.status === "success") {
        operationSuccess = true;

        await Swal.fire({
          icon: "success",
          title: "Vehicle Assigned",
          text: assignVehicleResult.message,
          confirmButtonColor: "#2563eb"
        });

        modal.classList.add("member-info-hidden");

        setTimeout(() => {
          modal.innerHTML = '';
        }, 200);
      }
    }

    if(operationSuccess) {
      await refreshMembers();
    }
    
  });


  const closeBtn = document.getElementById("closeEditModal");

  closeBtn.addEventListener("click", () => {
    modal.classList.add("member-info-hidden");

    setTimeout(() => {
      modal.innerHTML = '';
    }, 200);
  });
}