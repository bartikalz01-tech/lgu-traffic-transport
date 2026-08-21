import {
  enablePuvLocationSelection,
  disablePuvLocationSelection
} from "../puv_group_map.js";

let vehicleStagingLocation = null;

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

        <button type="button" class="puv-location-save-btn" id="savePuvVehicleStaging">
          <i class="fas fa-check"></i>
          Save Vehicle Staging
        </button>
      </div>

    </div>
  `;

  const roadInput = 
    container.querySelector("#puvVehicleRoadName");

  const locationInput =
    container.querySelector("#puvVehicleSpecificLocation");

  enablePuvLocationSelection(
    (location) => {

      roadInput.value =
        location.roadName ||
        "Unnamed Road";


      locationInput.value =
        location.locationName ||
        location.displayName ||
        "Selected map location";


      vehicleLocationItem.dataset.latitude =
        location.latitude;


      vehicleLocationItem.dataset.longitude =
        location.longitude;


      vehicleLocationItem.dataset.roadName =
        location.roadName || "";


      vehicleLocationItem.dataset.locationName =
        location.locationName || "";


      vehicleLocationItem.dataset.displayName =
        location.displayName || "";


      /*
      * Stop map selection after one click.
      */

      //disablePuvLocationSelection();

    },
    {
      markerId: "vehicle-staging",
      markerColor: "#e74c3c"
    }
  );

  const cancelButton = container.querySelector("#cancelPuvVehicleStaging");

  if (cancelButton) {

    cancelButton.addEventListener("click", () => {
      renderVehicleStagingButton(container);
    });

  }
  
  const saveButton = container.querySelector("#savePuvVehicleStaging");

  if(saveButton) {
    saveButton.addEventListener("click", () => {
      saveVehicleStagingLocation(container);
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
      ${vehicleStagingLocation ? "Edit Vehicle Staging Location" : "Set Vehicle Staging"}
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

function saveVehicleStagingLocation(container) {

  const vehicleLocationItem =
    container.querySelector("#puvVehicleStagingItem");

  if (!vehicleLocationItem) {
    return;
  }


  const latitude =
    vehicleLocationItem.dataset.latitude;

  const longitude =
    vehicleLocationItem.dataset.longitude;

  if (!latitude || !longitude) {

    alert(
      "Please select a vehicle staging location on the map."
    );

    return;
  }


  /*
   * Hold the vehicle staging data.
   */
  vehicleStagingLocation = {

    location_type:
      "Vehicle Staging",

    road_name:
      vehicleLocationItem.dataset.roadName || "",

    location_name:
      vehicleLocationItem.dataset.locationName || "",

    display_name:
      vehicleLocationItem.dataset.displayName || "",

    latitude:
      Number(latitude),

    longitude:
      Number(longitude)

  };


  console.log(
    "Vehicle staging location saved:",
    vehicleStagingLocation
  );


  /*
   * Stop map selection.
   */
  disablePuvLocationSelection();


  /*
   * Return to the default button,
   * but now it will be the EDIT button.
   */
  renderVehicleStagingButton(container);

}