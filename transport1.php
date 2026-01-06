<?php
/**
 * Public Transport Coordination Dashboard
 * Based on 3NF ERD structure
 */

$pageTitle = 'Public Transport Coordination';
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
    <link rel="stylesheet" href="styles/cards.css">
    <link rel="stylesheet" href="styles/content.css">
    <link rel="stylesheet" href="styles/transport/transport.css">
</head>
<body>
    <!-- Include Sidebar Component -->
    <?php include 'includes/sidebar-traffic-only.php'; ?>

    <!-- Include Admin Header Component -->
    <?php include 'includes/admin-header.php'; ?>

    <!-- ===================================
       MAIN CONTENT - Public Transport Coordination Dashboard
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
        <i class="fas fa-bus"></i>
        <span>Public Transport Coordination</span>
        </li>
        </ol>
        </nav>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <div>
            <h1>Public Transport Coordination Dashboard</h1>
            <p>Monitor and manage public transport operations, routes, and personnel in real-time</p>
        </div>
            <div>
            <button class="btn btn-primary" id="addTransportGroupBtn">
            <i class="fas fa-plus"></i> Add Transport Group
            </button>
            </div>
            </div>
            </div>

        <div class="sub-container">
        <div class="page-content">
        <!-- Stats Overview -->
        <div class="stats-grid">
        <div class="stat-card">
        <div class="stat-icon bus">
            <i class="fas fa-bus"></i>
            </div>
            <div class="stat-value">42</div>
            <div class="stat-label">Active Vehicles</div>
            </div>
                
        <div class="stat-card">
        <div class="stat-icon route">
        <i class="fas fa-route"></i>
        </div>
        <div class="stat-value">18</div>
        <div class="stat-label">Active Routes</div>
        </div>
                        
        <div class="stat-card">
        <div class="stat-icon driver">
        <i class="fas fa-user-tie"></i>
        </div>
        <div class="stat-value">56</div>
        <div class="stat-label">Registered Drivers</div>
        </div>
                        
        <div class="stat-card">
        <div class="stat-icon passenger">
        <i class="fas fa-users"></i>
        </div>
        <div class="stat-value">1,250</div>
        <div class="stat-label">Daily Passengers</div>
        </div>
        </div>

                <!-- Main Dashboard Grid -->
    <div class="public-transport-dashboard">
                <!-- Transport Groups -->
        <div class="dashboard-card">
        <div class="card-header">
        <h3><i class="fas fa-users"></i> Transport Groups</h3>
        <span class="card-badge">7 Groups</span>
         </div>
        <div class="groups-list">
        <div class="group-item">
        <div class="group-info">
        <div class="group-color" style="background-color: #3b82f6;"></div>
        <div>
        <div class="group-title">Barangay Transport Cooperative</div>
        <div class="group-members">15 members</div>
        </div>
        </div>
        <button class="btn-icon" title="View Details">
        <i class="fas fa-chevron-right"></i>
        </button>
        </div>
                                
        <div class="group-item">
        <div class="group-info">
        <div class="group-color" style="background-color: #10b981;"></div>
        <div>
        <div class="group-title">Market Route Operators</div>
        <div class="group-members">12 members</div>
        </div>
        </div>
        <button class="btn-icon" title="View Details">
        <i class="fas fa-chevron-right"></i>
        </button>
        </div>
        
        <div class="group-item">
        <div class="group-info">
        <div class="group-color" style="background-color: #f59e0b;"></div>
        <div>
        <div class="group-title">School Service Association</div>
        <div class="group-members">8 members</div>
        </div>
        </div>
        <button class="btn-icon" title="View Details">
        <i class="fas fa-chevron-right"></i>
        </button>
        </div>
                                
        <div class="group-item">
        <div class="group-info">
        <div class="group-color" style="background-color: #8b5cf6;"></div>
        <div>
        <div class="group-title">Night Shift Operators</div>
        <div class="group-members">6 members</div>
        </div>
        </div>
        <button class="btn-icon" title="View Details">
        <i class="fas fa-chevron-right"></i>
        </button>
        </div>
        </div>
    </div>

        <!-- Vehicle Types -->
    <div class="dashboard-card">
        <div class="card-header">
        <h3><i class="fas fa-car"></i> Vehicle Types</h3>
        <span class="card-badge">5 Types</span>
        </div>
        <div class="vehicle-types">
        <div class="vehicle-type-card">
        <div class="vehicle-type-icon">
        <i class="fas fa-bus"></i>
        </div>
        <div class="vehicle-type-name">Bus</div>
        <div class="vehicle-type-count">12 Vehicles</div>
        </div>

        <div class="vehicle-type-card">
        <div class="vehicle-type-icon">
        <i class="fas fa-van-shuttle"></i>
        </div>
        <div class="vehicle-type-name">Jeepney</div>
        <div class="vehicle-type-count">25 Vehicles</div>
        </div>
                                
        <div class="vehicle-type-card">
        <div class="vehicle-type-icon">
        <i class="fas fa-truck"></i>
        </div>
        <div class="vehicle-type-name">Tricycle</div>
        <div class="vehicle-type-count">150 Vehicles</div>
        </div>
        </div>
    </div>

        <!-- Route Schedule -->
    <div class="dashboard-card">
        <div class="card-header">
        <h3><i class="fas fa-clock"></i> Today's Schedule</h3>
        <span class="card-badge">Morning Shift</span>
        </div>
        <div class="schedule-container">
        <table class="route-schedule">
        <thead>
        <tr>
        <th>Route</th>
        <th>Time</th>
        <th>Status</th>
        <th>Driver</th>
        </tr>
        </thead>
        <tbody>
        <tr>
        <td>Route 1 - Market</td>
        <td>06:00 AM</td>
        <td><span class="schedule-status status-on-time">On Time</span></td>
        <td>Juan Dela Cruz</td>
        </tr>
        <tr>
        <td>Route 2 - School</td>
        <td>06:30 AM</td>
        <td><span class="schedule-status status-delayed">Delayed 15min</span></td>
        <td>Malupiton</td>
        </tr>
        <tr>
        <td>Route 3 - Terminal</td>
        <td>07:00 AM</td>
        <td><span class="schedule-status status-on-time">On Time</span></td>
        <td>Pedro Reyes</td>
        </tr>
        <tr>
        <td>Route 4 - Hospital</td>
        <td>07:30 AM</td>
        <td><span class="schedule-status status-cancelled">Cancelled</span></td>
        <td>Jose Rizal</td>
        </tr>
        </tbody>
        </table>
        </div>
    </div>

        <!-- Active Permits -->
    <div class="dashboard-card">
        <div class="card-header">
        <h3><i class="fas fa-file-alt"></i> Active Permits</h3>
        <span class="card-badge">Expiring Soon</span>
        </div>
        <div class="permits-status">
        <div class="permit-item">
        <div>
        <div class="permit-type">Operator's Permit</div>
        <div class="permit-date">Expires: 2024-03-15</div>
        </div>
        <span class="permit-status status-active">Active</span>
        </div>
        
        <div class="permit-item">
        <div>
        <div class="permit-type">Vehicle Registration</div>
        <div class="permit-date">Expires: 2024-02-28</div>
        </div>
        <span class="permit-status status-pending">Renewal</span>
        </div>
            
        <div class="permit-item">
        <div>
        <div class="permit-type">Driver's License</div>
        <div class="permit-date">Expires: 2024-01-31</div>
        </div>
        <span class="permit-status status-expired">Expired</span>
        </div>
        </div>
    </div>

            <!-- Transport Map -->
    <div class="dashboard-card full-width">
        <div class="card-header">
        <h3><i class="fas fa-map-marked-alt"></i> Live Transport Map</h3>
        <span class="card-badge">Real-time Tracking</span>
        </div>
        <div class="map-container">
        <div class="map-placeholder">
        <div style="text-align: center;">
        <i class="fas fa-map"></i>
        <p>Live GPS Tracking Map</p>
        <small>Integrated with vehicle tracking system</small>
        </div>
        </div>
        <div class="map-overlay">
        <div class="map-controls">
        <button class="btn btn-sm btn-secondary">
        <i class="fas fa-search"></i> Find Vehicle
        </button>
        <button class="btn btn-sm btn-secondary">
        <i class="fas fa-filter"></i> Filter Routes
        </button>
        <button class="btn btn-sm btn-primary">
        <i class="fas fa-sync"></i> Refresh Map
        </button>
        </div>
        </div>
        </div>
    </div>

        <!-- Active Drivers -->
    <div class="dashboard-card">
        <div class="card-header">
        <h3><i class="fas fa-user-tie"></i> Active Drivers</h3>
        <span class="card-badge">Online: 8</span>
        </div>
        <div class="active-drivers">
        <div class="driver-card">
        <div class="driver-avatar">JD</div>
        <div class="driver-info">
        <div class="driver-name">Juan Dela Cruz</div>
        <div class="driver-route">Route 1 - Market</div>
        </div>
        <span class="driver-status driver-online">Online</span>
        </div>
        
        <div class="driver-card">
        <div class="driver-avatar">MS</div>
        <div class="driver-info">
        <div class="driver-name">Maria Santos</div>
        <div class="driver-route">Route 2 - School</div>
        </div>
        <span class="driver-status driver-online">Online</span>
        </div>
                            
        <div class="driver-card">
        <div class="driver-avatar">PR</div>
        <div class="driver-info">
        <div class="driver-name">Pedro Reyes</div>
        <div class="driver-route">Route 3 - Terminal</div>
        </div>
        <span class="driver-status driver-offline">Offline</span>
        </div>
        </div>
    </div>

        <!-- Quick Actions -->
    <div class="dashboard-card">
        <div class="card-header">
        <h3><i class="fas fa-bolt"></i> Quick Actions</h3>
        </div>
        <div class="quick-actions">
        <a href="#" class="action-btn">
        <div class="action-icon">
        <i class="fas fa-plus"></i>
        </div>
        <div class="action-text">Add Vehicle</div>
        </a>
                
        <a href="#" class="action-btn">
        <div class="action-icon">
        <i class="fas fa-route"></i>
        </div>
        <div class="action-text">Plan Route</div>
        </a>
        
        <a href="#" class="action-btn">
        <div class="action-icon">
        <i class="fas fa-user-plus"></i>
        </div>
        <div class="action-text">Add Driver</div>
        </a>
        
        <a href="#" class="action-btn">
        <div class="action-icon">
        <i class="fas fa-file-alt"></i>
        </div>
        <div class="action-text">Issue Permit</div>
        </a>
        </div>
    </div>

        <!-- Recent Violations -->
    <div class="dashboard-card">
        <div class="card-header">
        <h3><i class="fas fa-exclamation-triangle"></i> Recent Violations</h3>
        <span class="card-badge" style="background: #ef4444;">3 Today</span>
        </div>
        <div class="violations-list">
        <div class="group-item">
        <div class="group-info">
        <i class="fas fa-car text-danger"></i>
        <div>
        <div class="group-title">Overloading - Jeepney #123</div>
        <div class="group-members">Reported: Today 08:30 AM</div>
        </div>
        </div>
        <span class="status-badge status-critical">Pending</span>
        </div>
                                
        <div class="group-item">
        <div class="group-info">
        <i class="fas fa-traffic-light text-warning"></i>
        <div>
        <div class="group-title">Route Deviation - Bus #456</div>
        <div class="group-members">Reported: Today 10:15 AM</div>
        </div>
        </div>
        <span class="status-badge status-investigation">Under Review</span>
        </div>
                    
        <div class="group-item">
        <div class="group-info">
        <i class="fas fa-clock text-info"></i>
        <div>
        <div class="group-title">Late Operation - Tricycle #789</div>
        <div class="group-members">Reported: Yesterday 21:45 PM</div>
        </div>
        </div>
        <span class="status-badge status-resolved">Resolved</span>
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

    <script src="scripts/transport.js"></script>
</body>

</html>