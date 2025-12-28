document.addEventListener('DOMContentLoaded', function() {
    // Data storage
    let violations = [];
    let currentViolation = null;
    
    // Form elements
    const violationForm = document.getElementById('violationForm');
    const newViolationBtn = document.getElementById('newViolationBtn');
    const resetViolationFormBtn = document.getElementById('resetViolationForm');
    const saveViolationDraftBtn = document.getElementById('saveViolationDraft');
    const submitViolationBtn = document.getElementById('submitViolation');
    
    // Filter elements
    const statusFilter = document.getElementById('statusFilter');
    const searchViolations = document.getElementById('searchViolations');
    const refreshViolationsBtn = document.getElementById('refreshViolations');
    
    // Modal elements
    const paymentModal = document.getElementById('paymentModal');
    const detailsModal = document.getElementById('detailsModal');
    
    // Initialize
    initializeViolationForm();
    attachEventListeners();
    loadSampleViolations();
    
    function initializeViolationForm() {
        // Auto-fill fine amount based on violation type
        const violationTypeSelect = document.getElementById('violationType');
        const fineAmountInput = document.getElementById('violationFine');
        
        const fineAmounts = {
            'OVR-001': 1500,  // Overspeeding
            'OVR-002': 750,   // No Helmet
            'OVR-003': 1000,  // No Seatbelt
            'OVR-004': 2000,  // Running Red Light
            'OVR-005': 1000,  // Illegal Parking
            'OVR-006': 3000,  // No Registration
            'OVR-007': 5000,  // Drunk Driving
            'OVR-008': 2500,  // Reckless Driving
            'OVR-009': 3500,  // Overloading
            'OVR-010': 3000   // Smoke Belching
        };
        
        violationTypeSelect.addEventListener('change', function() {
            if (this.value && fineAmounts[this.value]) {
                fineAmountInput.value = fineAmounts[this.value];
            } else {
                fineAmountInput.value = '';
            }
        });
        
        // Auto-calculate total payment
        const violationAmountInput = document.getElementById('paymentViolationAmount');
        const lateFeeInput = document.getElementById('paymentLateFee');
        const totalAmountInput = document.getElementById('paymentTotalAmount');
        
        function calculateTotalAmount() {
            const violationAmount = parseFloat(violationAmountInput.value) || 0;
            const lateFee = parseFloat(lateFeeInput.value) || 0;
            totalAmountInput.value = (violationAmount + lateFee).toFixed(2);
        }
        
        if (violationAmountInput && lateFeeInput && totalAmountInput) {
            violationAmountInput.addEventListener('input', calculateTotalAmount);
            lateFeeInput.addEventListener('input', calculateTotalAmount);
        }
    }
    
    function attachEventListeners() {
        // New violation button
        newViolationBtn.addEventListener('click', function() {
            resetViolationForm();
            showNotification('Ready to issue new violation ticket', 'info');
        });
        
        // Reset form
        resetViolationFormBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to reset the form? All unsaved data will be lost.')) {
                resetViolationForm();
            }
        });
        
        // Save draft
        saveViolationDraftBtn.addEventListener('click', function() {
            if (validateViolationForm()) {
                const violationData = collectViolationData();
                violationData.status = 'draft';
                saveViolation(violationData, true);
            }
        });
        
        // Submit violation
        submitViolationBtn.addEventListener('click', function() {
            if (validateViolationForm()) {
                const violationData = collectViolationData();
                violationData.status = 'pending';
                saveViolation(violationData, false);
            }
        });
        
        // Filter and search
        statusFilter.addEventListener('change', filterViolations);
        searchViolations.addEventListener('input', filterViolations);
        
        // Refresh list
        refreshViolationsBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            icon.classList.add('fa-spin');
            showNotification('Refreshing violations...', 'info');
            
            setTimeout(() => {
                icon.classList.remove('fa-spin');
                showNotification('Violations refreshed', 'success');
                // In real app, this would reload from server
                loadSampleViolations();
            }, 1000);
        });
        
        // Modal close buttons
        document.getElementById('closePaymentModal')?.addEventListener('click', function() {
            paymentModal.classList.remove('show');
        });
        
        document.getElementById('closeDetailsModal')?.addEventListener('click', function() {
            detailsModal.classList.remove('show');
        });
        
        // Payment modal buttons
        document.getElementById('cancelPayment')?.addEventListener('click', function() {
            paymentModal.classList.remove('show');
        });
        
        document.getElementById('submitPayment')?.addEventListener('click', processPayment);
        
        // Close modals on outside click
        [paymentModal, detailsModal].forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.classList.remove('show');
                }
            });
        });
        
        // Generate report button
        document.getElementById('generateReportBtn')?.addEventListener('click', function() {
            showNotification('Generating report...', 'info');
            setTimeout(() => {
                showNotification('Report generated successfully', 'success');
                // In real app, this would trigger download
            }, 1500);
        });
    }
    
    function validateViolationForm() {
        const requiredFields = [
            'violationType',
            'violationFine',
            'vehiclePlate',
            'driverName',
            'violationLocation'
        ];
        
        for (const fieldId of requiredFields) {
            const field = document.getElementById(fieldId);
            if (!field.value.trim()) {
                showNotification(`Please fill in ${field.previousElementSibling?.textContent || 'all required fields'}`, 'error');
                field.focus();
                field.style.borderColor = '#ef4444';
                return false;
            }
            field.style.borderColor = '';
        }
        
        // Validate fine amount
        const fineAmount = parseFloat(document.getElementById('violationFine').value);
        if (isNaN(fineAmount) || fineAmount <= 0) {
            showNotification('Please enter a valid fine amount', 'error');
            document.getElementById('violationFine').focus();
            document.getElementById('violationFine').style.borderColor = '#ef4444';
            return false;
        }
        
        return true;
    }
    
    function collectViolationData() {
        return {
            id: document.getElementById('violationId').value,
            type: document.getElementById('violationType').value,
            typeText: document.getElementById('violationType').options[document.getElementById('violationType').selectedIndex]?.text || '',
            date: document.getElementById('violationDate').value,
            fine: parseFloat(document.getElementById('violationFine').value),
            vehiclePlate: document.getElementById('vehiclePlate').value,
            vehicleType: document.getElementById('vehicleType').value,
            driverName: document.getElementById('driverName').value,
            driverLicense: document.getElementById('driverLicense').value,
            location: document.getElementById('violationLocation').value,
            description: document.getElementById('violationDescription').value,
            timestamp: new Date().toISOString()
        };
    }
    
    function saveViolation(data, isDraft) {
        const btn = isDraft ? saveViolationDraftBtn : submitViolationBtn;
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        btn.disabled = true;
        
        // Generate new ID
        const newId = 'TKT-' + new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
        
        setTimeout(() => {
            // Add to violations array
            const violation = {
                ...data,
                id: newId,
                status: isDraft ? 'draft' : 'pending',
                paymentStatus: 'unpaid'
            };
            
            violations.unshift(violation);
            
            // Add to table
            addViolationToTable(violation);
            
            // Reset form and generate new ID
            resetViolationForm();
            document.getElementById('violationId').value = 'TKT-' + new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
            
            // Show success message
            showNotification(
                isDraft ? 'Violation saved as draft' : 'Violation ticket issued successfully!',
                'success'
            );
            
            // Restore button
            btn.innerHTML = originalText;
            btn.disabled = false;
        }, 1500);
    }
    
    function addViolationToTable(violation) {
        const tableBody = document.getElementById('violationsTableBody');
        const row = document.createElement('tr');
        
        // Format date
        const date = new Date(violation.date);
        const formattedDate = date.toLocaleDateString('en-PH', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Status badge
        let statusBadge = '';
        let statusText = '';
        let statusClass = '';
        
        if (violation.status === 'draft') {
            statusText = 'Draft';
            statusClass = 'status-pending';
        } else if (violation.paymentStatus === 'paid') {
            statusText = 'Paid';
            statusClass = 'status-paid';
        } else {
            // Check if overdue
            const violationDate = new Date(violation.date);
            const daysDiff = Math.floor((new Date() - violationDate) / (1000 * 60 * 60 * 24));
            if (daysDiff > 30) {
                statusText = 'Overdue';
                statusClass = 'status-overdue';
            } else {
                statusText = 'Pending';
                statusClass = 'status-pending';
            }
        }
        
        row.innerHTML = `
            <td>${violation.id}</td>
            <td>
                <div class="violation-info">
                    <span class="violation-name">${violation.typeText}</span>
                    <small>${violation.location}</small>
                </div>
            </td>
            <td>
                <div class="vehicle-info">
                    <span class="vehicle-plate">${violation.vehiclePlate}</span>
                    <small>${violation.vehicleType || 'N/A'}</small>
                </div>
            </td>
            <td>${violation.driverName}</td>
            <td>${formattedDate}</td>
            <td class="amount">₱ ${violation.fine.toFixed(2)}</td>
            <td>
                <span class="status-badge ${statusClass}">${statusText}</span>
            </td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon view-violation" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon edit-violation" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${violation.paymentStatus !== 'paid' ? `
                    <button class="btn-icon process-payment" title="Process Payment">
                        <i class="fas fa-credit-card"></i>
                    </button>
                    ` : `
                    <button class="btn-icon receipt" title="View Receipt">
                        <i class="fas fa-receipt"></i>
                    </button>
                    `}
                </div>
            </td>
        `;
        
        // Insert at the beginning
        tableBody.insertBefore(row, tableBody.firstChild);
        
        // Attach event listeners to action buttons
        attachRowEventListeners(row, violation);
    }
    
    function attachRowEventListeners(row, violation) {
        // View details
        row.querySelector('.view-violation').addEventListener('click', function() {
            showViolationDetails(violation);
        });
        
        // Edit violation
        row.querySelector('.edit-violation').addEventListener('click', function() {
            editViolation(violation);
        });
        
        // Process payment
        const processPaymentBtn = row.querySelector('.process-payment');
        if (processPaymentBtn) {
            processPaymentBtn.addEventListener('click', function() {
                openPaymentModal(violation);
            });
        }
        
        // View receipt
        const receiptBtn = row.querySelector('.receipt');
        if (receiptBtn) {
            receiptBtn.addEventListener('click', function() {
                showReceipt(violation);
            });
        }
    }
    
    function showViolationDetails(violation) {
        const detailsDiv = document.getElementById('violationDetails');
        
        // Format date
        const date = new Date(violation.date);
        const formattedDate = date.toLocaleDateString('en-PH', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Determine status
        let statusText = '';
        let statusClass = '';
        
        if (violation.status === 'draft') {
            statusText = 'Draft';
            statusClass = 'pending';
        } else if (violation.paymentStatus === 'paid') {
            statusText = 'Paid';
            statusClass = 'paid';
        } else {
            // Check if overdue
            const violationDate = new Date(violation.date);
            const daysDiff = Math.floor((new Date() - violationDate) / (1000 * 60 * 60 * 24));
            if (daysDiff > 30) {
                statusText = 'Overdue';
                statusClass = 'overdue';
            } else {
                statusText = 'Pending Payment';
                statusClass = 'pending';
            }
        }
        
        detailsDiv.innerHTML = `
            <div class="violation-details-card">
                <div class="detail-row">
                    <span class="detail-label">Ticket ID:</span>
                    <span class="detail-value">${violation.id}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Violation Type:</span>
                    <span class="detail-value">${violation.typeText}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Violation Date:</span>
                    <span class="detail-value">${formattedDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Location:</span>
                    <span class="detail-value">${violation.location}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Vehicle:</span>
                    <span class="detail-value">${violation.vehiclePlate} (${violation.vehicleType || 'N/A'})</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Driver:</span>
                    <span class="detail-value">${violation.driverName}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">License No.:</span>
                    <span class="detail-value">${violation.driverLicense || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Fine Amount:</span>
                    <span class="detail-value">₱ ${violation.fine.toFixed(2)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value ${statusClass}">${statusText}</span>
                </div>
                ${violation.description ? `
                <div class="detail-row">
                    <span class="detail-label">Description:</span>
                    <span class="detail-value">${violation.description}</span>
                </div>
                ` : ''}
            </div>
        `;
        
        detailsModal.classList.add('show');
    }
    
    function editViolation(violation) {
        // Populate form with violation data
        document.getElementById('violationType').value = violation.type;
        document.getElementById('violationFine').value = violation.fine;
        document.getElementById('vehiclePlate').value = violation.vehiclePlate;
        document.getElementById('vehicleType').value = violation.vehicleType;
        document.getElementById('driverName').value = violation.driverName;
        document.getElementById('driverLicense').value = violation.driverLicense || '';
        document.getElementById('violationLocation').value = violation.location;
        document.getElementById('violationDescription').value = violation.description || '';
        
        showNotification('Violation loaded for editing', 'info');
    }
    
    function openPaymentModal(violation) {
        currentViolation = violation;
        
        // Populate payment modal
        document.getElementById('paymentTicketId').value = violation.id;
        document.getElementById('paymentViolationAmount').value = violation.fine.toFixed(2);
        document.getElementById('paymentLateFee').value = '0.00';
        
        // Calculate if late fee should be applied
        const violationDate = new Date(violation.date);
        const daysDiff = Math.floor((new Date() - violationDate) / (1000 * 60 * 60 * 24));
        if (daysDiff > 30) {
            const lateFee = violation.fine * 0.20; // 20% late fee
            document.getElementById('paymentLateFee').value = lateFee.toFixed(2);
        }
        
        // Calculate total
        const violationAmount = parseFloat(document.getElementById('paymentViolationAmount').value) || 0;
        const lateFee = parseFloat(document.getElementById('paymentLateFee').value) || 0;
        document.getElementById('paymentTotalAmount').value = (violationAmount + lateFee).toFixed(2);
        
        paymentModal.classList.add('show');
    }
    
    function processPayment() {
        const totalAmount = document.getElementById('paymentTotalAmount').value;
        const paymentMethod = document.getElementById('paymentMethod').value;
        const paymentReference = document.getElementById('paymentReference').value;
        
        if (!totalAmount || parseFloat(totalAmount) <= 0) {
            showNotification('Please enter a valid total amount', 'error');
            return;
        }
        
        if (!paymentMethod) {
            showNotification('Please select a payment method', 'error');
            return;
        }
        
        const btn = document.getElementById('submitPayment');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        btn.disabled = true;
        
        setTimeout(() => {
            // Update violation status
            if (currentViolation) {
                currentViolation.paymentStatus = 'paid';
                currentViolation.paymentDate = new Date().toISOString();
                currentViolation.paymentMethod = paymentMethod;
                currentViolation.paymentReference = paymentReference;
                currentViolation.paidAmount = parseFloat(totalAmount);
                
                // Update table row
                updateViolationRow(currentViolation);
            }
            
            // Close modal and reset
            paymentModal.classList.remove('show');
            document.getElementById('paymentForm').reset();
            currentViolation = null;
            
            showNotification('Payment processed successfully!', 'success');
            
            // Restore button
            btn.innerHTML = originalText;
            btn.disabled = false;
        }, 1500);
    }
    
    function updateViolationRow(violation) {
        // Find and update the row in the table
        const rows = document.querySelectorAll('#violationsTableBody tr');
        rows.forEach(row => {
            if (row.cells[0]?.textContent === violation.id) {
                // Update status cell
                row.cells[6].innerHTML = `<span class="status-badge status-paid">Paid</span>`;
                
                // Update actions cell
                row.cells[7].innerHTML = `
                    <div class="table-actions">
                        <button class="btn-icon view-violation" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon receipt" title="View Receipt">
                            <i class="fas fa-receipt"></i>
                        </button>
                    </div>
                `;
                
                // Re-attach event listeners
                row.querySelector('.view-violation').addEventListener('click', function() {
                    showViolationDetails(violation);
                });
                row.querySelector('.receipt').addEventListener('click', function() {
                    showReceipt(violation);
                });
            }
        });
    }
    
    function showReceipt(violation) {
        alert(`Receipt for ${violation.id}\n\n` +
              `Amount: ₱ ${violation.paidAmount?.toFixed(2) || violation.fine.toFixed(2)}\n` +
              `Payment Method: ${violation.paymentMethod}\n` +
              `Reference: ${violation.paymentReference}\n` +
              `Date: ${new Date(violation.paymentDate || violation.date).toLocaleDateString()}`);
    }
    
    function filterViolations() {
        const status = statusFilter.value.toLowerCase();
        const searchTerm = searchViolations.value.toLowerCase();
        const rows = document.querySelectorAll('#violationsTableBody tr');
        
        rows.forEach(row => {
            const rowStatus = row.querySelector('.status-badge')?.textContent.toLowerCase();
            const rowText = row.textContent.toLowerCase();
            
            const statusMatch = !status || rowStatus?.includes(status);
            const searchMatch = !searchTerm || rowText.includes(searchTerm);
            
            row.style.display = statusMatch && searchMatch ? '' : 'none';
        });
    }
    
    function loadSampleViolations() {
        // This would normally load from an API
        // For now, we'll just refresh the displayed data
    }
    
    function resetViolationForm() {
        violationForm.reset();
        document.getElementById('violationId').value = 'TKT-' + new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
        document.getElementById('violationDate').value = new Date().toISOString().slice(0, 16);
    }
    
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
});