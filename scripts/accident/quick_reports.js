import { getQuickReportOverlay } from "../global_variables.js";

let accidentId = null;

export function renderQuickReport() {
  accidentId = `ACC-${Date.now()}`;
  const quickReportOverlay = getQuickReportOverlay();

  if (!quickReportOverlay) {
    console.error('Quick report overlay not found');
    return;
  }

  quickReportOverlay.innerHTML = `
    <button class="exit-quick-reports js-exit-quick-reports">
      <i class="fas fa-times"></i>
    </button>
    <div class="form-panel">
      <h3><i class="fas fa-clipboard-list"></i> New Accident Report</h3>

      <!-- Basic Information -->
      <div class="form-section">
        <div class="section-header">
          <h4><i class="fas fa-info-circle"></i> Accident Details</h4>
          <span class="section-count">1</span>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Accident ID <span class="required">*</span></label>
            <input type="text" class="form-control" id="accidentId" value="${accidentId}" readonly>
          </div>
          <div class="form-group">
            <label class="form-label">Road/Location <span class="required">*</span></label>
            <select class="form-select" id="roadId">
              <option value="">Select Road</option>
              <option value="1">Dome</option>
              <option value="2">Mt.Natib</option>
              <option value="3">Klawit</option>
              <option value="4">Kalandang</option>
              <option value="5">Mauban</option>
              <option value="6">Tagaytay Street</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Accident Type <span class="required">*</span></label>
            <select class="form-select" id="accidentType">
              <option value="">Select Type</option>
              <option value="collision">Vehicle Collision</option>
              <option value="single">Single Vehicle</option>
              <option value="pedestrian">Pedestrian Accident</option>
              <option value="property">Property Damage</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Severity Level <span class="required">*</span></label>
            <select class="form-select" id="severityLevel">
              <option value="">Select Level</option>
              <option value="minor">Minor</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Date <span class="required">*</span></label>
            <input type="date" class="form-control" id="accidentDate">
          </div>
          <div class="form-group">
            <label class="form-label">Time <span class="required">*</span></label>
            <input type="time" class="form-control" id="accidentTime">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Description <span class="required">*</span></label>
          <textarea class="form-control" id="description" rows="3"
            placeholder="Describe the accident details, weather conditions, road situation..."></textarea>
        </div>
      </div>

      <!-- People Involved -->
      <div class="form-section">
        <div class="section-header">
          <h4><i class="fas fa-users"></i> People Involved</h4>
          <span class="section-count" id="peopleCount">0</span>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Full Name <span class="required">*</span></label>
            <input type="text" class="form-control" id="personName" placeholder="Enter full name">
          </div>
          <div class="form-group">
            <label class="form-label">Contact Number</label>
            <input type="text" class="form-control" id="personContact" placeholder="Enter contact number">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Role <span class="required">*</span></label>
            <select class="form-select" id="personRole">
              <option value="">Select Role</option>
              <option value="driver">Driver</option>
              <option value="passenger">Passenger</option>
              <option value="pedestrian">Pedestrian</option>
              <option value="witness">Witness</option>
              <option value="owner">Vehicle Owner</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Status Level <span class="required">*</span></label>
            <select class="form-select" id="personStatus">
              <option value="">Select Status</option>
              <option value="uninjured">Uninjured</option>
              <option value="minor_injuries">Minor Injuries</option>
              <option value="serious_injuries">Serious Injuries</option>
              <option value="critical">Critical Condition</option>
              <option value="fatal">Fatal</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Address</label>
          <input type="text" class="form-control" id="personAddress" placeholder="Enter address">
        </div>

        <button class="btn btn-secondary" id="addPersonBtn" style="margin-top: 0.5rem;">
          <i class="fas fa-user-plus"></i> Add Person
        </button>

        <div class="people-list" style="margin-top: 1rem;">
          <table class="people-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="peopleTableBody">
              <!-- People will be added here -->
            </tbody>
          </table>
        </div>
      </div>

      <!-- Vehicles Involved -->
      <div class="form-section">
        <div class="section-header">
          <h4><i class="fas fa-car"></i> Vehicles Involved</h4>
          <span class="section-count" id="vehiclesCount">0</span>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Driver <span class="required">*</span></label>
            <input type="text" class="form-control" id="vehicleDriver" placeholder="Enter Driver Name">
          </div>
          <div class="form-group">
            <label class="form-label">Plate Number <span class="required">*</span></label>
            <input type="text" class="form-control" id="vehiclePlate" placeholder="Enter plate number">
          </div>
          <div class="form-group">
            <label class="form-label">Vehicle Type <span class="required">*</span></label>
            <select class="form-select" id="vehicleType">
              <option value="">Select Type</option>
              <option value="private">Private Vehicle</option>
              <option value="public">Public Utility Vehicle</option>
              <option value="motorcycle">Motorcycle</option>
              <option value="truck">Truck</option>
              <option value="government">Government Vehicle</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Vehicle Name/Model</label>
            <input type="text" class="form-control" id="vehicleName" placeholder="Enter vehicle model">
          </div>
          <div class="form-group">
            <label class="form-label">Damage Level <span class="required">*</span></label>
            <select class="form-select" id="damageLevel">
              <option value="">Select Damage</option>
              <option value="none">No Damage</option>
              <option value="minor">Minor Damage</option>
              <option value="moderate">Moderate Damage</option>
              <option value="severe">Severe Damage</option>
              <option value="totaled">Totaled</option>
            </select>
          </div>
        </div>

        <button class="btn btn-secondary" id="addVehicleBtn" style="margin-top: 0.5rem;">
          <i class="fas fa-car"></i> Add Vehicle
        </button>

        <div class="vehicles-list" style="margin-top: 1rem;">
          <table class="vehicles-table">
            <thead>
              <tr>
                <th>Driver</th>
                <th>Plate No.</th>
                <th>Type</th>
                <th>Damage</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="vehiclesTableBody">
              <!-- Vehicles will be added here -->
            </tbody>
          </table>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <button class="btn btn-secondary" id="resetFormBtn">
          <i class="fas fa-redo"></i> Reset Form
        </button>
        <div style="display: flex; gap: 0.75rem;">
          <button class="btn btn-success" id="saveDraftBtn">
            <i class="fas fa-save"></i> Save as Draft
          </button>
          <button class="btn btn-primary" id="submitReportBtn">
            <i class="fas fa-paper-plane"></i> Submit Report
          </button>
        </div>
      </div>
    </div>
  `;

  quickReportOverlay.classList.remove('hidden');

  // Set default current time (24-hour)
  const timeInput = document.getElementById('accidentTime');

  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  timeInput.value = `${hours}:${minutes}`;

  const dateInput = document.getElementById('accidentDate');
  dateInput.value = new Date().toISOString().split('T')[0];
}

document.addEventListener('click', (e) => {
  if(!e.target.closest('#addPersonBtn')) return ;

  const name = document.getElementById('personName').value.trim();
  const contact = document.getElementById('personContact').value.trim();
  const address = document.getElementById('personAddress').value.trim();
  const role = document.getElementById('personRole').value;
  const status = document.getElementById('personStatus').value;

  if(!name || !role || !status) {
    alert("Full name, role, and status are required");
    return;
  }

  const tbody = document.getElementById('peopleTableBody');

  const tr = document.createElement('tr');
  tr.dataset.name = name;
  tr.dataset.contact = contact;
  tr.dataset.address = address;
  tr.dataset.role = role;
  tr.dataset.status = status;

  tr.innerHTML = `
    <td>${name}</td>
    <td>${role}</td>
    <td>${status}</td>
    <td>
      <button class="btn btn-danger btn-sm remove-row">Remove</button>
    </td>
  `;

  tbody.appendChild(tr);

  document.getElementById('peopleCount').textContent = tbody.children.length;

  document.getElementById('personName').value = '';
  document.getElementById('personContact').value = '';
  document.getElementById('personAddress').value = '';
  document.getElementById('personRole').value = '';
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('#addVehicleBtn')) return;

  const driver = document.getElementById('vehicleDriver').value.trim();
  const plate = document.getElementById('vehiclePlate').value.trim();
  const type = document.getElementById('vehicleType').value;
  const vehicleName = document.getElementById('vehicleName').value.trim();
  const damage = document.getElementById('damageLevel').value;

  if (!driver || !plate || !type || !damage) {
    alert("Driver, plate number, vehicle type, and damage level are required.");
    return;
  }

  const tbody = document.getElementById('vehiclesTableBody');

  const tr = document.createElement('tr');
  tr.dataset.driver = driver;
  tr.dataset.vehicle = vehicleName;
  tr.dataset.plate = plate;
  tr.dataset.damage = damage;

  tr.innerHTML = `
    <td>${driver}</td>
    <td>${plate}</td>
    <td>${type}</td>
    <td>${damage}</td>
    <td>
      <button class="btn btn-danger btn-sm remove-row">Remove</button>
    </td>
  `;

  tbody.appendChild(tr);

  document.getElementById('vehiclesCount').textContent = tbody.children.length;

  // Clear inputs
  document.getElementById('vehicleDriver').value = '';
  document.getElementById('vehiclePlate').value = '';
  document.getElementById('vehicleType').value = '';
  document.getElementById('vehicleName').value = '';
  document.getElementById('damageLevel').value = '';
});

document.addEventListener('click', (e) => {
  if (!e.target.classList.contains('remove-row')) return;

  const row = e.target.closest('tr');
  const tbody = row.parentElement;

  row.remove();

  if (tbody.id === 'peopleTableBody') {
    document.getElementById('peopleCount').textContent = tbody.children.length;
  }

  if (tbody.id === 'vehiclesTableBody') {
    document.getElementById('vehiclesCount').textContent = tbody.children.length;
  }
});

document.addEventListener('click', async (e) => {
  if (!e.target.closest('#submitReportBtn')) return;

  const payLoad = {
    accident: {
      public_accident_id: accidentId,
      road_id: document.getElementById('roadId').value,
      accident_type: document.getElementById('accidentType').value,
      accident_description: document.getElementById('description').value,
      status_of_accident: document.getElementById('severityLevel').value,
      date_of_accident: document.getElementById('accidentDate').value,
      time_of_accident: document.getElementById('accidentTime').value
    },
    people: [],
    vehicles: []
  };

  document.querySelectorAll('#peopleTableBody tr').forEach(row => {
    payLoad.people.push({
      full_name: row.dataset.name,
      contact_num: row.dataset.contact,
      address: row.dataset.address,
      role: row.dataset.role,
      status_level: row.dataset.status
    });
  });

  document.querySelectorAll('#vehiclesTableBody tr').forEach(row => {
    payLoad.vehicles.push({
      driver_name: row.dataset.driver,
      vehicle_name: row.dataset.vehicle,
      plate_number: row.dataset.plate,
      damage_level: row.dataset.damage
    });
  });

  console.log(payLoad);

  try {
    const response = await fetch("../api/submit_accident_details.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payLoad)
    });

    const data = await response.json();

    if (data.success) {
      alert("Accident report submitted successfully");
    } else {
      alert("Error " + data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Server error");
  }

  console.log(JSON.stringify(payLoad, null, 2));
});