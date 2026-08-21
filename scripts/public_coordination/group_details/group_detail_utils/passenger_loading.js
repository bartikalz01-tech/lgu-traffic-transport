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
        class="puv-location-cancel-btn"
        id="cancelPuvPassengerLoading"
      >
        <i class="fas fa-xmark"></i>
        Cancel
      </button>

    </div>
  `;

  const loadingAreaList =
    passengerLocationItem.querySelector("#puvLoadingAreaList");

  addLoadingArea(loadingAreaList);

  const addButton =
    passengerLocationItem.querySelector("#addPuvLoadingArea");

  if (addButton) {

    addButton.addEventListener("click", () => {

      addLoadingArea(loadingAreaList);

    });

  }

  const cancelButton =
    passengerLocationItem.querySelector("#cancelPuvPassengerLoading");

  if (cancelButton) {

    cancelButton.addEventListener("click", () => {

      renderPassengerLoadingButton(container);

    });

  }

}


function addLoadingArea(listContainer) {

  const areaCount =
    listContainer.querySelectorAll(".puv-loading-area").length + 1;

  const area = document.createElement("div");

  area.className = "puv-loading-area";

  area.innerHTML = `
    <div class="puv-loading-area-header">

      <strong>
        Loading Area ${areaCount}
      </strong>

      <button
        type="button"
        class="puv-loading-area-remove"
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
        class="puv-location-input"
        placeholder="Select a location on map"
        readonly
      >

    </div>
  `;

  listContainer.appendChild(area);

  const removeButton =
    area.querySelector(".puv-loading-area-remove");

  if (removeButton) {

    removeButton.addEventListener("click", () => {

      area.remove();

      renumberLoadingAreas(listContainer);

    });

  }

}


function renumberLoadingAreas(listContainer) {

  const areas =
    listContainer.querySelectorAll(".puv-loading-area");

  areas.forEach((area, index) => {

    const title =
      area.querySelector(".puv-loading-area-header strong");

    if (title) {

      title.textContent =
        `Loading Area ${index + 1}`;

    }

  });

}


export function renderPassengerLoadingButton(container) {

  const passengerLocationItem =
    container.querySelector("#puvPassengerLoadingItem");

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
    container.querySelector("#puvPassengerLoading");

  if (passengerLoadingButton) {

    passengerLoadingButton.addEventListener("click", () => {

      renderPassengerLoadingSelection(container);

    });

  }

}