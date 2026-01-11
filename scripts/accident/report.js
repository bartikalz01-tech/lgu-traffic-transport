    document.addEventListener('DOMContentLoaded', function() {
      // Sample data for the selected accident
      const accidentData = {
        id: 'ACC-20260115-001',
        type: 'Vehicle Collision',
        location: 'Road 123, Caloocan City',
        dateTime: 'Jan 15, 2025 · 10:15 AM',
        status: 'investigation',
        peopleCount: 3,
        vehiclesCount: 2,
        severity: 'Moderate',
        notes: 'Initial investigation shows both vehicles were speeding. Traffic cameras captured the incident.\nWitness statements have been collected. Police report pending.',
        notesTimestamp: 'Jan 15, 2025 2:30 PM',
        people: [
          {
            id: 1,
            name: 'Juan Dela Cruz',
            role: 'driver',
            injury: 'minor',
            contact: '0912-345-6789',
            address: '123 example street, Caloocan City'
          },
          {
            id: 2,
            name: 'Maria Santos',
            role: 'passenger',
            injury: 'uninjured',
            contact: '',
            address: '456 sample avenue, Caloocan City'
          },
          {
            id: 3,
            name: 'John Doe',
            role: 'pedestrian',
            injury: 'moderate',
            contact: '0917-890-1234',
            address: '789 test road, Caloocan City'
          }
        ],
        vehicles: [
          {
            id: 1,
            driver: 'Juan Dela Cruz',
            plate: 'ABC-1234',
            type: 'private',
            model: 'Toyota Vios',
            damage: 'moderate',
            insurance: 'PhilAm Insurance'
          },
          {
            id: 2,
            driver: 'John Doe',
            plate: 'XYZ-5678',
            type: 'motorcycle',
            model: 'Honda Click',
            damage: 'minor',
            insurance: 'Malayan Insurance'
          }
        ]
      };

      // DOM Elements
      const statusSelect = document.getElementById('statusSelect');
      const statusBadge = document.getElementById('statusBadge');
      const saveIndicator = document.getElementById('saveIndicator');
      const addPersonBtn = document.getElementById('addPersonBtn');
      const addVehicleBtn = document.getElementById('addVehicleBtn');
      const personModal = document.getElementById('personModal');
      const vehicleModal = document.getElementById('vehicleModal');
      const personForm = document.getElementById('personForm');
      const vehicleForm = document.getElementById('vehicleForm');
      const peopleTableBody = document.getElementById('peopleTableBody');
      const vehiclesTableBody = document.getElementById('vehiclesTableBody');
      const peopleEmptyState = document.getElementById('peopleEmptyState');
      const vehiclesEmptyState = document.getElementById('vehiclesEmptyState');
      const saveReportBtn = document.getElementById('saveReportBtn');
      const printReportBtn = document.getElementById('printReportBtn');
      const markResolvedBtn = document.getElementById('markResolvedBtn');
      const investigationNotes = document.getElementById('investigationNotes');
      const notesTimestamp = document.getElementById('notesTimestamp');

      // Status badge colors
      const statusColors = {
        investigation: { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', text: 'Under Investigation' },
        resolved: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', text: 'Resolved' },
        critical: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', text: 'Critical' },
        pending: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', text: 'Pending Review' },
        closed: { bg: 'rgba(107, 114, 128, 0.1)', color: '#6b7280', text: 'Case Closed' }
      };

      // Initialize the page with data
      function initializePage() {
        // Set basic accident info
        document.getElementById('accidentId').textContent = accidentData.id;
        document.getElementById('accidentType').textContent = accidentData.type;
        document.getElementById('accidentLocation').textContent = accidentData.location;
        document.getElementById('accidentDateTime').textContent = accidentData.dateTime;
        document.getElementById('peopleCount').textContent = accidentData.peopleCount;
        document.getElementById('vehiclesCount').textContent = accidentData.vehiclesCount;
        document.getElementById('severityLevel').textContent = accidentData.severity;
        document.getElementById('peopleCountBadge').textContent = accidentData.peopleCount;
        document.getElementById('vehiclesCountBadge').textContent = accidentData.vehiclesCount;
        
        // Set status
        statusSelect.value = accidentData.status;
        updateStatusBadge(accidentData.status);
        
        // Set notes
        investigationNotes.value = accidentData.notes;
        notesTimestamp.textContent = accidentData.notesTimestamp;
        
        // Populate tables
        renderPeopleTable();
        renderVehiclesTable();
      }

      // Update status badge
      function updateStatusBadge(status) {
        const statusConfig = statusColors[status];
        if (statusConfig) {
          statusBadge.textContent = statusConfig.text;
          statusBadge.style.backgroundColor = statusConfig.bg;
          statusBadge.style.color = statusConfig.color;
          statusBadge.className = 'status-badge';
        }
      }

      // Render people table
      function renderPeopleTable() {
        peopleTableBody.innerHTML = '';
        
        if (accidentData.people.length === 0) {
          peopleEmptyState.style.display = 'block';
          return;
        }
        
        peopleEmptyState.style.display = 'none';
        
        accidentData.people.forEach(person => {
          const row = document.createElement('tr');
          
          const roleText = {
            driver: 'Driver',
            passenger: 'Passenger',
            pedestrian: 'Pedestrian',
            witness: 'Witness',
            responder: 'First Responder'
          }[person.role] || person.role;
          
          const injuryText = {
            uninjured: 'Uninjured',
            minor: 'Minor Injuries',
            moderate: 'Moderate Injuries',
            severe: 'Severe Injuries',
            fatal: 'Fatal'
          }[person.injury] || person.injury;
          
          row.innerHTML = `
            <td><span class="editable-field" data-id="${person.id}" data-field="name">${person.name}</span></td>
            <td>
              <select class="editable-field" data-id="${person.id}" data-field="role" style="border: 1px solid var(--border-color-1); padding: 0.25rem;">
                <option value="driver" ${person.role === 'driver' ? 'selected' : ''}>Driver</option>
                <option value="passenger" ${person.role === 'passenger' ? 'selected' : ''}>Passenger</option>
                <option value="pedestrian" ${person.role === 'pedestrian' ? 'selected' : ''}>Pedestrian</option>
                <option value="witness" ${person.role === 'witness' ? 'selected' : ''}>Witness</option>
                <option value="responder" ${person.role === 'responder' ? 'selected' : ''}>First Responder</option>
              </select>
            </td>
            <td>
              <select class="editable-field" data-id="${person.id}" data-field="injury" style="border: 1px solid var(--border-color-1); padding: 0.25rem;">
                <option value="uninjured" ${person.injury === 'uninjured' ? 'selected' : ''}>Uninjured</option>
                <option value="minor" ${person.injury === 'minor' ? 'selected' : ''}>Minor Injuries</option>
                <option value="moderate" ${person.injury === 'moderate' ? 'selected' : ''}>Moderate Injuries</option>
                <option value="severe" ${person.injury === 'severe' ? 'selected' : ''}>Severe Injuries</option>
                <option value="fatal" ${person.injury === 'fatal' ? 'selected' : ''}>Fatal</option>
              </select>
            </td>
            <td><span class="editable-field" data-id="${person.id}" data-field="contact">${person.contact || '—'}</span></td>
            <td><span class="editable-field" data-id="${person.id}" data-field="address">${person.address}</span></td>
            <td>
              <button class="btn btn-danger btn-sm delete-person" data-id="${person.id}">
                <i class="fas fa-trash"></i> Delete
              </button>
            </td>
          `;
          
          peopleTableBody.appendChild(row);
        });
      }

      // Render vehicles table
      function renderVehiclesTable() {
        vehiclesTableBody.innerHTML = '';
        
        if (accidentData.vehicles.length === 0) {
          vehiclesEmptyState.style.display = 'block';
          return;
        }
        
        vehiclesEmptyState.style.display = 'none';
        
        accidentData.vehicles.forEach(vehicle => {
          const row = document.createElement('tr');
          
          const typeText = {
            private: 'Private Vehicle',
            commercial: 'Commercial Vehicle',
            motorcycle: 'Motorcycle',
            public: 'Public Utility Vehicle',
            government: 'Government Vehicle'
          }[vehicle.type] || vehicle.type;
          
          const damageText = {
            none: 'No Damage',
            minor: 'Minor',
            moderate: 'Moderate',
            severe: 'Severe',
            totaled: 'Totaled'
          }[vehicle.damage] || vehicle.damage;
          
          row.innerHTML = `
            <td><span class="editable-field" data-id="${vehicle.id}" data-field="driver">${vehicle.driver}</span></td>
            <td><span class="editable-field" data-id="${vehicle.id}" data-field="plate">${vehicle.plate}</span></td>
            <td>
              <select class="editable-field" data-id="${vehicle.id}" data-field="type" style="border: 1px solid var(--border-color-1); padding: 0.25rem;">
                <option value="private" ${vehicle.type === 'private' ? 'selected' : ''}>Private Vehicle</option>
                <option value="commercial" ${vehicle.type === 'commercial' ? 'selected' : ''}>Commercial Vehicle</option>
                <option value="motorcycle" ${vehicle.type === 'motorcycle' ? 'selected' : ''}>Motorcycle</option>
                <option value="public" ${vehicle.type === 'public' ? 'selected' : ''}>Public Utility Vehicle</option>
                <option value="government" ${vehicle.type === 'government' ? 'selected' : ''}>Government Vehicle</option>
              </select>
            </td>
            <td><span class="editable-field" data-id="${vehicle.id}" data-field="model">${vehicle.model}</span></td>
            <td>
              <select class="editable-field" data-id="${vehicle.id}" data-field="damage" style="border: 1px solid var(--border-color-1); padding: 0.25rem;">
                <option value="none" ${vehicle.damage === 'none' ? 'selected' : ''}>No Damage</option>
                <option value="minor" ${vehicle.damage === 'minor' ? 'selected' : ''}>Minor</option>
                <option value="moderate" ${vehicle.damage === 'moderate' ? 'selected' : ''}>Moderate</option>
                <option value="severe" ${vehicle.damage === 'severe' ? 'selected' : ''}>Severe</option>
                <option value="totaled" ${vehicle.damage === 'totaled' ? 'selected' : ''}>Totaled</option>
              </select>
            </td>
            <td><span class="editable-field" data-id="${vehicle.id}" data-field="insurance">${vehicle.insurance || '—'}</span></td>
            <td>
              <button class="btn btn-danger btn-sm delete-vehicle" data-id="${vehicle.id}">
                <i class="fas fa-trash"></i> Delete
              </button>
            </td>
          `;
          
          vehiclesTableBody.appendChild(row);
        });
      }

      // Show save indicator
      function showSaveIndicator() {
        saveIndicator.style.display = 'flex';
        setTimeout(() => {
          saveIndicator.style.display = 'none';
        }, 3000);
      }

      // Update counts
      function updateCounts() {
        accidentData.peopleCount = accidentData.people.length;
        accidentData.vehiclesCount = accidentData.vehicles.length;
        
        document.getElementById('peopleCount').textContent = accidentData.peopleCount;
        document.getElementById('vehiclesCount').textContent = accidentData.vehiclesCount;
        document.getElementById('peopleCountBadge').textContent = accidentData.peopleCount;
        document.getElementById('vehiclesCountBadge').textContent = accidentData.vehiclesCount;
      }

      // Event Listeners
      statusSelect.addEventListener('change', function() {
        accidentData.status = this.value;
        updateStatusBadge(this.value);
        showSaveIndicator();
      });

      addPersonBtn.addEventListener('click', () => {
        personModal.style.display = 'flex';
      });

      addVehicleBtn.addEventListener('click', () => {
        vehicleModal.style.display = 'flex';
      });

      // Close modals
      document.getElementById('closePersonModal').addEventListener('click', () => {
        personModal.style.display = 'none';
        personForm.reset();
      });

      document.getElementById('closeVehicleModal').addEventListener('click', () => {
        vehicleModal.style.display = 'none';
        vehicleForm.reset();
      });

      document.getElementById('cancelPersonBtn').addEventListener('click', () => {
        personModal.style.display = 'none';
        personForm.reset();
      });

      document.getElementById('cancelVehicleBtn').addEventListener('click', () => {
        vehicleModal.style.display = 'none';
        vehicleForm.reset();
      });

      // Add person
      personForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newPerson = {
          id: Date.now(),
          name: document.getElementById('personName').value,
          role: document.getElementById('personRole').value,
          injury: document.getElementById('personInjury').value,
          contact: document.getElementById('personContact').value,
          address: document.getElementById('personAddress').value
        };
        
        accidentData.people.push(newPerson);
        renderPeopleTable();
        updateCounts();
        personModal.style.display = 'none';
        personForm.reset();
        showSaveIndicator();
      });

      // Add vehicle
      vehicleForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newVehicle = {
          id: Date.now(),
          driver: document.getElementById('vehicleDriver').value,
          plate: document.getElementById('vehiclePlate').value,
          type: document.getElementById('vehicleType').value,
          model: document.getElementById('vehicleModel').value,
          damage: document.getElementById('vehicleDamage').value,
          insurance: document.getElementById('vehicleInsurance').value
        };
        
        accidentData.vehicles.push(newVehicle);
        renderVehiclesTable();
        updateCounts();
        vehicleModal.style.display = 'none';
        vehicleForm.reset();
        showSaveIndicator();
      });

      // Delete person
      peopleTableBody.addEventListener('click', function(e) {
        if (e.target.closest('.delete-person')) {
          const personId = parseInt(e.target.closest('.delete-person').dataset.id);
          accidentData.people = accidentData.people.filter(p => p.id !== personId);
          renderPeopleTable();
          updateCounts();
          showSaveIndicator();
        }
      });

      // Delete vehicle
      vehiclesTableBody.addEventListener('click', function(e) {
        if (e.target.closest('.delete-vehicle')) {
          const vehicleId = parseInt(e.target.closest('.delete-vehicle').dataset.id);
          accidentData.vehicles = accidentData.vehicles.filter(v => v.id !== vehicleId);
          renderVehiclesTable();
          updateCounts();
          showSaveIndicator();
        }
      });

      // Update editable fields
      peopleTableBody.addEventListener('blur', function(e) {
        const editable = e.target.closest('.editable-field');
        if (editable && editable.dataset.id && editable.dataset.field) {
          const id = parseInt(editable.dataset.id);
          const field = editable.dataset.field;
          const value = editable.textContent || editable.value;
          
          const person = accidentData.people.find(p => p.id === id);
          if (person) {
            person[field] = value;
            showSaveIndicator();
          }
        }
      });

      vehiclesTableBody.addEventListener('blur', function(e) {
        const editable = e.target.closest('.editable-field');
        if (editable && editable.dataset.id && editable.dataset.field) {
          const id = parseInt(editable.dataset.id);
          const field = editable.dataset.field;
          const value = editable.textContent || editable.value;
          
          const vehicle = accidentData.vehicles.find(v => v.id === id);
          if (vehicle) {
            vehicle[field] = value;
            showSaveIndicator();
          }
        }
      });

      // Save report
      saveReportBtn.addEventListener('click', function() {
        // Update notes timestamp
        const now = new Date();
        accidentData.notes = investigationNotes.value;
        accidentData.notesTimestamp = now.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        
        notesTimestamp.textContent = accidentData.notesTimestamp;
        showSaveIndicator();
        
        // In a real application, you would send this data to the server
        console.log('Saving accident data:', accidentData);
      });

      // Print report
      printReportBtn.addEventListener('click', function() {
        window.print();
      });

      // Mark as resolved
      markResolvedBtn.addEventListener('click', function() {
        statusSelect.value = 'resolved';
        accidentData.status = 'resolved';
        updateStatusBadge('resolved');
        
        // Update notes
        const now = new Date();
        const timestamp = now.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        
        accidentData.notes += `\n\n[${timestamp}] Case marked as resolved by Admin User.`;
        investigationNotes.value = accidentData.notes;
        accidentData.notesTimestamp = timestamp;
        notesTimestamp.textContent = timestamp;
        
        showSaveIndicator();
      });

      // Initialize the page
      initializePage();
    });