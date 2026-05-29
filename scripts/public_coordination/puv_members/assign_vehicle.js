

export function assignVehicleMember(modal) {
  modal.classList.remove("member-info-hidden");

  modal.innerHTML = `
    <div class="member-info-modal">
      <div class="member-info-header">
        <h2><i class="fas fa-user-edit"></i> Member Information</h2>
        <p>View or Update personnel details and vehicle assignments.</p>
      </div>

      <form id="editMemberForm" class="member-info-body">
        <div class="member-info-grid">
          <div class="member-info-group">
            <label>First Name</label>
            <input type="text" id="editFirstName">
          </div>
          <div class="member-info-group">
            <label>Middle Name</label>
            <input type="text" id="editMiddleName">
          </div>
          <div class="member-info-group">
            <label>Last Name</label>
            <input type="text" id="editLastName">
          </div>
        </div>

        <div class="member-info-grid info-two-cols">
          <div class="member-info-group">
            <label>Birthdate</label>
            <input type="date" id="editBirthDate">
          </div>
          <div class="member-info-group">
            <label>Contact Number</label>
            <input type="tel" id="editContactNum">
          </div>
        </div>

        <div class="member-info-grid info-two-cols">
          <div class="member-info-group">
            <label>Personnel Type</label>
            <select id="editPersonnelType">
              <option value="driver">Driver</option>
              <option value="conductor">Conductor</option>
              <option value="operator">Operator</option>
            </select>
          </div>
          <div class="member-info-group">
            <label>Verification Status</label>
            <select id="editVerificationStatus">
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        <hr class="member-info-divider">
        <div class="member-info-selection-label"><i class="fas fa-bus"></i> Vehicle Assignment</div>

        <div class="member-info-grid info-two-cols">
          <div class="member-info-group">
            <label>PUV Number (Fleet #)</label>
            <input type="text" id="editPuvNumber" placeholder="e.g. VCHL-101">
          </div>
          <div class="member-info-group">
            <label>Plate Number</label>
            <input type="text" id="editPlateNumber" placeholder="e.g. ABC-1234">
          </div>
        </div>

        <div class="member-info-footer">
          <button class="btn btn-outline-danger" id="closeEditModal">Cancel</button>
          <button type="submit" class="btn btn-success">Update Member</button>
        </div>
      </form>
    </div>
  `;

  const closeBtn = document.getElementById("closeEditModal");

  closeBtn.addEventListener("click", () => {
    modal.classList.add("member-info-hidden");

    setTimeout(() => {
      modal.innerHTML = '';
    }, 200);
  });
}