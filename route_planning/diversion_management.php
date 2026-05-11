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
  <link rel="stylesheet" href="../styles/route_planning//final_diversions.css">
  <link rel="stylesheet" href="../styles/sidebar-footer.css">
  <title>Diversion Routes</title>
</head>
<body>
  <main class="app">
    <?php include '../includes/official_sidebar.php' ?>

    <?php include '../includes/accident_header.php' ?>

    <section class="diversion-plan-container">
      <div class="traffic-overview-panel">
        <div class="overview-card high-traffic">
          <div class="card-icon">
            <i class="fas fa-car"></i>
          </div>
          <div class="card-details">
            <span class="card-label">High Traffic Roads</span>
            <h2 class="card-value">3</h2>
          </div>
          <div class="card-trend down">
            <i class="fas fa-arrow-down"></i> 2%
          </div>
        </div>
        <div class="overview-card active-diversions">
          <div class="card-icon">
            <i class="fas fa-route"></i>
          </div>
          <div class="card-details">
            <span class="card-label">Active Diversions</span>
            <h2 class="card-value">6</h2>
          </div>
          <div class="card-status live">LIVE</div>
        </div>
        <div class="overview-card avg-speed-total">
          <div class="card-icon">
            <i class="fas fa-gauge-high"></i>
          </div>
          <div class="card-details">
            <span class="card-label">Average Speed</span>
            <h2 class="card-value">28 <span>km/h</span></h2>
          </div>
          <div class="card-trend up">
            <i class="fas fa-arrow-up"></i> 5%
          </div>
        </div>
      </div>

      <div class="diversion-main-content">
        <div class="map-view-container">
          <div id="map-placeholder">
            <div class="map-overlay-hint">
              <i class="fas fa-crosshairs"></i>
              <p>Click two intersections to plan a diversion</p>
            </div>
            <!-- Map will render here -->
          </div>
        </div>

        <aside class="diversion-sidebar">
          <div class="d-sidebar-header">
            <h3>Route Selection</h3>
          </div>

          <div class="selection-group">
            <div class="point-item start">
              <span class="dot"></span>
              <div class="point-info">
                <label>Starting Point</label>
                <p id="startPointName">Awaiting Selection...</p>
              </div>
            </div>

            <div class="point-item end">
              <span class="dot"></span>
              <div class="point-info">
                <label>End Point</label>
                <p id="endPointName">Awaiting Selection...</p>
              </div>
            </div>
          </div>

          <div class="distance-summary">
            <span>Total Distance:</span>
            <strong id="calcDistance">0.00 km</strong>
          </div>

          <div class="suggesstions-list">
            <label class="list-label">Diversion Suggesstions</label>

            <div class="suggestion-card">
              <div class="suggestion-meta">
                <span class="badge fastest">Fastest</span>
                <span class="eta">10 mins</span>
              </div>
              <p class="affected-roads">Via Mauban & Tagaytay St.</p>
            </div>

            <div class="suggestion-card">
              <div class="suggestion-meta">
                <span class="badge shortest">Shortest</span>
                <span class="eta">14 min</span>
              </div>
              <p class="affected-roads">Via Dome St. & G. Roxas</p>
            </div>

            <div class="suggestion-card">
              <div class="suggestion-meta">
                <span class="badge alternative">Balanced</span>
                <span class="eta">12 min</span>
              </div>
              <p class="affected-roads">Via Sgt. Rivera Ave.</p>
            </div>
          </div>
        </aside>
      </div>
    </section>

  </main>

  <?php include '../includes/admin-footer.php'; ?>
</body>
</html>