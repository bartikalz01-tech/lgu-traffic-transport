export function renderAddGroup(container) {

  container.innerHTML = `
    <button class="exit-add-puv-group js-exit-puv-group">
      <i class="fas fa-times"></i>
    </button>

    <div class="add-group-modal">
      <div class="modal-header">
        <h2><i class="fas fa-folder-plus"></i> Register New PUV Group</h2>
        <p>Fill in the details to coordinate a new transport cooperative or association.</p>
      </div>

      <div class="modal-body">
        <div class="modal-form-part">
          <div class="input-group">
            <label for="groupName">PUV Group Name</label>
            <input type="text" id="groupName" placeholder="e.g. Orion Transport Coop">
          </div>

          <div class="input-group">
            <label for="vehicleType">Primary Vehicle Type</label>
            <select id="vehicleType">
              <option value="" disabled selected>Select vehicle type</option>
              <option value="jeepney">Jeepney</option>
              <option value="modern-jeepney">Modern Jeepney</option>
              <option value="bus">Bus</option>
              <option value="tricycle">Tricycle</option>
            </select>
          </div>

          <div class="input-group">
            <label for="terminalAddress">Terminal Address</label>
            <textarea id="terminalAddress" rows="3" placeholder="Enter specific location or landmark"></textarea>
          </div>

          <div class="modal-actions">
            <button class="btn btn-outline-danger js-exit-puv-group">Cancel</button>
            <button class="btn btn-primary" id="saveGroup">Confirm Registration</button>
          </div>
        </div>

        <div class="modal-map-part">
          <div class="map-label">
            <span><i class="fas fa-map-marker-alt"></i> Pin Terminal Location</span>
            <small>Click on the map to set the coordinates</small>
          </div>
          <div id="add-group-map-placeholder" class="map-visual-area">
            <div class="map-mock-ui">
              <i class="fas fa-location-dot"></i>
              <p>Map Preview Area</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const exitBtns = container.querySelectorAll(".js-exit-puv-group");

  exitBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      container.classList.add("add-puv-group-hidden");

      container.innerHTML = '';
    });
  });
}