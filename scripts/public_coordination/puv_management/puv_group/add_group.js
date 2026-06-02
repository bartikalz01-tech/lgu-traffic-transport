import { insertPuvGroup } from "../../../data/fetch_public_group_trans.js";
import { initMap } from "../../../utils/traffic_and_events.js";

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

            <input type="hidden" id="terminalLat">
            <input type="hidden" id="terminalLng">
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
            <div class="map-mock-ui" id="addGroupMap">
              <i class="fas fa-location-dot"></i>
              <p>Map Preview Area</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const exitBtns = container.querySelectorAll(".js-exit-puv-group");

  const addGroupMap = initMap("addGroupMap");

  let marker = null;

  const addressInput = document.getElementById("terminalAddress");
  const latInput = document.getElementById("terminalLat");
  const lngInput = document.getElementById("terminalLng");

  addGroupMap.on("click", async (e) => {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    latInput.value = lat;
    lngInput.value = lng;

    if(marker) {
      addGroupMap.removeLayer(marker);
    }

    marker = L.marker([lat, lng]).addTo(addGroupMap);

    addressInput.value = "Fetching address...";

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);

      const data = await response.json();

      if(data.display_name) {
        addressInput.value = data.display_name;
      } else {
        addressInput.value = "Address not found";
      }
    } catch(error) {
      console.error("Reverse geocoding error:", error);

      addressInput.value = "Unable to get address";
    }
  });

  document.getElementById("saveGroup").addEventListener("click", async () => {
    const groupName = document.getElementById("groupName").value;
    const terminalAddress = document.getElementById("terminalAddress").value;
    const vehicleType = document.getElementById("vehicleType").value;
    const latitude = document.getElementById("terminalLat").value;
    const longitude = document.getElementById("terminalLng").value;

    console.log(groupName, vehicleType, latitude, longitude);

    if(!groupName || !vehicleType || !latitude || !longitude) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Fields",
        text: "Please complete all required fields"
      });

      return;
    }

    const puvGroupData = {
      puv_group_name: groupName,
      puv_group_address: terminalAddress,
      puv_vehicle_type: vehicleType,
      latitude: latitude,
      longitude: longitude
    };

    Swal.fire({
      title: "Registering Group...",
      text: "Please wait.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const result = await insertPuvGroup(puvGroupData);

    if(result.status === "success") {
      Swal.fire({
        icon: "success",
        title: "PUV Group Registered",
        text: "The transport group has been added successfully.",
        confirmButtonColor: "#2563eb"
      });

      /*container.classList.add("add-puv-group-hidden");
      container.innerHTML = '';*/
      document.getElementById("addGroupBtn").focus();

      container.classList.add("add-puv-group-hidden");

      setTimeout(() => {
        container.innerHTML = '';
      }, 200);

    } else {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: result.message || "Something went wrong"
      });
    }
  });

  exitBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      container.classList.add("add-puv-group-hidden");

      container.innerHTML = '';
    });
  });
}