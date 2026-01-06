<?php

/**
 * Accident and Violation Reporting System
 * Based on the ERD structure provided
 */

$pageTitle = 'Accident Reporting System';
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

</head>

<body>
    <!-- Include Sidebar Component -->
    <?php include 'includes/sidebar-traffic-only.php'; ?>

    <!-- Include Admin Header Component -->
    <?php include 'includes/admin-header.php'; ?>

    <!-- ===================================
       MAIN CONTENT - Accident Reporting
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
                            <i class="fas fa-car-crash"></i>
                            <span>Accident Reporting</span>
                        </li>
                    </ol>
                </nav>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <div>
                        <h1>Accident & Violation Reporting System</h1>
                        <p>Report and manage traffic accidents, violations, and incidents in real-time</p>
                    </div>
                    <div>
                        <button class="btn btn-primary" id="quickReportBtn">
                            <i class="fas fa-plus"></i> Quick Report
                        </button>
                    </div>
                </div>
            </div>

            <div class="sub-container">
                <div class="page-content">
                    <div class="accident-system">
                        <!-- Accident Report Form -->
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
                                        <input type="text" class="form-control" id="accidentId" value="ACC-<?php echo date('YmdHis'); ?>" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Road/Location <span class="required">*</span></label>
                                        <select class="form-select" id="roadId">
                                            <option value="">Select Road</option>
                                            <option value="RD-001">Road 123 - Main Street</option>
                                            <option value="RD-002">Road 456 - Market Road</option>
                                            <option value="RD-003">Road 789 - Highway</option>
                                            <option value="RD-004">Barangay Entrance</option>
                                            <option value="RD-005">School Zone Road</option>
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
                                        <input type="date" class="form-control" id="accidentDate" value="<?php echo date('Y-m-d'); ?>">
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Time <span class="required">*</span></label>
                                        <input type="time" class="form-control" id="accidentTime" value="<?php echo date('H:i'); ?>">
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label class="form-label">Description <span class="required">*</span></label>
                                    <textarea class="form-control" id="description" rows="3" placeholder="Describe the accident details, weather conditions, road situation..."></textarea>
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

                        <!-- Recent Accident Reports -->
                        <div class="accident-list-panel">
                            <div class="list-header">
                                <h3><i class="fas fa-history"></i> Recent Reports</h3>
                                <div class="list-controls">
                                    <div class="search-box">
                                        <i class="fas fa-search"></i>
                                        <input type="text" id="searchReports" placeholder="Search reports...">
                                    </div>
                                    <button class="btn btn-secondary" id="refreshListBtn">
                                        <i class="fas fa-sync-alt"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="list-body" id="accidentList">
                                <!-- Accident items will be loaded here -->
                                <div class="accident-item active">
                                    <div class="accident-header">
                                        <span class="accident-id">ACC-20240115-001</span>
                                        <span class="accident-time">Today, 10:15 AM</span>
                                    </div>
                                    <div class="accident-details">
                                        <h4>Vehicle Collision at Road 123</h4>
                                        <div class="accident-meta">
                                            <span><i class="fas fa-road"></i> Road 123</span>
                                            <span><i class="fas fa-users"></i> 3 People</span>
                                            <span><i class="fas fa-car"></i> 2 Vehicles</span>
                                        </div>
                                        <div>
                                            <span class="status-badge status-investigation">Under Investigation</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="accident-item">
                                    <div class="accident-header">
                                        <span class="accident-id">ACC-20240114-003</span>
                                        <span class="accident-time">Yesterday, 14:30 PM</span>
                                    </div>
                                    <div class="accident-details">
                                        <h4>Minor Accident at Market Road</h4>
                                        <div class="accident-meta">
                                            <span><i class="fas fa-road"></i> Market Road</span>
                                            <span><i class="fas fa-users"></i> 2 People</span>
                                            <span><i class="fas fa-car"></i> 1 Vehicle</span>
                                        </div>
                                        <div>
                                            <span class="status-badge status-resolved">Resolved</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="accident-item">
                                    <div class="accident-header">
                                        <span class="accident-id">ACC-20240114-002</span>
                                        <span class="accident-time">Yesterday, 08:45 AM</span>
                                    </div>
                                    <div class="accident-details">
                                        <h4>Hit and Run Incident</h4>
                                        <div class="accident-meta">
                                            <span><i class="fas fa-road"></i> Barangay Entrance</span>
                                            <span><i class="fas fa-users"></i> 1 Person</span>
                                            <span><i class="fas fa-car"></i> 1 Vehicle</span>
                                        </div>
                                        <div>
                                            <span class="status-badge status-critical">Critical</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="accident-item">
                                    <div class="accident-header">
                                        <span class="accident-id">ACC-20240113-001</span>
                                        <span class="accident-time">2 days ago, 16:20 PM</span>
                                    </div>
                                    <div class="accident-details">
                                        <h4>Motorcycle Accident</h4>
                                        <div class="accident-meta">
                                            <span><i class="fas fa-road"></i> School Zone Road</span>
                                            <span><i class="fas fa-users"></i> 1 Person</span>
                                            <span><i class="fas fa-car"></i> 1 Vehicle</span>
                                        </div>
                                        <div>
                                            <span class="status-badge status-resolved">Resolved</span>
                                        </div>
                                    </div>
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

    <!-- Quick Report Modal -->
    <div class="modal" id="quickReportModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-bolt"></i> Quick Accident Report</h3>
                <button class="modal-close" id="closeQuickModal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label class="form-label">Location <span class="required">*</span></label>
                    <input type="text" class="form-control" id="quickLocation" placeholder="Enter accident location">
                </div>
                <div class="form-group">
                    <label class="form-label">Brief Description <span class="required">*</span></label>
                    <textarea class="form-control" id="quickDescription" rows="3" placeholder="Brief description of the accident"></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Severity Level</label>
                    <select class="form-select" id="quickSeverity">
                        <option value="minor">Minor</option>
                        <option value="moderate" selected>Moderate</option>
                        <option value="severe">Severe</option>
                        <option value="critical">Critical</option>
                    </select>
                </div>
                <div class="form-actions" style="margin-top: 1.5rem; padding-top: 0;">
                    <button class="btn btn-secondary" id="cancelQuickReport">Cancel</button>
                    <button class="btn btn-primary" id="submitQuickReport">Submit Quick Report</button>
                </div>
            </div>
        </div>
    </div>

    <script src="includes/accident.js"></script>
</body>

</html>