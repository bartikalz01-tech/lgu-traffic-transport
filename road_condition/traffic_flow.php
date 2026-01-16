<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/x-icon" href="../images/favicon.ico">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <link rel="stylesheet" href="../styles/global.css">
  <link rel="stylesheet" href="../styles/sidebar.css">
  <link rel="stylesheet" href="../styles/road_condition/road_conditions.css"> <!-- Just for sidebar overlay -->
  <link rel="stylesheet" href="../styles/road_condition/road_condition_header.css">
  <link rel="stylesheet" href="../styles/road_condition/traffic_flow.css">
  <link rel="stylesheet" href="../styles/sidebar-footer.css">
  <title>Traffic Flow Monitoring</title>
</head>

<body>
  <main class="app">
    <div class="sidebar-overlay"></div>

    <?php include '../includes/official_sidebar.php' ?>

    <?php include '../includes/road_ud_header.php' ?>

    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">
      <div class="module-title-container">
        <p class="module-title">Real Time Road Condition Updates</p>
        <h1 class="sub-module-title">Traffic Flow Monitoring</h1>
        <p class="sub-module-description">Real-time traffic flow monitoring and analysis</p>
      </div>
      <p class="current-time">12:00:00</p>
    </div>
    <!-- For Cards Later
    <th>Average Traffic Speed</th>
    <th>Average Traffic Volume</th>
    <th>Average Traffic Density</th>
    <th>Average Traffic Flow</th>
    -->
    <section class="traffic-container">
      <div class="traffic-left-section">
        <div class="heat-map">
          <div id="map"></div>
        </div>
        <div class="roads-table">
          <table class="data-table">
            <thead>
              <tr>
                <th>Road Name</th>
                <th>Traffic Status</th>
                <th>Time</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody id="traffic-table-body"></tbody>
          </table>
        </div>
      </div>

      <div class="traffic-right-section">

        <div class="map-color-details">
          <h2>Traffic Color Legend</h2>
          <div class="high-traffic-color">
            <p>High Traffic:</p>
            <div class="color-red"></div>
          </div>
          <div class="moderate-traffic-color">
            <p>Moderate Traffic:</p>
            <div class="color-yellow"></div>
          </div>
          <div class="low-traffic-color">
            <p>Low Traffic:</p>
            <div class="color-green"></div>
          </div>
        </div>

        <div class="traffic-status-indicator js-traffic-status-indicator">
          <div class="traffic-indicator-title">
            <h3>
              <i class="fas fa-traffic-light"></i>
              Barangay Traffic Status
            </h3>
            <p>Real time traffic status</p>
          </div>
          <div class="high-traffic-percent">
            <p>High Traffic:</p>
            <div class="red-percentage"></div>
          </div>
          <div class="moderate-traffic-percent">
            <p>Moderate Traffic:</p>
            <div class="yellow-percentage"></div>
          </div>
          <div class="low-traffic-percent">
            <p>Low Traffic:</p>
            <div class="green-percentage"></div>
          </div>
          <div style="margin-top: 1rem; font-size: 0.75rem; color: var(--text-seconday);">
            <i class="fas fa-info-circle"></i>
            <span>Updated every 5 minutes based on traffic pattern</span>
          </div>
        </div>

        <div class="most-congested-road">
          <div class="traffic-indicator-title">
            <h3>
              <i class="fas fa-car-side"></i>
              Most Congested Road
            </h3>
            <p>Real time status</p>
          </div>
          <div class="congested-roads">
            <div class="road-type">
              <p>Road 1</p>
              <p class="time">5:00pm - 7:00pm</p>
            </div>
            <div class="road-type">
              <p>Road 2</p>
              <p class="time">6:00am - 8:00am</p>
            </div>
          </div>
        </div>
        <div class="prone-road-accidents">
          <div class="traffic-indicator-title">
            <h3>
              <i class="fa-solid fa-triangle-exclamation" style="color: #f39c12;"></i>
              Prone Road Accidents
            </h3>
          </div>
          <div class="road-type" style="border-left: 3px solid #f39c12;">
            <p>Road 1</p>
            <p style="color: #f39c12;">Moderates cases</p>
          </div>
          <div class="road-type">
            <p>Road 2</p>
            <p class="time">Critical cases</p>
          </div>
        </div>
      </div>
    </section>
  </main>

  <?php include '../includes/admin-footer.php'; ?>
  
  <!--<script
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCm4ObcL1Xl0KdXhP6efApFlaDy99S-Yso&callback=initMap"
    async
    defer></script>-->
  <!--<script
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCm4ObcL1Xl0KdXhP6efApFlaDy99S-Yso&libraries=visualization&callback=initMap"
    async
    defer></script>-->
  <!--<script
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCm4ObcL1Xl0KdXhP6efApFlaDy99S-Yso&callback=initMap"
    async
    defer></script>-->
  <script type="module" src="../scripts/road_condition/traffic_flow.js"></script>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const map = L.map('map').setView([14.6414, 120.9909], 18);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
  </script>
</body>

</html>