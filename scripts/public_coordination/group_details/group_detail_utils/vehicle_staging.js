export function renderVehicleStagingSelection(container) {

  const vehicleLocationItem =
    container.querySelector("#puvVehicleStagingItem");

  if (!vehicleLocationItem) {
    return;
  }

  vehicleLocationItem.innerHTML = `
    <span class="puv-info-label">
      Official Vehicle Location
    </span>

    <div class="puv-location-fields">

      <div class="puv-location-field">

        <span class="puv-info-label">
          Road Name
        </span>

        <input
          type="text"
          id="puvVehicleRoadName"
          class="puv-location-input"
          placeholder="Select a location on map"
          readonly
        >

      </div>

      <div class="puv-location-field">

        <span class="puv-info-label">
          Specific Location
        </span>

        <input
          type="text"
          id="puvVehicleSpecificLocation"
          class="puv-location-input"
          placeholder="Select a location on map"
          readonly
        >

      </div>

      <div class="puv-location-actions">

        <button
          type="button"
          class="puv-location-cancel-btn"
          id="cancelPuvVehicleStaging"
        >
          <i class="fas fa-xmark"></i>
          Cancel
        </button>

      </div>

    </div>
  `;

  const cancelButton =
    container.querySelector("#cancelPuvVehicleStaging");

  if (cancelButton) {

    cancelButton.addEventListener("click", () => {
      renderVehicleStagingButton(container);
    });

  }
}


export function renderVehicleStagingButton(container) {

  const vehicleLocationItem =
    container.querySelector("#puvVehicleStagingItem");

  if (!vehicleLocationItem) {
    return;
  }

  vehicleLocationItem.innerHTML = `
    <span class="puv-info-label">
      Official Vehicle Location
    </span>

    <button
      type="button"
      class="puv-location-action-btn"
      id="puvVehicleStaging"
    >
      <i class="fas fa-location-dot"></i>
      Set Vehicle Staging
    </button>
  `;

  const vehicleStagingButton =
    container.querySelector("#puvVehicleStaging");

  if (vehicleStagingButton) {

    vehicleStagingButton.addEventListener("click", () => {
      renderVehicleStagingSelection(container);
    });

  }
}