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
  <link rel="stylesheet" href="../styles/route_planning/diversions.css">
  <link rel="stylesheet" href="../styles/sidebar-footer.css">
  <title>Diversion Routes</title>
</head>

<body>
  <main class="app">
    <?php include '../includes/official_sidebar.php' ?>

    <?php include '../includes/accident_header.php' ?>

    <section class="diversion-plan-container">
      <div class="top-navbar">
        <button class="btn btn-outline-primary"><i class="fas fa-arrow-turn-up"></i> Diversion Routes</button>
        <button class="btn btn-outline-primary"><i class="fas fa-shuffle"></i> Active Routes</button>
        <button class="btn btn-outline-primary"><i class="fas fa-route"></i> Resolved Routes</button>
      </div>

      <div class="diversion-routes-container">
        <div class="route-card">
          <div class="left-part">
            <div class="route-map-display" id="routeMap"></div>
          </div>
          <div class="right-part">
            <div class="info-header">
              <span class="status-badge">Pending</span>
              <h3>Diversion Alpha</h3>
            </div>

            <div class="info-grid">
              <div class="info-item">
                <label><i class="fas fa-play"></i> Start Route</label>
                <p class="road-value">Mt.Natib</p>
              </div>
              <div class="info-item">
                <label><i class="fas fa-location-dot"></i> Destination</label>
                <p class="road-value">Kalandang</p>
              </div>
              <div class="info-item">
                <label><i class="fas fa-road"></i> Distance</label>
                <p class="kilometer-value">15 km</p>
              </div>

              <div class="card-actions">
                <button class="btn btn-sm btn-info">Activate</button>
              </div>
            </div>
          </div>
        </div>

        <div class="route-card">
          <div class="left-part">
            <div class="route-map-display" id="routeMap"></div>
          </div>
          <div class="right-part">
            <div class="info-header">
              <span class="status-badge">Pending</span>
              <h3>Diversion Alpha</h3>
            </div>

            <div class="info-grid">
              <div class="info-item">
                <label><i class="fas fa-play"></i> Start Route</label>
                <p class="road-value">Mt.Natib</p>
              </div>
              <div class="info-item">
                <label><i class="fas fa-location-dot"></i> Destination</label>
                <p class="road-value">Kalandang</p>
              </div>
              <div class="info-item">
                <label><i class="fas fa-road"></i> Distance</label>
                <p class="kilometer-value">15 km</p>
              </div>

              <div class="card-actions">
                <button class="btn btn-sm btn-info">Activate</button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  </main>

  <?php include '../includes/admin-footer.php'; ?>

  <script src="../scripts/sidebar.js"></script>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
</body>
</html>