// permits.js - Permits Management System JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const newPermitBtn = document.getElementById('newPermitBtn');
    const newPermitModal = document.getElementById('newPermitModal');
    const modalCloseBtns = document.querySelectorAll('.modal-close');
    const modalCancelBtns = document.querySelectorAll('.modal-cancel');
    const submitPermitBtn = document.getElementById('submitPermit');
    const permitForm = document.getElementById('permitForm');
    const puvGroupSelect = document.getElementById('puvGroup');
    const vehicleTypeSelect = document.getElementById('vehicleType');
    
    // Load initial data
    loadPUVGroups();
    loadVehicleTypes();
    loadPermits();
    updateStatistics();

    // Event Listeners
    newPermitBtn.addEventListener('click', () => {
        newPermitModal.classList.add('show');
    });

    modalCloseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            closeAllModals();
        });
    });

    modalCancelBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            closeAllModals();
        });
    });

    submitPermitBtn.addEventListener('click', submitPermitForm);

    // Search functionality
    document.getElementById('searchGroups').addEventListener('input', filterGroups);
    document.getElementById('searchPermits').addEventListener('input', filterPermits);

    // Filter functionality
    document.getElementById('permitFilter').addEventListener('change', filterPermits);
    document.getElementById('sortPermits').addEventListener('change', sortPermits);

    // Group selection
    document.addEventListener('click', function(e) {
        if (e.target.closest('.group-item')) {
            const groupItem = e.target.closest('.group-item');
            selectGroup(groupItem.dataset.groupId);
        }
        
        if (e.target.closest('.vehicle-type-item')) {
            const typeItem = e.target.closest('.vehicle-type-item');
            filterByVehicleType(typeItem.dataset.typeId);
        }
    });

    // Add group button
    document.getElementById('addGroupBtn').addEventListener('click', showAddGroupModal);
    document.getElementById('addVehicleTypeBtn').addEventListener('click', showAddVehicleTypeModal);
    document.getElementById('addMemberBtn').addEventListener('click', showAddMemberModal);

    // Functions
    function closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('show');
        });
        permitForm.reset();
    }

    function loadPUVGroups() {
        // Simulate API call
        setTimeout(() => {
            const groups = [
                { id: 1, title: 'Tricycle Operators', description: 'Local tricycle operators association', memberCount: 45 },
                { id: 2, title: 'Jeepney Drivers', description: 'City jeepney operators', memberCount: 120 },
                { id: 3, title: 'UV Express', description: 'Utility vehicle express operators', memberCount: 65 },
                { id: 4, title: 'Bus Operators', description: 'City bus operators association', memberCount: 15 },
                { id: 5, title: 'Taxi Operators', description: 'Taxi services association', memberCount: 85 }
            ];

            const groupsList = document.getElementById('puvGroupsList');
            groupsList.innerHTML = groups.map(group => `
                <div class="group-item" data-group-id="${group.id}">
                    <div class="group-header">
                        <div class="group-title">${group.title}</div>
                        <div class="group-members-count">${group.memberCount} members</div>
                    </div>
                    <div class="group-description">${group.description}</div>
                </div>
            `).join('');

            // Populate select in form
            puvGroupSelect.innerHTML = '<option value="">Select PUV Group</option>' + 
                groups.map(group => `<option value="${group.id}">${group.title}</option>`).join('');
        }, 500);
    }

    function loadVehicleTypes() {
        // Simulate API call
        setTimeout(() => {
            const types = [
                { id: 1, name: 'Tricycle', icon: 'fas fa-motorcycle' },
                { id: 2, name: 'Jeepney', icon: 'fas fa-bus' },
                { id: 3, name: 'UV Express', icon: 'fas fa-van-shuttle' },
                { id: 4, name: 'Bus', icon: 'fas fa-bus-alt' },
                { id: 5, name: 'Taxi', icon: 'fas fa-taxi' },
                { id: 6, name: 'E-Trike', icon: 'fas fa-car' }
            ];

            const typesList = document.getElementById('vehicleTypesList');
            typesList.innerHTML = types.map(type => `
                <div class="vehicle-type-item" data-type-id="${type.id}">
                    <div class="vehicle-type-icon">
                        <i class="${type.icon}"></i>
                    </div>
                    <div class="vehicle-type-name">${type.name}</div>
                </div>
            `).join('');

            // Populate select in form
            vehicleTypeSelect.innerHTML = '<option value="">Select Vehicle Type</option>' + 
                types.map(type => `<option value="${type.id}">${type.name}</option>`).join('');
        }, 500);
    }

    function loadPermits() {
        // Simulate API call
        setTimeout(() => {
            const permits = [
                {
                    id: 'PER-2024-001',
                    holder: 'Juan Dela Cruz',
                    type: 'Tricycle Permit',
                    group: 'Tricycle Operators',
                    startDate: '2024-01-01',
                    endDate: '2024-12-31',
                    status: 'active'
                },
                {
                    id: 'PER-2024-002',
                    holder: 'Maria Santos',
                    type: 'Jeepney Franchise',
                    group: 'Jeepney Drivers',
                    startDate: '2024-02-01',
                    endDate: '2024-11-30',
                    status: 'expiring'
                },
                {
                    id: 'PER-2024-003',
                    holder: 'Pedro Reyes',
                    type: 'UV Express',
                    group: 'UV Express',
                    startDate: '2023-12-01',
                    endDate: '2024-05-31',
                    status: 'expired'
                },
                {
                    id: 'PER-2024-004',
                    holder: 'Ana Torres',
                    type: 'Taxi Permit',
                    group: 'Taxi Operators',
                    startDate: '2024-03-01',
                    endDate: '2025-02-28',
                    status: 'active'
                },
                {
                    id: 'PER-2024-005',
                    holder: 'Carlos Gomez',
                    type: 'Operator Permit',
                    group: 'Bus Operators',
                    startDate: '2024-01-15',
                    endDate: '2024-12-14',
                    status: 'active'
                }
            ];

            const tableBody = document.getElementById('permitsTableBody');
            tableBody.innerHTML = permits.map(permit => `
                <tr>
                    <td><strong>${permit.id}</strong></td>
                    <td>${permit.holder}</td>
                    <td>${permit.type}</td>
                    <td>${permit.group}</td>
                    <td>${permit.startDate}</td>
                    <td>${permit.endDate}</td>
                    <td><span class="permit-status status-${permit.status}">${permit.status}</span></td>
                    <td>
                        <div class="table-actions">
                            <button class="btn btn-sm btn-success" onclick="viewPermit('${permit.id}')">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-info" onclick="editPermit('${permit.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="deletePermit('${permit.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
        }, 800);
    }

    function updateStatistics() {
        // Simulate statistics update
        setTimeout(() => {
            document.getElementById('totalPermits').textContent = '156';
            document.getElementById('activePermits').textContent = '89';
            document.getElementById('expiringSoon').textContent = '23';
            document.getElementById('expiredPermits').textContent = '44';
        }, 1000);
    }

    function filterGroups() {
        const searchTerm = document.getElementById('searchGroups').value.toLowerCase();
        const groups = document.querySelectorAll('.group-item');
        
        groups.forEach(group => {
            const title = group.querySelector('.group-title').textContent.toLowerCase();
            const description = group.querySelector('.group-description').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                group.style.display = 'block';
            } else {
                group.style.display = 'none';
            }
        });
    }

    function filterPermits() {
        const searchTerm = document.getElementById('searchPermits').value.toLowerCase();
        const filterValue = document.getElementById('permitFilter').value;
        const rows = document.querySelectorAll('#permitsTableBody tr');
        
        rows.forEach(row => {
            if (row.classList.contains('loading-row')) return;
            
            const text = row.textContent.toLowerCase();
            const status = row.querySelector('.permit-status').className;
            
            let showRow = text.includes(searchTerm);
            
            if (filterValue !== 'all') {
                const statusMatches = status.includes(`status-${filterValue}`);
                showRow = showRow && statusMatches;
            }
            
            row.style.display = showRow ? 'table-row' : 'none';
        });
    }

    function sortPermits() {
        const sortBy = document.getElementById('sortPermits').value;
        // Implementation for sorting would go here
        console.log(`Sorting by: ${sortBy}`);
    }

    function selectGroup(groupId) {
        // Update UI
        document.querySelectorAll('.group-item').forEach(item => {
            item.classList.remove('active');
        });
        event.target.closest('.group-item').classList.add('active');
        
        // Load group members
        loadGroupMembers(groupId);
    }

    function loadGroupMembers(groupId) {
        // Simulate API call
        setTimeout(() => {
            const members = [
                { id: 'MEM-001', name: 'Juan Dela Cruz', position: 'driver', puvNumber: 'TRC-001', vehicleType: 'Tricycle' },
                { id: 'MEM-002', name: 'Maria Santos', position: 'conductor', puvNumber: 'TRC-001', vehicleType: 'Tricycle' },
                { id: 'MEM-003', name: 'Pedro Reyes', position: 'driver', puvNumber: 'TRC-002', vehicleType: 'Tricycle' },
                { id: 'MEM-004', name: 'Ana Torres', position: 'operator', puvNumber: 'JPN-045', vehicleType: 'Jeepney' },
                { id: 'MEM-005', name: 'Carlos Gomez', position: 'dispatcher', puvNumber: 'UVX-012', vehicleType: 'UV Express' }
            ];

            const tableBody = document.getElementById('membersTableBody');
            tableBody.innerHTML = members.map(member => `
                <tr>
                    <td><strong>${member.id}</strong></td>
                    <td>${member.name}</td>
                    <td><span class="position-badge position-${member.position}">${member.position}</span></td>
                    <td><span class="puv-number">${member.puvNumber}</span></td>
                    <td>${member.vehicleType}</td>
                    <td>
                        <div class="table-actions">
                            <button class="btn btn-sm btn-success">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-info">
                                <i class="fas fa-edit"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
        }, 600);
    }

    function filterByVehicleType(typeId) {
        // Update UI
        document.querySelectorAll('.vehicle-type-item').forEach(item => {
            item.classList.remove('active');
        });
        event.target.closest('.vehicle-type-item').classList.add('active');
        
        // Filter permits by vehicle type
        console.log(`Filtering by vehicle type: ${typeId}`);
    }

    function submitPermitForm() {
        if (!permitForm.checkValidity()) {
            alert('Please fill in all required fields.');
            return;
        }

        const formData = new FormData(permitForm);
        const permitData = Object.fromEntries(formData);
        
        // Simulate API call
        console.log('Submitting permit:', permitData);
        
        // Show success message
        alert('Permit application submitted successfully!');
        
        // Close modal and reset form
        closeAllModals();
        
        // Refresh permits list
        loadPermits();
        updateStatistics();
    }

    function showAddGroupModal() {
        const modal = document.getElementById('addGroupModal');
        modal.querySelector('.modal-body').innerHTML = `
            <form class="form-demo">
                <div class="form-group">
                    <label class="form-label" for="groupTitle">Group Title *</label>
                    <input type="text" class="form-control" id="groupTitle" required>
                </div>
                <div class="form-group">
                    <label class="form-label" for="groupDescription">Description</label>
                    <textarea class="form-control" id="groupDescription" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label" for="groupLeader">Group Leader *</label>
                    <input type="text" class="form-control" id="groupLeader" required>
                </div>
                <div class="form-group">
                    <label class="form-label" for="groupContact">Contact Number *</label>
                    <input type="tel" class="form-control" id="groupContact" required>
                </div>
            </form>
        `;
        modal.classList.add('show');
    }

    function showAddVehicleTypeModal() {
        const modal = document.getElementById('addVehicleTypeModal');
        modal.querySelector('.modal-body').innerHTML = `
            <form class="form-demo">
                <div class="form-group">
                    <label class="form-label" for="vehicleTypeName">Vehicle Type Name *</label>
                    <input type="text" class="form-control" id="vehicleTypeName" required>
                </div>
                <div class="form-group">
                    <label class="form-label" for="vehicleIcon">Icon Class *</label>
                    <select class="form-control" id="vehicleIcon" required>
                        <option value="fas fa-motorcycle">Motorcycle/Tricycle</option>
                        <option value="fas fa-bus">Jeepney/Bus</option>
                        <option value="fas fa-van-shuttle">Van/UV Express</option>
                        <option value="fas fa-taxi">Taxi</option>
                        <option value="fas fa-car">Car</option>
                        <option value="fas fa-truck">Truck</option>
                    </select>
                    <small class="form-text">Select appropriate icon for this vehicle type</small>
                </div>
                <div class="form-group">
                    <label class="form-label" for="capacity">Passenger Capacity</label>
                    <input type="number" class="form-control" id="capacity" min="1">
                </div>
                <div class="form-group">
                    <label class="form-label" for="description">Description</label>
                    <textarea class="form-control" id="description" rows="3"></textarea>
                </div>
            </form>
        `;
        modal.classList.add('show');
    }

    function showAddMemberModal() {
        alert('Add Member functionality would open a modal here.');
        // Implementation for adding members
    }

    // Global functions for table actions
    window.viewPermit = function(permitId) {
        alert(`Viewing permit: ${permitId}`);
        // Implementation for viewing permit details
    };

    window.editPermit = function(permitId) {
        alert(`Editing permit: ${permitId}`);
        // Implementation for editing permit
    };

    window.deletePermit = function(permitId) {
        if (confirm(`Are you sure you want to delete permit ${permitId}?`)) {
            console.log(`Deleting permit: ${permitId}`);
            // Implementation for deleting permit
        }
    };

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
});