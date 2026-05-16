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

        <div class="setting-emergency-routes">
          <div class="emergency-map-container">
            <div id="emergency-map"></div>
          </div>

          <aside class="ai-routes-container">
            <div class="ai-header">
              <h3><i class="fas fa-satellite-dish"></i> Nearest Responders</h3>
            </div>

            <div class="responder-list">
              <div class="responder-placeholder">
                <i class="fas fa-map-location-dot"></i>
                <p>Select an incident marker on the map to query closest emergency responders</p>
              </div>
              <div class="responder-group-section" id="primaryGroupSection">
                <div class="group-label">
                  <i class="fas fa-star"></i> Primary Emergency Responders
                </div>

                <div id="primaryResponderContainer"></div>
              </div>

              <div class="responder-group-section" id="supportiveGroupSection">
                <div class="group-label">
                  <i class="fas fa-handshake"></i> Optional Support Units
                </div>

                <div id="supportiveResponderContainer">
                  <!--<div class="responder-item medical-dept">
                    <div class="responder-icon">
                      <i class="fas fa-hospital-user"></i>
                    </div>
                    <div class="responder-info">
                      <h4>Metro General Hospital</h4>
                      <p><i class="fas fa-map-marker-alt"></i> 124 medical center blvd</p>
                    </div>
                    <div class="responder-distance">
                      <span class="dist-value">1.85</span>
                      <span class="dist-unit">km</span>
                    </div>
                  </div>-->

                  <!--<div class="responder-item police-dept">
                    <div class="responder-icon">
                      <i class="fas fa-shield-halved"></i>
                    </div>
                    <div class="responder-info">
                      <h4>Central Police Precinct 3</h4>
                      <p><i class="fas fa-map-marker-alt"></i> 404 Law Enforcement Rd</p>
                    </div>
                    <div class="responder-distance">
                      <span class="dist-value">3.20</span>
                      <span class="dist-unit">km</span>
                    </div>
                  </div>-->
                </div>
              </div>
            </div>

            <div class="emergency-card-actions" id="activeBtnContainer" style="display: none;"> 
              <button class="btn-primary-dispatch" id="activeBtn">
                <i class="fas fa-bullhorn"></i> Deploy & Activate Route
              </button>
            </div>
          </aside>
        </div>
      </section>

      <?php include '../includes/admin-footer.php'; ?>
    </div>
  </main>

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script src="../scripts/sidebar.js"></script>
  <script type="module" src="../scripts/route_planning/emergency/emergency_management.js"></script>
</body>

</html>