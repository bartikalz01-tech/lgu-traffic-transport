<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/x-icon" href="../images/favicon.ico">
  <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Raleway:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <link rel="stylesheet" href="../styles/global.css">
  <link rel="stylesheet" href="../styles/sidebar.css">
  <link rel="stylesheet" href="../styles/buttons.css">
  <link rel="stylesheet" href="../styles/road_condition/road_condition_header.css">
  <link rel="stylesheet" href="../styles/route_planning/emergency_management.css">
  <link rel="stylesheet" href="../styles/sidebar-footer.css">
  <title>Emergency Routes</title>
</head>

<body>
  <main class="app">
    <?php include '../includes/official_sidebar.php' ?>

    <div class="emergency-main-wrapper">
      <?php include '../includes/accident_header.php' ?>

      <section class="emergency-plan-container">
        <div class="em-dashboard-header">
          <div class="em-title-block">
            <h2><i class="fas fa-truck-medical"></i> Emergency Dispatch Hub</h2>
            <p>Real-Time incident tracking and automated dispatcher routing allocation</p>
          </div>
          <div class="em-status-badge">
            <span class="pulse-indicator">Live System Monitoring</span>
          </div>
        </div>

        <!-- This kpi card will handle the new table called emergency_dispatch_logs and emergency_route_updates -->
        <div class="em-kpi-cards">
          <div class="overview-card assigned-emergency">
            <div class="card-icon">
              <i class="fas fa-circle-exclamation"></i>
            </div>
            <div class="card-details">
              <span class="card-label">Pending Emergencies</span>
              <h2 class="card-value" id="pendingEmergencyRoutes">0</h2>
            </div>
          </div>

          <div class="overview-card emergency-arrival">
            <div class="card-icon">
              <i class="fas fa-circle-check"></i>
            </div>
            <div class="card-details">
              <span class="card-label">Assigned Emergencies</span>
              <h2 class="card-value" id="totalActiveEmergencies">0</h2>
            </div>
          </div>

          <div class="overview-card emergency-logs">
            <div class="card-icon">
              <i class="fas fa-clock-rotate-left"></i> 
            </div>
            <div class="card-details">
              <span class="card-label">Emergency Activities</span>
              <ul class="log-stream" id="emergencyLogs">
                <li class="log-item priority-high">
                  <span class="log-time">10:42</span>
                  <span class="log-text">Station 9 dispatched to Fire Incident 204</span>
                </li>
                <li class="log-item priority-medium">
                  <span class="log-time">10:42</span>
                  <span class="log-text">Med Unit 3 arrived at Route Segment B</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="setting-emergency-routes js-setting-emergency-routes"></div>
      </section>

      <?php include '../includes/admin-footer.php'; ?>
    </div>
  </main>

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script src="../scripts/sidebar.js"></script>
  <script type="module" src="../scripts/route_planning/emergency/emergency_management.js"></script>
</body>

</html>