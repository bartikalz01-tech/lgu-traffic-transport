        document.addEventListener('DOMContentLoaded', function() {
            // Data storage for the form
            let peopleInvolved = [];
            let vehiclesInvolved = [];
            let currentAccidentId = document.getElementById('accidentId').value;
            
            // Initialize counters
            updatePeopleCount();
            updateVehiclesCount();
            
            // Add Person functionality
            const addPersonBtn = document.getElementById('addPersonBtn');
            const peopleTableBody = document.getElementById('peopleTableBody');
            
            addPersonBtn.addEventListener('click', function() {
                const name = document.getElementById('personName').value.trim();
                const contact = document.getElementById('personContact').value.trim();
                const role = document.getElementById('personRole').value;
                const status = document.getElementById('personStatus').value;
                const address = document.getElementById('personAddress').value.trim();
                
                // Validate required fields
                if (!name || !role || !status) {
                    showNotification('Please fill in all required fields for person', 'error');
                    return;
                }
                
                // Add person to array
                const personId = 'PPL-' + Date.now();
                peopleInvolved.push({
                    id: personId,
                    name: name,
                    contact: contact,
                    role: role,
                    status: status,
                    address: address
                });
                
                // Add to table
                addPersonToTable(personId, name, role, status);
                
                // Clear form fields
                document.getElementById('personName').value = '';
                document.getElementById('personContact').value = '';
                document.getElementById('personRole').value = '';
                document.getElementById('personStatus').value = '';
                document.getElementById('personAddress').value = '';
                
                updatePeopleCount();
                showNotification('Person added successfully', 'success');
            });
            
            function addPersonToTable(id, name, role, status) {
                const row = document.createElement('tr');
                row.dataset.id = id;
                
                const roleText = {
                    'driver': 'Driver',
                    'passenger': 'Passenger',
                    'pedestrian': 'Pedestrian',
                    'witness': 'Witness',
                    'owner': 'Vehicle Owner'
                }[role] || role;
                
                const statusText = {
                    'uninjured': 'Uninjured',
                    'minor_injuries': 'Minor Injuries',
                    'serious_injuries': 'Serious Injuries',
                    'critical': 'Critical',
                    'fatal': 'Fatal'
                }[status] || status;
                
                row.innerHTML = `
                    <td>${name}</td>
                    <td>${roleText}</td>
                    <td><span class="status-badge ${getStatusClass(status)}">${statusText}</span></td>
                    <td>
                        <div class="table-actions">
                            <button class="btn-icon edit-person" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon delete delete-person" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                `;
                
                peopleTableBody.appendChild(row);
                
                // Add delete functionality
                row.querySelector('.delete-person').addEventListener('click', function() {
                    const personId = row.dataset.id;
                    peopleInvolved = peopleInvolved.filter(p => p.id !== personId);
                    row.remove();
                    updatePeopleCount();
                    showNotification('Person removed', 'info');
                });
                
                // Add edit functionality
                row.querySelector('.edit-person').addEventListener('click', function() {
                    const person = peopleInvolved.find(p => p.id === row.dataset.id);
                    if (person) {
                        document.getElementById('personName').value = person.name;
                        document.getElementById('personContact').value = person.contact;
                        document.getElementById('personRole').value = person.role;
                        document.getElementById('personStatus').value = person.status;
                        document.getElementById('personAddress').value = person.address;
                        
                        peopleInvolved = peopleInvolved.filter(p => p.id !== person.id);
                        row.remove();
                        updatePeopleCount();
                        showNotification('Person loaded for editing', 'info');
                    }
                });
            }
            
            // Add Vehicle functionality
            const addVehicleBtn = document.getElementById('addVehicleBtn');
            const vehiclesTableBody = document.getElementById('vehiclesTableBody');
            
            addVehicleBtn.addEventListener('click', function() {
                const plate = document.getElementById('vehiclePlate').value.trim();
                const type = document.getElementById('vehicleType').value;
                const name = document.getElementById('vehicleName').value.trim();
                const damage = document.getElementById('damageLevel').value;
                
                // Validate required fields
                if (!plate || !type || !damage) {
                    showNotification('Please fill in all required fields for vehicle', 'error');
                    return;
                }
                
                // Add vehicle to array
                const vehicleId = 'VEH-' + Date.now();
                vehiclesInvolved.push({
                    id: vehicleId,
                    plate: plate,
                    type: type,
                    name: name,
                    damage: damage
                });
                
                // Add to table
                addVehicleToTable(vehicleId, plate, type, damage);
                
                // Clear form fields
                document.getElementById('vehiclePlate').value = '';
                document.getElementById('vehicleType').value = '';
                document.getElementById('vehicleName').value = '';
                document.getElementById('damageLevel').value = '';
                
                updateVehiclesCount();
                showNotification('Vehicle added successfully', 'success');
            });
            
            function addVehicleToTable(id, plate, type, damage) {
                const row = document.createElement('tr');
                row.dataset.id = id;
                
                const typeText = {
                    'private': 'Private',
                    'public': 'PUV',
                    'motorcycle': 'Motorcycle',
                    'truck': 'Truck',
                    'government': 'Government'
                }[type] || type;
                
                const damageText = {
                    'none': 'No Damage',
                    'minor': 'Minor',
                    'moderate': 'Moderate',
                    'severe': 'Severe',
                    'totaled': 'Totaled'
                }[damage] || damage;
                
                row.innerHTML = `
                    <td>${plate}</td>
                    <td>${typeText}</td>
                    <td><span class="status-badge ${getDamageClass(damage)}">${damageText}</span></td>
                    <td>
                        <div class="table-actions">
                            <button class="btn-icon edit-vehicle" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon delete delete-vehicle" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                `;
                
                vehiclesTableBody.appendChild(row);
                
                // Add delete functionality
                row.querySelector('.delete-vehicle').addEventListener('click', function() {
                    const vehicleId = row.dataset.id;
                    vehiclesInvolved = vehiclesInvolved.filter(v => v.id !== vehicleId);
                    row.remove();
                    updateVehiclesCount();
                    showNotification('Vehicle removed', 'info');
                });
                
                // Add edit functionality
                row.querySelector('.edit-vehicle').addEventListener('click', function() {
                    const vehicle = vehiclesInvolved.find(v => v.id === row.dataset.id);
                    if (vehicle) {
                        document.getElementById('vehiclePlate').value = vehicle.plate;
                        document.getElementById('vehicleType').value = vehicle.type;
                        document.getElementById('vehicleName').value = vehicle.name;
                        document.getElementById('damageLevel').value = vehicle.damage;
                        
                        vehiclesInvolved = vehiclesInvolved.filter(v => v.id !== vehicle.id);
                        row.remove();
                        updateVehiclesCount();
                        showNotification('Vehicle loaded for editing', 'info');
                    }
                });
            }
            
            // Update counters
            function updatePeopleCount() {
                document.getElementById('peopleCount').textContent = peopleInvolved.length;
            }
            
            function updateVehiclesCount() {
                document.getElementById('vehiclesCount').textContent = vehiclesInvolved.length;
            }
            
            // Get status class for badges
            function getStatusClass(status) {
                const classes = {
                    'uninjured': 'status-resolved',
                    'minor_injuries': 'status-new',
                    'serious_injuries': 'status-investigation',
                    'critical': 'status-critical',
                    'fatal': 'status-critical'
                };
                return classes[status] || 'status-new';
            }
            
            function getDamageClass(damage) {
                const classes = {
                    'none': 'status-resolved',
                    'minor': 'status-new',
                    'moderate': 'status-investigation',
                    'severe': 'status-critical',
                    'totaled': 'status-critical'
                };
                return classes[damage] || 'status-new';
            }
            
            // Form submission
            const submitReportBtn = document.getElementById('submitReportBtn');
            const saveDraftBtn = document.getElementById('saveDraftBtn');
            const resetFormBtn = document.getElementById('resetFormBtn');
            
            submitReportBtn.addEventListener('click', function() {
                if (validateForm()) {
                    const reportData = collectFormData();
                    submitReport(reportData, false);
                }
            });
            
            saveDraftBtn.addEventListener('click', function() {
                const reportData = collectFormData();
                submitReport(reportData, true);
            });
            
            resetFormBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to reset the form? All unsaved data will be lost.')) {
                    resetForm();
                }
            });
            
            function validateForm() {
                const roadId = document.getElementById('roadId').value;
                const accidentType = document.getElementById('accidentType').value;
                const severityLevel = document.getElementById('severityLevel').value;
                const accidentDate = document.getElementById('accidentDate').value;
                const accidentTime = document.getElementById('accidentTime').value;
                const description = document.getElementById('description').value.trim();
                
                if (!roadId || !accidentType || !severityLevel || !accidentDate || !accidentTime || !description) {
                    showNotification('Please fill in all required fields in Accident Details', 'error');
                    return false;
                }
                
                if (peopleInvolved.length === 0) {
                    showNotification('Please add at least one person involved', 'error');
                    return false;
                }
                
                if (vehiclesInvolved.length === 0) {
                    showNotification('Please add at least one vehicle involved', 'error');
                    return false;
                }
                
                return true;
            }
            
            function collectFormData() {
                return {
                    accidentId: document.getElementById('accidentId').value,
                    roadId: document.getElementById('roadId').value,
                    accidentType: document.getElementById('accidentType').value,
                    severityLevel: document.getElementById('severityLevel').value,
                    accidentDate: document.getElementById('accidentDate').value,
                    accidentTime: document.getElementById('accidentTime').value,
                    description: document.getElementById('description').value,
                    peopleInvolved: peopleInvolved,
                    vehiclesInvolved: vehiclesInvolved,
                    timestamp: new Date().toISOString(),
                    status: 'new'
                };
            }
            
            function submitReport(data, isDraft) {
                // Show loading state
                const btn = isDraft ? saveDraftBtn : submitReportBtn;
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                btn.disabled = true;
                
                // Simulate API call
                setTimeout(() => {
                    // In a real application, this would be an API call
                    console.log('Submitting report:', data);
                    
                    // Generate new accident ID for next report
                    const newAccidentId = 'ACC-' + new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
                    document.getElementById('accidentId').value = newAccidentId;
                    currentAccidentId = newAccidentId;
                    
                    // Add to recent reports list
                    addToRecentReports(data, isDraft);
                    
                    // Reset form
                    resetForm();
                    
                    // Show success message
                    showNotification(
                        isDraft ? 'Report saved as draft successfully!' : 'Accident report submitted successfully!',
                        'success'
                    );
                    
                    // Restore button state
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }, 1500);
            }
            
            function addToRecentReports(data, isDraft) {
                const accidentList = document.getElementById('accidentList');
                const roadSelect = document.getElementById('roadId');
                const selectedRoad = roadSelect.options[roadSelect.selectedIndex]?.text || 'Unknown Road';
                
                const accidentItem = document.createElement('div');
                accidentItem.className = 'accident-item';
                accidentItem.innerHTML = `
                    <div class="accident-header">
                        <span class="accident-id">${data.accidentId}</span>
                        <span class="accident-time">Just now</span>
                    </div>
                    <div class="accident-details">
                        <h4>${getAccidentTypeText(data.accidentType)} at ${selectedRoad}</h4>
                        <div class="accident-meta">
                            <span><i class="fas fa-road"></i> ${selectedRoad}</span>
                            <span><i class="fas fa-users"></i> ${data.peopleInvolved.length} People</span>
                            <span><i class="fas fa-car"></i> ${data.vehiclesInvolved.length} Vehicles</span>
                        </div>
                        <div>
                            <span class="status-badge ${isDraft ? 'status-new' : 'status-investigation'}">
                                ${isDraft ? 'Draft' : 'Under Investigation'}
                            </span>
                        </div>
                    </div>
                `;
                
                // Add click functionality
                accidentItem.addEventListener('click', function() {
                    document.querySelectorAll('.accident-item').forEach(item => {
                        item.classList.remove('active');
                    });
                    this.classList.add('active');
                    
                    // In a real application, this would load the report details
                    showNotification(`Loading report ${data.accidentId}...`, 'info');
                });
                
                // Insert at the beginning of the list
                accidentList.insertBefore(accidentItem, accidentList.firstChild);
            }
            
            function getAccidentTypeText(type) {
                const types = {
                    'collision': 'Vehicle Collision',
                    'single': 'Single Vehicle Accident',
                    'pedestrian': 'Pedestrian Accident',
                    'property': 'Property Damage',
                    'other': 'Accident'
                };
                return types[type] || 'Accident';
            }
            
            function resetForm() {
                // Clear form fields
                document.getElementById('roadId').value = '';
                document.getElementById('accidentType').value = '';
                document.getElementById('severityLevel').value = '';
                document.getElementById('description').value = '';
                
                // Clear tables
                peopleInvolved = [];
                vehiclesInvolved = [];
                peopleTableBody.innerHTML = '';
                vehiclesTableBody.innerHTML = '';
                
                // Update counters
                updatePeopleCount();
                updateVehiclesCount();
            }
            
            // Quick Report Modal
            const quickReportBtn = document.getElementById('quickReportBtn');
            const quickReportModal = document.getElementById('quickReportModal');
            const closeQuickModal = document.getElementById('closeQuickModal');
            const cancelQuickReport = document.getElementById('cancelQuickReport');
            const submitQuickReport = document.getElementById('submitQuickReport');
            
            quickReportBtn.addEventListener('click', function() {
                quickReportModal.classList.add('show');
            });
            
            closeQuickModal.addEventListener('click', function() {
                quickReportModal.classList.remove('show');
            });
            
            cancelQuickReport.addEventListener('click', function() {
                quickReportModal.classList.remove('show');
            });
            
            submitQuickReport.addEventListener('click', function() {
                const location = document.getElementById('quickLocation').value.trim();
                const description = document.getElementById('quickDescription').value.trim();
                const severity = document.getElementById('quickSeverity').value;
                
                if (!location || !description) {
                    showNotification('Please fill in all required fields', 'error');
                    return;
                }
                
                // Create quick report
                const quickData = {
                    accidentId: 'ACC-QUICK-' + Date.now(),
                    location: location,
                    description: description,
                    severity: severity,
                    timestamp: new Date().toISOString(),
                    status: 'new'
                };
                
                // Simulate submission
                const btn = submitQuickReport;
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
                btn.disabled = true;
                
                setTimeout(() => {
                    console.log('Quick report submitted:', quickData);
                    quickReportModal.classList.remove('show');
                    
                    // Clear modal form
                    document.getElementById('quickLocation').value = '';
                    document.getElementById('quickDescription').value = '';
                    document.getElementById('quickSeverity').value = 'moderate';
                    
                    // Add to recent reports
                    const accidentList = document.getElementById('accidentList');
                    const accidentItem = document.createElement('div');
                    accidentItem.className = 'accident-item';
                    accidentItem.innerHTML = `
                        <div class="accident-header">
                            <span class="accident-id">${quickData.accidentId}</span>
                            <span class="accident-time">Just now</span>
                        </div>
                        <div class="accident-details">
                            <h4>Quick Report: ${location}</h4>
                            <div class="accident-meta">
                                <span><i class="fas fa-map-marker-alt"></i> ${location}</span>
                                <span><i class="fas fa-bolt"></i> Quick Report</span>
                            </div>
                            <div>
                                <span class="status-badge status-new">Pending Details</span>
                            </div>
                        </div>
                    `;
                    
                    accidentList.insertBefore(accidentItem, accidentList.firstChild);
                    
                    showNotification('Quick report submitted successfully! Please complete the details in the full form.', 'success');
                    
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }, 1000);
            });
            
            // Close modal when clicking outside
            quickReportModal.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.classList.remove('show');
                }
            });
            
            // Search functionality
            const searchReports = document.getElementById('searchReports');
            searchReports.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const items = document.querySelectorAll('.accident-item');
                
                items.forEach(item => {
                    const text = item.textContent.toLowerCase();
                    item.style.display = text.includes(searchTerm) ? '' : 'none';
                });
            });
            
            // Refresh list
            const refreshListBtn = document.getElementById('refreshListBtn');
            refreshListBtn.addEventListener('click', function() {
                this.querySelector('i').classList.add('fa-spin');
                showNotification('Refreshing reports...', 'info');
                
                setTimeout(() => {
                    this.querySelector('i').classList.remove('fa-spin');
                    showNotification('Reports refreshed', 'success');
                }, 1000);
            });
            
            // Accident item click handler
            document.querySelectorAll('.accident-item').forEach(item => {
                item.addEventListener('click', function() {
                    document.querySelectorAll('.accident-item').forEach(i => {
                        i.classList.remove('active');
                    });
                    this.classList.add('active');
                    
                    // In a real application, this would load the report details
                    const accidentId = this.querySelector('.accident-id').textContent;
                    showNotification(`Loading report ${accidentId}...`, 'info');
                });
            });
            
            // Notification system
            function showNotification(message, type = 'info') {
                const notification = document.createElement('div');
                notification.className = 'notification';
                notification.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : 'var(--primary-color-1)'};
                    color: white;
                    padding: 12px 16px;
                    border-radius: 8px;
                    z-index: 1000;
                    font-size: 0.875rem;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    animation: slideIn 0.3s ease-out;
                `;
                
                notification.innerHTML = `
                    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                    <span>${message}</span>
                `;
                
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    notification.style.animation = 'slideOut 0.3s ease-out';
                    setTimeout(() => notification.remove(), 300);
                }, 3000);
                
                // Add CSS for animations if not already present
                if (!document.getElementById('notification-animations')) {
                    const style = document.createElement('style');
                    style.id = 'notification-animations';
                    style.textContent = `
                        @keyframes slideIn {
                            from { transform: translateX(100%); opacity: 0; }
                            to { transform: translateX(0); opacity: 1; }
                        }
                        @keyframes slideOut {
                            from { transform: translateX(0); opacity: 1; }
                            to { transform: translateX(100%); opacity: 0; }
                        }
                    `;
                    document.head.appendChild(style);
                }
            }
            
            // Form validation on input
            const requiredFields = document.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                field.addEventListener('blur', function() {
                    if (!this.value.trim()) {
                        this.style.borderColor = '#ef4444';
                    } else {
                        this.style.borderColor = '';
                    }
                });
            });
        });