export async function renderAddMember(container) {
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
            <input type="text" placeholder="e.g. Juan" required>
          </div>
          <div class="form-group">
            <label>Middle Name</label>
            <input type="text" placeholder="e.g. Ramos">
          </div>
          <div class="form-group">
            <label>Last Name</label>
            <input type="text" placeholder="e.g. Dela Cruz" required>
          </div>
        </div>

        <div class="form-grid two-cols">
          <div class="form-group">
            <label>Birthdate</label>
            <input type="date" required>
          </div>
          <div class="form-group">
            <label>Contact Number</label>
            <input type="tel" placeholder="09XXXXXXXXX" required>
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
            <select class="status-select">
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        <hr class="form-divider">

        <div id="nonDriverFields" class="form-group">
          <label>Personnel Type</label>
          <select>
            <option value="conductor">Conductor</option>
            <option value="operator">Operator</option>
          </select>
        </div>

        <div id="driverFields" class="form-grid two-cols hidden-fields">
          <div class="form-group">
            <label>License Number</label>
            <input type="text" placeholder="ABC-DE-FGHIJK">
          </div>
          <div class="form-group">
            <label>License Type</label>
            <select>
              <option value="professional">Professional</option>
              <option value="non-professional">Non-Professional</option>
            </select>
          </div>
        </div>

        <div class="modal-footer">
          <button type="submit" class="btn btn-primary btn-full">Save Member</button>
        </div>
      </form>
    </div>
  `;

  const exitAddMemberBtn = document.querySelector(".js-exit-add-member");

  exitAddMemberBtn.addEventListener("click", () => {
    container.classList.add("add-member-hidden");

    container.innerHTML = '';
  });
}