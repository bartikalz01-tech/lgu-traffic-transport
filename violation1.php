<?php
/**
 * Violation Ticketing System
 * Based on the ERD structure provided
 */

$pageTitle = 'Violation Ticketing System';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($pageTitle); ?> - Barangay (N/A)</title>
    <link rel="icon" type="image/x-icon" href="images/favicon.ico">
    <link rel="stylesheet" href="styles/global1.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="styles/sidebar1.css">
    <link rel="stylesheet" href="styles/admin/admin-header.css">
    <link rel="stylesheet" href="styles/buttons.css">
    <link rel="stylesheet" href="styles/hero.css">
    <link rel="stylesheet" href="styles/sidebar-footer.css">
    <link rel="stylesheet" href="styles/accident/accident.css">
    <link rel="stylesheet" href="styles/violations/violation1.css">
</head>
<body>
    <!-- Include Sidebar Component -->
    <?php include 'includes/sidebar-traffic-only.php'; ?>
    <!-- Include Admin Header Component -->
    <?php include 'includes/admin-header.php'; ?>
    
    <!-- ===================================
       MAIN CONTENT - Violation Ticketing
       =================================== -->
    <div class="main-content">
        <div class="main-container">
            <div class="title">
                <nav class="breadcrumb" aria-label="Breadcrumb">
                    <ol class="breadcrumb-list">
                        <li class="breadcrumb-item">
                            <a href="/" class="breadcrumb-link">
                                <i class="fas fa-home"></i>
                                <span>Home</span>
                            </a>
                        </li>
                        <li class="breadcrumb-item">
                            <a href="traffic-dashboard.php" class="breadcrumb-link">
                                <i class="fas fa-traffic-light"></i>
                                <span>Traffic Management</span>
                            </a>
                        </li>
                        <li class="breadcrumb-item active" aria-current="page">
                            <i class="fas fa-ticket-alt"></i>
                            <span>Violation Ticketing</span>
                        </li>
                    </ol>
                </nav>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <div>
                        <h1>Violation & Ticketing Management System</h1>
                        <p>Manage traffic violations, issue tickets, and track payments</p>
                    </div>
                    <div>
                        <button class="btn btn-primary" id="newViolationBtn">
                            <i class="fas fa-plus"></i> New Violation
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Dashboard Cards -->
            <div class="dashboard-cards">
                <div class="dashboard-card">
                    <div class="card-header">
                        <div>
                            <h4>Total Violations</h4>
                            <p class="card-subtitle">This Month</p>
                        </div>
                        <div class="card-icon violations">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                    </div>
                    <div class="card-content">
                        <h3>1,247</h3>
                        <p>+12% from last month</p>
                    </div>
                </div>
                
                <div class="dashboard-card">
                    <div class="card-header">
                        <div>
                            <h4>Active Tickets</h4>
                            <p class="card-subtitle">Pending Resolution</p>
                        </div>
                        <div class="card-icon tickets">
                            <i class="fas fa-file-alt"></i>
                        </div>
                    </div>
                    <div class="card-content">
                        <h3>342</h3>
                        <p>23 new today</p>
                    </div>
                </div>
                
                <div class="dashboard-card">
                    <div class="card-header">
                        <div>
                            <h4>Total Collected</h4>
                            <p class="card-subtitle">This Month</p>
                        </div>
                        <div class="card-icon payments">
                            <i class="fas fa-money-bill-wave"></i>
                        </div>
                    </div>
                    <div class="card-content">
                        <h3>₱89,500</h3>
                        <p>From 458 payments</p>
                    </div>
                </div>
                
                <div class="dashboard-card">
                    <div class="card-header">
                        <div>
                            <h4>Overdue</h4>
                            <p class="card-subtitle">Unpaid Tickets</p>
                        </div>
                        <div class="card-icon pending">
                            <i class="fas fa-clock"></i>
                        </div>
                    </div>
                    <div class="card-content">
                        <h3>87</h3>
                        <p>Require follow-up</p>
                    </div>
                </div>
            </div>
            
            <!-- Main Content -->
            <div class="violation-system">
                <div class="violation-content">
                    <!-- Left Column - Violations List -->
                    <div class="violation-list-panel">
                        <div class="panel-header">
                            <h3><i class="fas fa-list"></i> Recent Violations</h3>
                            <div class="panel-controls">
                                <select class="filter-select" id="violationFilter">
                                    <option value="all">All Violations</option>
                                    <option value="pending">Pending</option>
                                    <option value="issued">Issued</option>
                                    <option value="paid">Paid</option>
                                    <option value="overdue">Overdue</option>
                                </select>
                                <div class="search-box">
                                    <i class="fas fa-search"></i>
                                    <input type="text" id="searchViolations" placeholder="Search violations...">
                                </div>
                            </div>
                        </div>
                        
                        <div class="violations-container">
                            <div class="violations-table-wrapper">
                                <table class="violations-table">
                                    <thead>
                                        <tr>
                                            <th>Violation ID</th>
                                            <th>Vehicle</th>
                                            <th>Person</th>
                                            <th>Violation Type</th>
                                            <th>Fine Amount</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="violationsTableBody">
                                        <!-- Sample Data - Will be populated dynamically -->
                                        <tr>
                                            <td>VIO-20240115-001</td>
                                            <td>ABC-1234 (Toyota)</td>
                                            <td>Juan Dela Cruz</td>
                                            <td>Speeding</td>
                                            <td>₱1,500</td>
                                            <td>2024-01-15 10:30</td>
                                            <td><span class="violation-status status-paid">Paid</span></td>
                                            <td>
                                                <div class="table-actions">
                                                    <button class="btn-icon" title="View Details">
                                                        <i class="fas fa-eye"></i>
                                                    </button>
                                                    <button class="btn-icon" title="Print Ticket">
                                                        <i class="fas fa-print"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>VIO-20240114-002</td>
                                            <td>XYZ-5678 (Motorcycle)</td>
                                            <td>Maria Santos</td>
                                            <td>No Helmet</td>
                                            <td>₱750</td>
                                            <td>2024-01-14 14:15</td>
                                            <td><span class="violation-status status-issued">Issued</span></td>
                                            <td>
                                                <div class="table-actions">
                                                    <button class="btn-icon" title="View Details">
                                                        <i class="fas fa-eye"></i>
                                                    </button>
                                                    <button class="btn-icon" title="Process Payment">
                                                        <i class="fas fa-money-bill"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>VIO-20240113-003</td>
                                            <td>DEF-9012 (Van)</td>
                                            <td>Pedro Reyes</td>
                                            <td>Illegal Parking</td>
                                            <td>₱1,000</td>
                                            <td>2024-01-13 09:45</td>
                                            <td><span class="violation-status status-overdue">Overdue</span></td>
                                            <td>
                                                <div class="table-actions">
                                                    <button class="btn-icon" title="View Details">
                                                        <i class="fas fa-eye"></i>
                                                    </button>
                                                    <button class="btn-icon" title="Send Reminder">
                                                        <i class="fas fa-bell"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>VIO-20240112-004</td>
                                            <td>GHI-3456 (Sedan)</td>
                                            <td>Ana Torres</td>
                                            <td>Red Light</td>
                                            <td>₱2,000</td>
                                            <td>2024-01-12 16:20</td>
                                            <td><span class="violation-status status-pending">Pending</span></td>
                                            <td>
                                                <div class="table-actions">
                                                    <button class="btn-icon" title="View Details">
                                                        <i class="fas fa-eye"></i>
                                                    </button>
                                                    <button class="btn-icon" title="Issue Ticket">
                                                        <i class="fas fa-ticket-alt"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>VIO-20240111-005</td>
                                            <td>JKL-7890 (Truck)</td>
                                            <td>Carlos Gomez</td>
                                            <td>Overloading</td>
                                            <td>₱3,500</td>
                                            <td>2024-01-11 11:10</td>
                                            <td><span class="violation-status status-paid">Paid</span></td>
                                            <td>
                                                <div class="table-actions">
                                                    <button class="btn-icon" title="View Details">
                                                        <i class="fas fa-eye"></i>
                                                    </button>
                                                    <button class="btn-icon" title="Print Receipt">
                                                        <i class="fas fa-receipt"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            
                            <div class="pagination">
                                <button class="page-btn">
                                    <i class="fas fa-chevron-left"></i>
                                </button>
                                <button class="page-btn active">1</button>
                                <button class="page-btn">2</button>
                                <button class="page-btn">3</button>
                                <span class="page-info">of 12</span>
                                <button class="page-btn">
                                    <i class="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Right Column - Quick Actions -->
                    <div class="quick-actions-panel">
                        <!-- Quick Actions Card -->
                        <div class="quick-action-card">
                            <h4><i class="fas fa-bolt"></i> Quick Actions</h4>
                            <div class="action-buttons">
                                <button class="btn btn-primary action-btn" id="quickIssueBtn">
                                    <i class="fas fa-ticket-alt"></i> Issue Quick Ticket
                                </button>
                                <button class="btn btn-secondary action-btn" id="processPaymentBtn">
                                    <i class="fas fa-money-bill"></i> Process Payment
                                </button>
                                <button class="btn btn-secondary action-btn" id="generateReportBtn">
                                    <i class="fas fa-chart-bar"></i> Generate Report
                                </button>
                                <button class="btn btn-secondary action-btn" id="sendRemindersBtn">
                                    <i class="fas fa-bell"></i> Send Reminders
                                </button>
                            </div>
                        </div>
                        
                        <!-- Statistics Card -->
                        <div class="quick-action-card">
                            <h4><i class="fas fa-chart-pie"></i> Today's Statistics</h4>
                            <div class="statistics-grid">
                                <div class="stat-item">
                                    <div class="stat-value">23</div>
                                    <div class="stat-label">New Violations</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-value">18</div>
                                    <div class="stat-label">Tickets Issued</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-value">15</div>
                                    <div class="stat-label">Payments Processed</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-value">₱12,350</div>
                                    <div class="stat-label">Total Collected</div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Top Violations Card -->
                        <div class="quick-action-card">
                            <h4><i class="fas fa-exclamation-circle"></i> Top Violations</h4>
                            <div style="margin-top: 1rem;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                    <span>Speeding</span>
                                    <span class="stat-value">45</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                    <span>Illegal Parking</span>
                                    <span class="stat-value">38</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                    <span>No Helmet</span>
                                    <span class="stat-value">32</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                    <span>Red Light</span>
                                    <span class="stat-value">24</span>
                                </div>
                                <div style="display: flex; justify-content: space-between;">
                                    <span>No License</span>
                                    <span class="stat-value">18</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Include Admin Footer Component -->
        <?php include 'includes/admin-footer.php'; ?>
    </div>
    
    <!-- New Violation Modal -->
    <div class="modal violation-modal" id="newViolationModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-exclamation-triangle"></i> New Violation Report</h3>
                <button class="modal-close" id="closeViolationModal">&times;</button>
            </div>
            <div class="modal-body">
                <form class="violation-form" id="violationForm">
                    <div class="form-section-grid">
                        <div>
                            <div class="form-section-title">Vehicle Information</div>
                            <div class="form-group">
                                <label class="form-label">Plate Number <span class="required">*</span></label>
                                <input type="text" class="form-control" id="violationPlate" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Vehicle Type <span class="required">*</span></label>
                                <select class="form-select" id="violationVehicleType" required>
                                    <option value="">Select Type</option>
                                    <option value="private">Private Vehicle</option>
                                    <option value="motorcycle">Motorcycle</option>
                                    <option value="public">Public Utility</option>
                                    <option value="truck">Truck</option>
                                    <option value="government">Government</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Vehicle Make/Model</label>
                                <input type="text" class="form-control" id="violationVehicleModel">
                            </div>
                        </div>
                        
                        <div>
                            <div class="form-section-title">Person Information</div>
                            <div class="form-group">
                                <label class="form-label">Full Name <span class="required">*</span></label>
                                <input type="text" class="form-control" id="violationPersonName" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Contact Number</label>
                                <input type="text" class="form-control" id="violationContact">
                            </div>
                            <div class="form-group">
                                <label class="form-label">License Number</label>
                                <input type="text" class="form-control" id="violationLicense">
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-section-title">Violation Details</div>
                    <div class="form-section-grid">
                        <div class="form-group">
                            <label class="form-label">Violation Type <span class="required">*</span></label>
                            <select class="form-select" id="violationType" required>
                                <option value="">Select Violation</option>
                                <option value="speeding">Speeding</option>
                                <option value="illegal_parking">Illegal Parking</option>
                                <option value="no_helmet">No Helmet (Motorcycle)</option>
                                <option value="red_light">Running Red Light</option>
                                <option value="no_license">No Driver's License</option>
                                <option value="overloading">Overloading</option>
                                <option value="seatbelt">No Seatbelt</option>
                                <option value="drunk_driving">Drunk Driving</option>
                                <option value="reckless">Reckless Driving</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Fine Amount <span class="required">*</span></label>
                            <input type="number" class="form-control" id="violationFine" min="0" step="50" required>
                        </div>
                    </div>
                    
                    <div class="form-section-grid">
                        <div class="form-group">
                            <label class="form-label">Location <span class="required">*</span></label>
                            <select class="form-select" id="violationLocation" required>
                                <option value="">Select Location</option>
                                <option value="road_123">Road 123 - Main Street</option>
                                <option value="market_road">Market Road</option>
                                <option value="highway">Highway</option>
                                <option value="school_zone">School Zone</option>
                                <option value="barangay_entrance">Barangay Entrance</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Date & Time <span class="required">*</span></label>
                            <input type="datetime-local" class="form-control" id="violationDateTime" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Description <span class="required">*</span></label>
                        <textarea class="form-control" id="violationDescription" rows="3" required></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Officer Notes</label>
                        <textarea class="form-control" id="violationOfficerNotes" rows="2"></textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" id="cancelViolation">Cancel</button>
                        <button type="submit" class="btn btn-primary">Submit Violation</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    
    <!-- Quick Issue Ticket Modal -->
    <div class="modal" id="quickIssueModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-ticket-alt"></i> Quick Ticket Issue</h3>
                <button class="modal-close" id="closeQuickIssueModal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label class="form-label">Plate Number <span class="required">*</span></label>
                    <input type="text" class="form-control" id="quickPlate" placeholder="Enter plate number">
                </div>
                <div class="form-group">
                    <label class="form-label">Violation Type <span class="required">*</span></label>
                    <select class="form-select" id="quickViolationType">
                        <option value="speeding">Speeding</option>
                        <option value="illegal_parking">Illegal Parking</option>
                        <option value="no_helmet">No Helmet</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Fine Amount</label>
                    <input type="number" class="form-control" id="quickFine" value="1000">
                </div>
                <div class="form-actions" style="margin-top: 1.5rem; padding-top: 0;">
                    <button class="btn btn-secondary" id="cancelQuickIssue">Cancel</button>
                    <button class="btn btn-primary" id="submitQuickIssue">Issue Ticket</button>
                </div>
            </div>
        </div>
    </div>

    <script src="scripts/violation.js"></script>
</body>
</html>