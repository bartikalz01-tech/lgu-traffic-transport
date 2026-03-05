<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=, initial-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Raleway:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <link rel="icon" type="image/x-icon" href="../images/favicon.ico">
  <link rel="stylesheet" href="../styles/global.css">
  <link rel="stylesheet" href="../styles/sidebar.css">
  <link rel="stylesheet" href="../styles/buttons.css">
  <link rel="stylesheet" href="../styles/dashboard.css">
  <link rel="stylesheet" href="../styles/road_condition/road_condition_header.css">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <title>Dashboard</title>
</head>

<body>
  <?php include '../includes/official_sidebar.php'; ?>

  <?php include '../includes/accident_header.php' ?>

  <main class="main">
    <section class="dashboard-container">
      <div class="top-sections">
        <div class="high-congestion-roads">
          <div class="report-logo high-traffic-logo">
            <i class="fas fa-road"></i>
          </div>
          <div class="traffic-road-description">
            <h2 class="top-section-value" id="totalHighTrafficRoads">3</h2>
            <p class="top-section-label">High Traffic Roads</p>
          </div>
        </div>
        <div class="vehicles-per-min">
          <div class="report-logo vehicle-logo">
            <i class="fas fa-car"></i>
          </div>
          <div class="vehicle-per-min-description">
            <h2 class="top-section-value" id="totalVehiclesPerMin">436</h2>
            <p class="top-section-label">Vehicles Per Minute</p>
          </div>
        </div>
        <div class="average-speed">
          <div class="report-logo low-logo">
            <!-- The averageSpeed color of logo should based on the data of traffic -->
            <i class="fas fa-tachometer-alt"></i>
          </div>
          <div class="avg-speed-description">
            <h2 class="top-section-value" id="averageSpeed">38 km/h</h2>
            <p class="top-section-label">Average City Speed</p>
          </div>
        </div>
        <div class="active-incidents">
          <div class="report-logo incident-logo">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div>
            <h2 class="top-section-value" id="activeIncidents">7</h2>
            <p class="top-section-label">Active Incidents</p>
          </div>
        </div>
      </div>

      <div class="traffic-map-graph-container">
        <div class="traffic-map">
          <div id="map"></div>
        </div>
        <div class="traffic-vol-overtime-container">
          <div class="chart-card">
            <div class="chart-header">
              <div class="chart-title">
                <h3>Traffic Volume Overtime</h3>
                <p>Vehicles per minute</p>
              </div>
              <div class="chart-control">
                <select id="roadFilter">
                  <option value="all">All Roads</option>
                  <option value="Dome">Dome</option>
                  <option value="Mt. Natib">Mt. Natib</option>
                  <option value="Klawit">Klawit</option>
                  <option value="Kalandang">Kalandang</option>
                  <option value="Mauban">Mauban</option>
                  <option value="Tagaytay St">Tagaytay St</option>
                </select>
              </div>
            </div>

            <!--<div class="road-toggles">
              <label><input type="checkbox" value="Dome" checked> Dome</label>
              <label><input type="checkbox" value="Mt. Natib" checked> Mt. Natib</label>
              <label><input type="checkbox" value="Klawit" checked> Klawit</label>
              <label><input type="checkbox" value="Kalandang" checked> Kalandang</label>
              <label><input type="checkbox" value="Mauban" checked> Mauban</label>
              <label><input type="checkbox" value="Tagaytay St" checked> Tagaytay St</label>
            </div>-->
            <div class="chart-wrapper">
              <canvas id="trafficVolumeChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <script src="../scripts/dashboard.js"></script>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const map = L.map('map').setView([14.6414, 120.9909], 18);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
  </script>
</body>

</html>