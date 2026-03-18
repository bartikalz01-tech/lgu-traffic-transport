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
  <link rel="stylesheet" href="../styles/route_planning/route_plan_trial.css">
  <link rel="stylesheet" href="../styles/sidebar-footer.css">
  <title>Route Planning Test</title>
</head>

<body>
  <?php include '../includes/official_sidebar.php' ?>

  <?php include '../includes/accident_header.php' ?>

  <main class="app">
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">
      <div class="module-title-container">
        <p class="module-title">Vehicle Routing and Diversion Planning</p>
        <h1 class="sub-module-title">Route Planning</h1>
        <p class="sub-module-description">Planing the ways of transportations</p>
      </div>
    </div>

    <section class="route-diversion-container">
      <div class="reports-and-actions-container">
        <div class="officers-card">
          <h2><i class="fas fa-clipboard-list"></i> Officer Reports</h2>
          <div class="officer-arrival-data">
            <p class="officer-status">
              <i class="fas fa-check-circle" style="color: #27ae60;"></i>
              <span>Arrived</span>
            </p>
            <p class="officer-value">5</p>
          </div>
          <div class="officer-arrival-data">
            <p class="officer-status">
              <i class="fas fa-truck-fast" style="color: var(--accent-color);"></i>
              <span>En-route</span>
            </p>
            <p class="officer-value">2</p>
          </div>
          <div class="officer-arrival-data">
            <p class="officer-status">
              <i class="fas fa-clock" style="color: #95a5a6;"></i>
              <span>Pending</span>
            </p>
            <p class="officer-value">1</p>
          </div>
        </div>

        <div class="emergency-card">
          <h2><i class="fas fa-truck-medical"></i> Emergency Routes</h2>
          <div class="emergency-arrival-data">
            <p class="emergency-status">
              <i class="fas fa-circle-exclamation" style="color: #e74c3c;"></i>
              <span>Active:</span>
            </p>
            <p class="emergency-value">2</p>
          </div>
          <div class="emergency-arrival-data">
            <p class="emergency-status">
              <i class="fas fa-circle-check" style="color: #27ae60;"></i>
              <span>Completed Today:</span>
            </p>
            <p class="emergency-value">5</p>
          </div>
          <div class="emergency-arrival-data">
            <p class="emergency-status">
              <i class="fas fa-stopwatch" style="color: #3498db;"></i>
              <span>Average ETA:</span>
            </p>
            <p class="emergency-value">5 mins</p>
          </div>
        </div>

        <div class="diversion-card">
          <h2><i class="fas fa-road"></i> Diversion Plans</h2>
          <div class="diversion-data">
            <p class="diversion-status">
              <i class="fas fa-shuffle" style="color: #F39C12;"></i>
              <span>Active</span>
            </p>
            <p class="diversion-value">3</p>
          </div>
          <div class="diversion-data">
            <p class="diversion-status">
              <i class="fas fa-calendar-check" style="color: #e67e22;"></i>
              <span>Scheduled</span>
            </p>
            <p class="diversion-value">1</p>
          </div>
          <div class="diversion-data">
            <p class="diversion-status">
              <i class="fas fa-route" style="color: #27ae60;"></i>
              <span>Resolved</span>
            </p>
            <p class="diversion-value">4</p>
          </div>
        </div>

        <div class="actions-card">
          <h2><i class="fas fa-circle"></i> Actions</h2>
          <div class="action-button-container">
            <button class="action-btn assign-btn" id="assignBtn">
              <i class="fas fa-user-plus"></i> Assign Officer
            </button>
            <button class="action-btn emergency-btn" id="actionBtn">
              <i class="fas fa-tower-broadcast"></i> Set Emergency Routes
            </button>
            <button class="action-btn diversion-btn" id="diversionBtn">
              <i class="fas fa-arrow-turn-up"></i> Set Diversion Plan
            </button>
          </div>
        </div>
      </div>

      <div class="map-status-container">
        <div class="left-side">
          <div id="map"></div>
        </div>

        <div class="right-side">
          <div class="status-panel-header">
            <h3><i class="fas fa-list-check"></i> Road Network Status</h3>
            <span class="live-indicator"><i class="fas fa-circle"></i> LIVE</span>
          </div>

          <div class="status-items-container">
            <div class="status-item road-closed">
              <div class="status-info">
                <i class="fas fa-ban"></i>
                <span>Closed Roads</span>
              </div>
              <span class="status-count">3</span>
            </div>

            <div class="status-item road-congestion">
              <div class="status-info">
                <i class="fas fa-traffic-light"></i>
                <span>Traffic Congestion roads</span>
              </div>
              <span class="status-count">2</span>
            </div>

            <div class="status-item road-maintenance">
              <div class="status-info">
                <i class="fas fa-hammer"></i>
                <span>Road Maintenance</span>
              </div>
              <span class="status-count">5</span>
            </div>

            <div class="status-item road-incidents">
              <div class="status-info">
                <i class="fas fa-car-crash"></i>
                <p>Active Incidents</p>
              </div>
              <span class="status-count">5</span>
            </div>

            <div class="incident-log-container">
              <h4>Recent Activity Log</h4>
              <div class="log-entry">
                <span class="log-time">2:20pm</span>
                <p>Diversion Plan Alpha Activated for Mauban St.</p>
              </div>
              <div class="log-entry">
                <span class="log-time">2:20pm</span>
                <p>Officer on MMDA arrvied at Tagaytay St.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  </main>

  <?php include '../includes/admin-footer.php'; ?>

  <script type="module" src="../scripts/route_planning/route_planning.js"></script>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const map = L.map('map').setView([14.6414, 120.9909], 18);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
  </script>
</body>

</html>