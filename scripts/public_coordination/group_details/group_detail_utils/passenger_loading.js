import {
  disablePuvLocationSelection,
  enablePuvLocationSelection,
  removePuvLocationMarker,
  setPuvLocationMarkerClickCallback,
  updatePuvLocationMarkerPopup
} from "../puv_group_map.js";


export function renderPassengerLoadingSelection(container) {

  const passengerLocationItem =
    container.querySelector("#puvPassengerLoadingItem");

  if (!passengerLocationItem) {
    return;
  }

  passengerLocationItem.innerHTML = `
    <span class="puv-info-label">
      Passenger Loading Area
    </span>

    <div
      class="puv-loading-area-list"
      id="puvLoadingAreaList"
    >
    </div>

    <div class="puv-location-actions">

      <button
        type="button"
        class="puv-location-add-btn"
        id="addPuvLoadingArea"
      >
        <i class="fas fa-plus"></i>
        Add Loading Area
      </button>

      <button
        type="button"
        class="puv-location-save-btn"
        id="savePuvPassengerLoading"
      >
        <i class="fas fa-check"></i>
        Save Loading Areas
      </button>

      <button
        type="button"
        class="puv-location-cancel-btn"
        id="cancelPuvPassengerLoading"
      >
        <i class="fas fa-xmark"></i>
        Cancel
      </button>

    </div>
  `;


  const loadingAreaList = passengerLocationItem.querySelector("#puvLoadingAreaList");

  setPuvLocationMarkerClickCallback((markerId) => {
    focusLoadingAreaByMarkerId(loadingAreaList, markerId);
  });


  /*
   * Create first loading area
   */
  addLoadingArea(loadingAreaList);


  /*
   * Add another loading area
   */
  const addButton =
    passengerLocationItem.querySelector("#addPuvLoadingArea");

  if (addButton) {

    addButton.addEventListener("click", () => {

      addLoadingArea(loadingAreaList);

    });

  }


  /*
   * Save loading areas
   */
  const saveButton =
    passengerLocationItem.querySelector("#savePuvPassengerLoading");

  if (saveButton) {

    saveButton.addEventListener("click", () => {

      savePassengerLoadingAreas(container);

    });

  }


  /*
   * Cancel
   */
  const cancelButton =
    passengerLocationItem.querySelector("#cancelPuvPassengerLoading");

  if (cancelButton) {

    cancelButton.addEventListener("click", () => {

      disablePuvLocationSelection();

      renderPassengerLoadingButton(container);

    });

  }

}


/*
|--------------------------------------------------------------------------
| ADD LOADING AREA
|--------------------------------------------------------------------------
*/

function addLoadingArea(listContainer) {

  const areaNumber = listContainer.querySelectorAll(".puv-loading-area").length + 1;

  const markerId = `loading-area-${crypto.randomUUID()}`;

  const area =
    document.createElement("div");

  area.className =
    "puv-loading-area";

  area.dataset.markerId = markerId;

  area.innerHTML = `

    <div class="puv-loading-area-header">

      <strong>
        Loading Area ${areaNumber}
      </strong>

      <button
        type="button"
        class="puv-loading-area-remove"
        title="Remove loading area"
      >
        <i class="fas fa-trash"></i>
      </button>

    </div>


    <div class="puv-location-field">

      <span class="puv-info-label">
        Road Name
      </span>

      <input
        type="text"
        class="puv-location-input puv-loading-road"
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
        class="puv-location-input puv-loading-specific"
        placeholder="Select a location on map"
        readonly
      >

    </div>


    <div class="puv-location-actions">

      <button
        type="button"
        class="puv-location-select-btn"
      >
        <i class="fas fa-location-dot"></i>
        Select on Map
      </button>

    </div>

  `;


  listContainer.appendChild(area);


  /*
   * Remove button
   */
  const removeButton =
    area.querySelector(".puv-loading-area-remove");

  if (removeButton) {

    removeButton.addEventListener("click", () => {

      const markerId = area.dataset.markerId;

      disablePuvLocationSelection();

      if(markerId) {
        removePuvLocationMarker(markerId);
      }

      area.remove();

      //renumberLoadingAreas(listContainer);

    });

  }


  /*
   * Select location button
   */
  const selectButton =
    area.querySelector(".puv-location-select-btn");

  if (selectButton) {

    selectButton.addEventListener("click", () => {

      selectPassengerLoadingLocation(area);

    });

  }

}


/*
|--------------------------------------------------------------------------
| SELECT PASSENGER LOADING LOCATION
|--------------------------------------------------------------------------
*/

function selectPassengerLoadingLocation(area) {

  const roadInput =
    area.querySelector(
      ".puv-loading-road"
    );


  const specificInput =
    area.querySelector(
      ".puv-loading-specific"
    );


  if (
    !roadInput ||
    !specificInput
  ) {

    console.error(
      "Passenger loading inputs not found."
    );

    return;
  }


  const markerId =
    area.dataset.markerId;


  /*
   * Activate this loading area's
   * map-selection state.
   */
  setLoadingAreaSelectingState(
    area,
    true
  );


  /*
   * Enable map selection.
   */
  enablePuvLocationSelection(

    (location) => {

      console.log(
        "Passenger loading location selected:",
        location
      );


      /*
       * Update Road Name
       */

      roadInput.value =
        location.roadName ||
        "Unnamed Road";


      /*
       * Update Specific Location
       */

      specificInput.value =
        location.locationName ||
        location.displayName ||
        "Selected map location";


      /*
       * Update coordinates
       */

      area.dataset.latitude =
        location.latitude;


      area.dataset.longitude =
        location.longitude;


      /*
       * Update location information
       */

      area.dataset.roadName =
        location.roadName || "";


      area.dataset.locationName =
        location.locationName || "";


      area.dataset.displayName =
        location.displayName || "";

      
      updatePuvLocationMarkerPopup(markerId, 
        {
          title: getLoadingAreaTitle(area),
          roadName: location.roadName || "",
          locationName: location.locationName || "",
          displayName: location.displayName || ""
        }
      );

      /*
       * Store complete location object
       */

      area.puvLocationData = {

        latitude:
          location.latitude,

        longitude:
          location.longitude,

        roadName:
          location.roadName || "",

        locationName:
          location.locationName || "",

        displayName:
          location.displayName || ""

      };


      /*
       * IMPORTANT:
       *
       * Map selection is finished.
       */

      disablePuvLocationSelection();


      /*
       * Restore this area's button.
       */

      setLoadingAreaSelectingState(
        area,
        false
      );

    },

    {
      markerId: markerId,
      markerColor: "blue",
      markerPopUp: {
        title: getLoadingAreaTitle(area),
        roadName: area.dataset.roadName || "",
        locationName: area.dataset.locationName || ""
      }
    }

  );

}


function setLoadingAreaSelectingState(
  activeArea,
  isSelecting
) {

  const listContainer =
    activeArea.closest(
      "#puvLoadingAreaList"
    );


  if (!listContainer) {
    return;
  }


  const areas =
    listContainer.querySelectorAll(
      ".puv-loading-area"
    );


  areas.forEach((area) => {

    const button =
      area.querySelector(
        ".puv-location-select-btn"
      );


    if (!button) {
      return;
    }


    /*
     * ------------------------------------------------------
     * ACTIVE AREA + MAP SELECTION
     * ------------------------------------------------------
     */

    if (
      area === activeArea &&
      isSelecting
    ) {

      area.classList.add(
        "is-map-selecting"
      );


      button.classList.add(
        "is-selecting"
      );


      button.classList.remove(
        "is-disabled"
      );


      button.disabled =
        false;


      button.innerHTML = `
        <i class="fas fa-crosshairs"></i>
        Click on Map
      `;


      return;
    }


    /*
     * ------------------------------------------------------
     * OTHER AREAS WHILE SELECTING
     * ------------------------------------------------------
     */

    if (
      isSelecting &&
      area !== activeArea
    ) {

      button.disabled =
        true;


      button.classList.add(
        "is-disabled"
      );


      return;
    }


    /*
     * ------------------------------------------------------
     * NORMAL STATE
     * ------------------------------------------------------
     */

    area.classList.remove(
      "is-map-selecting"
    );


    button.classList.remove(
      "is-selecting"
    );


    button.classList.remove(
      "is-disabled"
    );


    button.disabled =
      false;


    /*
     * If this area already has a
     * selected location, show
     * "Change on Map".
     */

    if (
      area.dataset.latitude &&
      area.dataset.longitude
    ) {

      button.innerHTML = `
        <i class="fas fa-arrows-rotate"></i>
        Change on Map
      `;

    } else {

      button.innerHTML = `
        <i class="fas fa-location-dot"></i>
        Select on Map
      `;

    }

  });

}


/*
|--------------------------------------------------------------------------
| RENUMBER AREAS
|--------------------------------------------------------------------------
*/

/*function renumberLoadingAreas(listContainer) {

  const areas =
    listContainer.querySelectorAll(".puv-loading-area");


  areas.forEach((area, index) => {

    const title =
      area.querySelector(
        ".puv-loading-area-header strong"
      );

    if (title) {

      title.textContent =
        `Loading Area ${index + 1}`;

    }

  });

}*.


/*
|--------------------------------------------------------------------------
| SAVE LOADING AREAS
|--------------------------------------------------------------------------
*/

async function savePassengerLoadingAreas(container) {

  const passengerLocationItem =
    container.querySelector("#puvPassengerLoadingItem");


  if (!passengerLocationItem) {
    return;
  }


  const areas =
    passengerLocationItem.querySelectorAll(
      ".puv-loading-area"
    );


  if (areas.length === 0) {

    alert(
      "Please add at least one passenger loading area."
    );

    return;

  }


  const loadingAreas = [];


  for (const area of areas) {

    const latitude =
      area.dataset.latitude;

    const longitude =
      area.dataset.longitude;

    const roadName =
      area.dataset.roadName || "";

    const locationName =
      area.dataset.locationName || "";

    const displayName =
      area.dataset.displayName || "";


    /*
     * Require a map selection.
     */
    if (!latitude || !longitude) {

      alert(
        "Please select a location on the map for every loading area."
      );

      return;

    }


    loadingAreas.push({

      location_type:
        "Passenger Loading",

      road_name:
        roadName,

      location_name:
        locationName,

      display_name:
        displayName,

      latitude:
        Number(latitude),

      longitude:
        Number(longitude)

    });

  }


  console.log(
    "Passenger loading areas ready to save:",
    loadingAreas
  );


  /*
   * For now, just show the collected data.
   *
   * We will connect this to PHP afterward.
   */
  console.table(loadingAreas);


  disablePuvLocationSelection();

  renderPassengerLoadingSummary(
    container,
    loadingAreas
  );

}


/*
|--------------------------------------------------------------------------
| RENDER SUMMARY AFTER SAVE
|--------------------------------------------------------------------------
*/

function renderPassengerLoadingSummary(
  container,
  loadingAreas
) {

  const passengerLocationItem =
    container.querySelector(
      "#puvPassengerLoadingItem"
    );


  if (!passengerLocationItem) {
    return;
  }


  passengerLocationItem.innerHTML = `

    <span class="puv-info-label">
      Passenger Loading Area
    </span>


    <div class="puv-loading-area-summary">

      ${loadingAreas.map((area, index) => `

        <div class="puv-loading-area-summary-item">

          <strong>
            Loading Area ${index + 1}
          </strong>

          <span>
            ${area.road_name || "Unnamed Road"}
          </span>

          <small>
            ${area.location_name || area.display_name || "Selected map location"}
          </small>

        </div>

      `).join("")}

    </div>


    <button
      type="button"
      class="puv-location-action-btn"
      id="editPuvPassengerLoading"
    >
      <i class="fas fa-pen"></i>
      Edit Loading Areas
    </button>

  `;


  const editButton =
    passengerLocationItem.querySelector(
      "#editPuvPassengerLoading"
    );


  if (editButton) {

    editButton.addEventListener("click", () => {

      renderPassengerLoadingSelection(container);

    });

  }

}


/*
|--------------------------------------------------------------------------
| DEFAULT BUTTON
|--------------------------------------------------------------------------
*/

export function renderPassengerLoadingButton(container) {

  const passengerLocationItem =
    container.querySelector(
      "#puvPassengerLoadingItem"
    );


  if (!passengerLocationItem) {
    return;
  }


  passengerLocationItem.innerHTML = `

    <span class="puv-info-label">
      Passenger Loading Area
    </span>


    <button
      type="button"
      class="puv-location-action-btn"
      id="puvPassengerLoading"
    >

      <i class="fas fa-map-location-dot"></i>

      Set Loading Areas

    </button>

  `;


  const passengerLoadingButton =
    container.querySelector(
      "#puvPassengerLoading"
    );


  if (passengerLoadingButton) {

    passengerLoadingButton.addEventListener(
      "click",
      () => {

        renderPassengerLoadingSelection(
          container
        );

      }
    );

  }

}

function focusLoadingAreaByMarkerId(
  listContainer,
  markerId
) {

  if (!listContainer) {
    return;
  }


  const areas =
    listContainer.querySelectorAll(
      ".puv-loading-area"
    );


  let targetArea = null;


  areas.forEach((area) => {

    if (
      area.dataset.markerId ===
      markerId
    ) {

      targetArea =
        area;

    }

  });


  if (!targetArea) {

    console.warn(
      "No loading area found for marker:",
      markerId
    );

    return;

  }


  /*
   * Remove previous focus.
   */

  areas.forEach((area) => {

    area.classList.remove(
      "is-marker-focused"
    );

  });


  /*
   * Highlight selected card.
   */

  targetArea.classList.add(
    "is-marker-focused"
  );


  /*
   * Scroll the card into view.
   */

  targetArea.scrollIntoView({
    behavior:
      "smooth",

    block:
      "center"
  });


  /*
   * Automatically remove
   * the highlight after a few seconds.
   */

  setTimeout(() => {

    targetArea.classList.remove(
      "is-marker-focused"
    );

  }, 3000);

}

function getLoadingAreaTitle(area) {

  const title =
    area.querySelector(
      ".puv-loading-area-header strong"
    );


  return title
    ? title.textContent
    : "Passenger Loading Area";

}