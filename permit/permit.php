<?php

/**
 * Permits Management System
 * For Tricycles, PUVs, and other vehicle permits
 */
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../styles/global.css">
    <link rel="stylesheet" href="../styles/sidebar.css">
    <link rel="stylesheet" href="../styles/buttons.css">
    <link rel="stylesheet" href="../styles/content.css">
    <link rel="stylesheet" href="../styles/cards.css">
    <link rel="stylesheet" href="../styles/forms.css">
    <link rel="stylesheet" href="../styles/sidebar-footer.css">
    <link rel="stylesheet" href="../styles/road_condition/road_condition_header.css">
    <link rel="stylesheet" href="../styles/permits.css">
    <title>Permits Management System</title>
</head>

<body>
    <main class="app">
        <?php include '../includes/official_sidebar.php'; ?>
        <?php include '../includes/accident_header.php'; ?>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <div class="module-title-container">
                <p class="module-title">Vehicle Permits System</p>
                <h1 class="sub-module-title">Permits Management</h1>
                <p class="sub-module-description">Manage permits for Tricycles, PUVs, and other vehicles</p>
            </div>
            <button class="btn btn-primary" id="newPermitBtn" style="margin-top: var(--header-h); margin-right: 20px;">
                <i class="fas fa-plus"></i> New Permit
            </button>
        </div>

        <section class="permits-system">
            <div class="permits-content">
                <!-- Statistics Cards -->
                <div class="permits-stats-grid">
                    <div class="stat-card stat-card-primary">
                        <div class="stat-icon">
                            <i class="fas fa-file-contract"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-value" id="totalPermits">0</div>
                            <div class="stat-label">Total Permits</div>
                        </div>
                    </div>
                    <div class="stat-card stat-card-success">
                        <div class="stat-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-value" id="activePermits">0</div>
                            <div class="stat-label">Active Permits</div>
                        </div>
                    </div>
                    <div class="stat-card stat-card-warning">
                        <div class="stat-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-value" id="expiringSoon">0</div>
                            <div class="stat-label">Expiring Soon</div>
                        </div>
                    </div>
                    <div class="stat-card stat-card-danger">
                        <div class="stat-icon">
                            <i class="fas fa-times-circle"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-value" id="expiredPermits">0</div>
                            <div class="stat-label">Expired Permits</div>
                        </div>
                    </div>
                </div>

                <!-- Main Content Grid -->
                <div class="permits-main-grid">
                    <!-- Left Column: PUV Groups & Types -->
                    <div class="permits-left-column">
                        <!-- PUV Groups Card -->
                        <div class="card puv-groups-card">
                            <div class="card-header">
                                <h3><i class="fas fa-users"></i> PUV Groups</h3>
                                <button class="btn btn-sm btn-outline-primary" id="addGroupBtn">
                                    <i class="fas fa-plus"></i> Add Group
                                </button>
                            </div>
                            <div class="card-body">
                                <div class="search-box">
                                    <i class="fas fa-search"></i>
                                    <input type="text" id="searchGroups" placeholder="Search PUV groups...">
                                </div>
                                <div class="groups-list" id="puvGroupsList">
                                    <!-- Groups will be loaded here -->
                                    <div class="loading-placeholder">
                                        <i class="fas fa-spinner fa-spin"></i> Loading groups...
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Vehicle Types Card -->
                        <div class="card vehicle-types-card">
                            <div class="card-header">
                                <h3><i class="fas fa-car"></i> Vehicle Types</h3>
                                <button class="btn btn-sm btn-outline-primary" id="addVehicleTypeBtn">
                                    <i class="fas fa-plus"></i> Add Type
                                </button>
                            </div>
                            <div class="card-body">
                                <div class="vehicle-types-grid" id="vehicleTypesList">
                                    <!-- Vehicle types will be loaded here -->
                                    <div class="loading-placeholder">
                                        <i class="fas fa-spinner fa-spin"></i> Loading vehicle types...
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column: Permits & Members -->
                    <div class="permits-right-column">
                        <!-- Permits List Card -->
                        <div class="card permits-list-card">
                            <div class="card-header">
                                <h3><i class="fas fa-file-alt"></i> Permits List</h3>
                                <div class="header-controls">
                                    <div class="filter-controls">
                                        <select class="filter-select" id="permitFilter">
                                            <option value="all">All Permits</option>
                                            <option value="active">Active Only</option>
                                            <option value="expiring">Expiring Soon</option>
                                            <option value="expired">Expired</option>
                                            <option value="tricycle">Tricycle Permits</option>
                                            <option value="puv">PUV Permits</option>
                                            <option value="other">Other Permits</option>
                                        </select>
                                        <select class="filter-select" id="sortPermits">
                                            <option value="newest">Newest First</option>
                                            <option value="oldest">Oldest First</option>
                                            <option value="expiry">Expiry Date</option>
                                            <option value="type">Permit Type</option>
                                        </select>
                                    </div>
                                    <div class="search-box">
                                        <i class="fas fa-search"></i>
                                        <input type="text" id="searchPermits" placeholder="Search permits...">
                                    </div>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="permits-table-container">
                                    <table class="permits-table">
                                        <thead>
                                            <tr>
                                                <th>Permit ID</th>
                                                <th>Holder Name</th>
                                                <th>Permit Type</th>
                                                <th>Vehicle Group</th>
                                                <th>Start Date</th>
                                                <th>End Date</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody id="permitsTableBody">
                                            <!-- Permits will be loaded here -->
                                            <tr class="loading-row">
                                                <td colspan="8">
                                                    <div class="loading-placeholder">
                                                        <i class="fas fa-spinner fa-spin"></i> Loading permits...
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="pagination">
                                    <button class="page-btn prev-btn" disabled>
                                        <i class="fas fa-chevron-left"></i>
                                    </button>
                                    <button class="page-btn active">1</button>
                                    <button class="page-btn">2</button>
                                    <button class="page-btn">3</button>
                                    <span class="page-info">Page 1 of 1</span>
                                    <button class="page-btn next-btn">
                                        <i class="fas fa-chevron-right"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Group Members Card -->
                        <div class="card group-members-card">
                            <div class="card-header">
                                <h3><i class="fas fa-user-friends"></i> Group Members</h3>
                                <button class="btn btn-sm btn-outline-primary" id="addMemberBtn">
                                    <i class="fas fa-user-plus"></i> Add Member
                                </button>
                            </div>
                            <div class="card-body">
                                <div class="members-table-container">
                                    <table class="members-table">
                                        <thead>
                                            <tr>
                                                <th>Member ID</th>
                                                <th>Name</th>
                                                <th>Position</th>
                                                <th>Assigned PUV</th>
                                                <th>Vehicle Type</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody id="membersTableBody">
                                            <!-- Members will be loaded here -->
                                            <tr class="loading-row">
                                                <td colspan="6">
                                                    <div class="loading-placeholder">
                                                        <i class="fas fa-spinner fa-spin"></i> Select a PUV group to view members
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- New Permit Modal -->
        <div class="modal" id="newPermitModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-file-contract"></i> New Permit Application</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="permitForm" class="form-demo">
                        <div class="form-group">
                            <label class="form-label" for="permitType">Permit Type *</label>
                            <select class="form-control" id="permitType" name="permitType" required>
                                <option value="">Select Permit Type</option>
                                <option value="tricycle">Tricycle Permit</option>
                                <option value="puv">PUV Franchise</option>
                                <option value="operator">Operator's Permit</option>
                                <option value="driver">Driver's Permit</option>
                                <option value="conductor">Conductor's Permit</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label" for="applicantName">Applicant Name *</label>
                                <input type="text" class="form-control" id="applicantName" name="applicantName" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="contactNumber">Contact Number *</label>
                                <input type="tel" class="form-control" id="contactNumber" name="contactNumber" required>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label" for="puvGroup">PUV Group *</label>
                                <select class="form-control" id="puvGroup" name="puvGroup" required>
                                    <option value="">Select PUV Group</option>
                                    <!-- Groups will be populated dynamically -->
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="vehicleType">Vehicle Type *</label>
                                <select class="form-control" id="vehicleType" name="vehicleType" required>
                                    <option value="">Select Vehicle Type</option>
                                    <!-- Vehicle types will be populated dynamically -->
                                </select>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label" for="startDate">Start Date *</label>
                                <input type="date" class="form-control" id="startDate" name="startDate" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="endDate">End Date *</label>
                                <input type="date" class="form-control" id="endDate" name="endDate" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="vehicleNumber">Vehicle/Unit Number *</label>
                            <input type="text" class="form-control" id="vehicleNumber" name="vehicleNumber" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="plateNumber">Plate Number *</label>
                            <input type="text" class="form-control" id="plateNumber" name="plateNumber" required>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="remarks">Remarks</label>
                            <textarea class="form-control" id="remarks" name="remarks" rows="3"></textarea>
                        </div>

                        <div class="form-group">
                            <div class="checkbox-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" class="form-checkbox" name="terms" required>
                                    <span>I agree to the terms and conditions of the permit</span>
                                </label>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary modal-cancel">Cancel</button>
                    <button class="btn btn-primary" id="submitPermit">Submit Application</button>
                </div>
            </div>
        </div>

        <!-- Quick Action Modal Templates -->
        <div class="modal" id="addGroupModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-users"></i> Add New PUV Group</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <!-- Group form will be loaded here -->
                </div>
            </div>
        </div>

        <div class="modal" id="addVehicleTypeModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-car"></i> Add New Vehicle Type</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <!-- Vehicle type form will be loaded here -->
                </div>
            </div>
        </div>

        <?php include '../includes/admin-footer.php'; ?>
    </main>

    <script type="module" src="../scripts/permits.js"></script>
</body>

</html>