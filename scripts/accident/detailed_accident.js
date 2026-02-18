import { getDetailedReports } from "../global_variables.js";
import { getHeaderAccidentDetails, getAccidentPeopleDetails, getAccidentVehicleDetails } from "../data/accident_cases.js";
import { loadOfficers } from "../data/fetch_officers.js";
import { loadReportStatus } from "../data/fetch_status_reports.js";
import { formatAccidentDateTime } from "../utils/dateFormatter.js";
import { renderPeople, peopleInvolved } from "./accidentUtils/render_accident_people.js";
import { renderAccidentVehicles, vehicleAccidentInvolved } from "./accidentUtils/render_accident_vehicles.js";
import { renderAccidentItem } from "./accident_item.js";

export async function detailedAccidentReport(accidentId) {
  const detailedReports = getDetailedReports();

  if (!detailedReports) {
    console.error('Detail overlay not found');
    return;
  }

  const data = await getHeaderAccidentDetails(accidentId);

  if (!data) {
    console.error('No accident data returned for ID:', accidentId);
    return;
  }

  const accident_type_labels = {
    collision: 'Vehicle Collision',
    single: 'Single Vehicle',
    pedestrian: 'Pedestrian Accident',
    property: 'Property Damage',
    other: 'Other'
  };

  const accidentTypeLabel = accident_type_labels[data.accident_type] ?? data.accident_type

  const formattedDateTime = formatAccidentDateTime(
    data.date_of_accident,
    data.time_of_accident
  );

  detailedReports.innerHTML = `
        <section class="detailed-reports-overlay">
        <button class="exit-accident-details js-exit-accident-details">
          <i class="fas fa-times"></i>
        </button>
        <div class="detailed-reports-container">
          <!-- Success Indicator -->
          <div class="save-indicator" id="saveIndicator">
            <i class="fas fa-check-circle"></i>
            <span>Changes saved successfully!</span>
          </div>

          <h2><i class="fas fa-file-alt"></i> Accident Case Details</h2>
          
          <!-- Summary Section -->
          <div class="summary-reports">
            <div class="accident-detail-data-left-side">
              <div class="accident-data">
                <p class="description">Accident ID:</p>
                <p class="data" id="accidentId">${data.public_accident_id}</p>
              </div>
              <div class="accident-data">
                <p class="description">Type of Accident:</p>
                <p class="data" id="accidentType">${accidentTypeLabel}</p>
              </div>
              <div class="accident-data">
                <p class="description">Location:</p>
                <p class="data" id="accidentLocation">${data.road_name}</p>
              </div>
              <div class="accident-data">
                <p class="description">Date & Time:</p>
                <p class="data" id="accidentDateTime">${formattedDateTime}</p>
              </div>
              <div class="accident-data">
                <p class="description">Assigned Barangay Officer:</p>
                <div class="status-control">
                  <select class="status-select" id="dispatchedOfficerSelect">
                    
                  </select>
                </div>
              </div>
            </div>

            <div class="accident-detail-data-right-side">
              <!-- Status Control -->
              <div class="accident-data">
                <p class="description">Status:</p>
                <div class="status-control">
                  <select class="status-select" id="statusSelect">
                    
                  </select>
                  <span class="status-badge" id="statusBadge"></span>
                </div>
              </div>
              
              <div class="accident-data">
                <p class="description">People Involved:</p>
                <p class="data"><span id="peopleCount">${data.total_people}</span> people</p>
              </div>
              <div class="accident-data">
                <p class="description">Vehicles Involved:</p>
                <p class="data"><span id="vehiclesCount">${data.total_vehicles}</span> vehicles</p>
              </div>
              <div class="accident-data">
                <p class="description">Severity:</p>
                <p class="data" id="severityLevel">${data.status_of_accident}</p>
              </div>
            </div>
          </div>

          <!-- Notes Section -->
          <div class="notes-section">
            <h4><i class="fas fa-sticky-note"></i> Investigation Notes</h4>
            <textarea class="notes-textarea" id="investigationNotes" placeholder="Add investigation notes, observations, or updates...">
              ${data.accident_description}
            </textarea>
            <div class="timestamp">Last updated: <span id="notesTimestamp">Jan 15, 2025 2:30 PM</span></div>
          </div>

          <!-- People Involved Section -->
          <div class="report-table-section">
            <div class="table-header-actions">
              <!-- HERE NEXUS THE People Involved -->
              <h3><i class="fas fa-users"></i> People Involved <span class="section-badge"><span id="peopleCountBadge">${data.total_people}</span> Persons</span></h3>
              <button class="btn btn-primary" id="addPersonBtn">
                <i class="fas fa-user-plus"></i> Add Person
              </button>
            </div>

            <div class="table-wrapper">
              <table class="report-table" id="peopleTable">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Injury Status</th>
                    <th>Contact</th>
                    <th>Address</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="peopleTableBody">
                  
                </tbody>
              </table>
            </div>
            
            <!-- Empty State for People -->
            <div class="empty-state" id="peopleEmptyState" style="display: none;">
              <i class="fas fa-user-friends"></i>
              <h4>No people added yet</h4>
              <p>Click "Add Person" to start adding people involved in this accident.</p>
            </div>
          </div>

          <!-- Vehicles Involved Section -->
          <div class="report-table-section">
            <div class="table-header-actions">
              <h3><i class="fas fa-car"></i> Vehicles Involved <span class="section-badge"><span id="vehiclesCountBadge">${data.total_vehicles}</span> Vehicles</span></h3>
              <button class="btn btn-primary" id="addVehicleBtn">
                <i class="fas fa-car-side"></i> Add Vehicle
              </button>
            </div>

            <div class="table-wrapper">
              <table class="report-table" id="vehiclesTable">
                <thead>
                  <tr>
                    <th>Driver</th>
                    <th>Plate No.</th>
                    <th>Vehicle Type</th>
                    <th>Vehicle Name</th>
                    <th>Damage Level</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="vehiclesTableBody">
                  <!-- Vehicles will be populated by JavaScript -->
                </tbody>
              </table>
            </div>
            
            <!-- Empty State for Vehicles -->
            <div class="empty-state" id="vehiclesEmptyState" style="display: none;">
              <i class="fas fa-car-crash"></i>
              <h4>No vehicles added yet</h4>
              <p>Click "Add Vehicle" to start adding vehicles involved in this accident.</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <!--<button class="btn btn-secondary" id="printReportBtn">
              <i class="fas fa-print"></i> Print Report
            </button>-->
            <button class="btn btn-primary" id="seeTicketBtn">
              <i class="fas fa-save"></i> Ticket
            </button>
            <button class="btn btn-success" id="updateBtn">
              <i class="fas fa-check-circle"></i> Done
            </button>
          </div>
        </div>
      </section>

      <!-- Add Person Modal -->
      <div class="modal-overlay" id="personModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3><i class="fas fa-user-plus"></i> Add Person Involved</h3>
            <button class="modal-close" id="closePersonModal">&times;</button>
          </div>
          <form class="person-form" id="personForm">
            <div class="form-group">
              <label for="personName">Full Name *</label>
              <input type="text" id="personName" required>
            </div>
            <div class="form-group">
              <label for="personRole">Role</label>
              <select id="personRole">
                <option value="driver">Driver</option>
                <option value="passenger">Passenger</option>
                <option value="pedestrian">Pedestrian</option>
                <option value="witness">Witness</option>
                <option value="responder">First Responder</option>
              </select>
            </div>
            <div class="form-group">
              <label for="personInjury">Injury Status</label>
              <select id="personInjury">
                <option value="uninjured">Uninjured</option>
                <option value="minor">Minor Injuries</option>
                <option value="moderate">Moderate Injuries</option>
                <option value="severe">Severe Injuries</option>
                <option value="fatal">Fatal</option>
              </select>
            </div>
            <div class="form-group">
              <label for="personContact">Contact Number</label>
              <input type="tel" id="personContact" placeholder="0912-345-6789">
            </div>
            <div class="form-group">
              <label for="personAddress">Address</label>
              <input type="text" id="personAddress" placeholder="123 Street, City">
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" id="cancelPersonBtn">Cancel</button>
              <button type="submit" class="btn btn-primary">Add Person</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Add Vehicle Modal -->
      <div class="modal-overlay" id="vehicleModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3><i class="fas fa-car-side"></i> Add Vehicle Involved</h3>
            <button class="modal-close" id="closeVehicleModal">&times;</button>
          </div>
          <form class="vehicle-form" id="vehicleForm">
            <div class="form-group">
              <!--<label for="vehicleDriver">Driver Name *</label>
              <input type="text" id="vehicleDriver" required>-->
              <select id="vehicleDriverSelect">
                <option value="">Select Driver</option>
              </select>
            </div>
            <div class="form-group">
              <label for="vehiclePlate">Plate Number *</label>
              <input type="text" id="vehiclePlate" required placeholder="ABC-1234">
            </div>
            <div class="form-group">
              <label for="vehicleType">Vehicle Type</label>
              <select id="vehicleType">
                <option value="private">Private Vehicle</option>
                <option value="commercial">Commercial Vehicle</option>
                <option value="motorcycle">Motorcycle</option>
                <option value="public">Public Utility Vehicle</option>
                <option value="government">Government Vehicle</option>
              </select>
            </div>
            <div class="form-group">
              <label for="vehicleModel">Model</label>
              <input type="text" id="vehicleModel" placeholder="Toyota Vios">
            </div>
            <div class="form-group">
              <label for="vehicleDamage">Damage Level</label>
              <select id="vehicleDamage">
                <option value="none">No Damage</option>
                <option value="minor">Minor</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
                <option value="totaled">Totaled</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" id="cancelVehicleBtn">Cancel</button>
              <button type="submit" class="btn btn-primary">Add Vehicle</button>
            </div>
          </form>
        </div>
      </div>`

  detailedReports.classList.remove('detailed-reports-hidden');

  const accidentPeoples = await getAccidentPeopleDetails(accidentId);
  const accidentVehicles = await getAccidentVehicleDetails(accidentId);
  await loadOfficers(data.officer_id);
  console.log("STATUS ID FROM HEADER:", data.status_id);
  await loadReportStatus(data.status_id);

  if (!accidentPeoples) {
    console.error('No accident people data returned');
  }

  if (!accidentVehicles) {
    console.error('No accident vehicle data returned');
  }

  //peopleInvolved = accidentPeoples;
  peopleInvolved.length = 0;
  peopleInvolved.push(...accidentPeoples);

  vehicleAccidentInvolved.length = 0;
  vehicleAccidentInvolved.push(...accidentVehicles);

  renderPeople();
  renderAccidentVehicles();

  document.getElementById('peopleTableBody').addEventListener('click', async (e) => {
    const deleteBtn = e.target.closest('.delete-person');
    
    if(!deleteBtn) return;

    const accidentPeopleId = deleteBtn.dataset.id;

    if(!confirm("Are you sure you want to delete this person?")) {
      return;
    }

    try {
      const response = await fetch("../api/delete_person_to_accident.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accident_ppl_id: accidentPeopleId
        })
      });

      const result = await response.json();

      if(result.success) {
        const index = peopleInvolved.findIndex(
          p => p.accident_ppl_id == accidentPeopleId
        );

        if(index !== -1) {
          peopleInvolved.splice(index, 1);
        }

        renderPeople();
      }
    } catch(error) {
      console.error("Delete failed:", error);
    }
  });

  const driverSelect = document.getElementById("vehicleDriverSelect");

  function populateDriverDropdown() {
    driverSelect.innerHTML = '<option value="">Select Driver</option>';

    peopleInvolved.forEach(person => {
      if(person.role === 'driver') {
        const option = document.createElement("option");
        option.value = person.people_id;
        option.textContent = person.full_name;
        driverSelect.appendChild(option);
      }
    });
  }

  const personModal = document.getElementById('personModal');
  const personForm = document.getElementById('personForm');
  const addPersonBtn = document.getElementById('addPersonBtn');

  addPersonBtn.addEventListener('click', () => {
    personModal.style.display = 'flex';
  });

  personForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const response = await fetch("../api/add_person_to_accident.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accident_id: accidentId,
        full_name: document.getElementById("personName").value,
        contact_num: document.getElementById("personContact").value,
        address: document.getElementById("personAddress").value,
        role: document.getElementById("personRole").value,
        status_level: document.getElementById("personInjury").value
      })
    });

    const result = await response.json();

    if(result.success) {
      personModal.style.display = "none";
      personForm.reset();

      const updatedPeople = await getAccidentPeopleDetails(accidentId);
      peopleInvolved.length = 0;
      peopleInvolved.push(...updatedPeople);

      renderPeople();
      console.log(peopleInvolved);
    }
  });

  document.getElementById('cancelPersonBtn').addEventListener('click', () => {
    personModal.style.display = 'none';
    personForm.reset();
  });

  const vehicleModal = document.getElementById('vehicleModal');
  const vehicleForm = document.getElementById('vehicleForm');
  const addVehicleBtn = document.getElementById('addVehicleBtn');

  addVehicleBtn.addEventListener('click', () => {
    populateDriverDropdown();
    vehicleModal.style.display = 'flex';
  });

  document.getElementById('vehiclesTableBody').addEventListener('click', async (e) => {
    const deleteVehicleBtn = e.target.closest('.delete-vehicle');

    if(!deleteVehicleBtn) return;

    const accidentVehicleId = deleteVehicleBtn.dataset.id;

    if(!confirm("Are you sure you want to delete this vehicle?")) {
      return;
    }

    try {
      const response = await fetch("../api/delete_vehicle_to_accident.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accident_vehicle_id: accidentVehicleId
        })
      });

      const result = await response.json();
      console.log("Delete vehicle result", result);

      if(result.success) {
        const index = vehicleAccidentInvolved.findIndex(
          v => v.accident_vehicle_id == accidentVehicleId
        );

        if(index !== -1) {
          vehicleAccidentInvolved.splice(index, 1);
        }

        renderAccidentVehicles();
      }
    } catch(error) {
      console.error("Delete vehicle failed:", error);
    }
  });

  vehicleForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const selectedPeopleId = document.getElementById("vehicleDriverSelect").value;

    if(!selectedPeopleId) {
      alert("Please select a driver");
      return;
    }

    try {
      const response = await fetch("../api/add_vehicles_to_accident.php", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
          accident_id: accidentId,
          people_id: selectedPeopleId,
          vehicle_name: document.getElementById("vehicleModel").value,
          vehicle_type: document.getElementById("vehicleType").value,
          plate_number: document.getElementById("vehiclePlate").value,
          damage_level: document.getElementById("vehicleDamage").value
        })
      });

      const result = await response.json();

      if(result.success) {
        vehicleModal.style.display = "none";
        vehicleForm.reset();

        const updateVehicles = await getAccidentVehicleDetails(accidentId);
        vehicleAccidentInvolved.length = 0;
        vehicleAccidentInvolved.push(...updateVehicles);
        renderAccidentVehicles();
      } else {
        alert(result.messge || "Failed to add vehicle");
        console.log("Server response:", result);
      }
    } catch(error) {
      console.error("Vehicle insert failed:", error);
    }
  });

  document.getElementById('cancelVehicleBtn').addEventListener('click', () => {
    vehicleModal.style.display = 'none';
    vehicleForm.reset();
  });

  document.getElementById("dispatchedOfficerSelect").addEventListener('change', async (e) => {
    const officerId = e.target.value;
    if(!officerId) return;

    try {
      const response = await fetch("../api/assign_officer.php", {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          accident_id: accidentId,
          officer_id: officerId
        })
      });

      const data = await response.json();

    } catch(error) {
      console.error("Invalid data", error);
    }
  });

  const statusSelect = document.getElementById('statusSelect');
  const badge = document.getElementById('statusBadge');

  const initialOption = statusSelect.options[statusSelect.selectedIndex];
  badge.textContent = initialOption.textContent;

  statusSelect.addEventListener('change', async (e) => {
    const statusId = e.target.value;
    const selectedOption = e.target.options[e.target.selectedIndex];
    const statusText = selectedOption.textContent;
    badge.textContent = selectedOption.textContent;

    if(!statusId) return;

    try {
      const response = await fetch("../api/assign_status.php", {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          accident_id: accidentId,
          status_id: statusId 
        })
      });

      const data = await response.json();

      if(data.success) {
        renderAccidentItem(accidentId);
      }
    } catch(error) {
      console.error("Status data did not send", error);
    }
  });
}