<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
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
            <tbody>
              <tr>
                <td>Road 1</td>
                <td>Moderate</td>
                <td>10:00</td>
                <td>2026-01-01</td>
              </tr>
              <tr>
                <td>Road 2</td>
                <td>High</td>
                <td>11:00</td>
                <td>2026-01-02</td>
              </tr>
              <tr>
                <td>Road 3</td>
                <td>High</td>
                <td>11:00</td>
                <td>2026-01-02</td>
              </tr>
              <tr>
                <td>Road 4</td>
                <td>High</td>
                <td>11:00</td>
                <td>2026-01-02</td>
              </tr>
              <tr>
                <td>Road 5</td>
                <td>High</td>
                <td>11:00</td>
                <td>2026-01-02</td>
              </tr>
              <tr>
                <td>Road 6</td>
                <td>High</td>
                <td>11:00</td>
                <td>2026-01-02</td>
              </tr>
              <tr>
                <td>Road 7</td>
                <td>High</td>
                <td>11:00</td>
                <td>2026-01-02</td>
              </tr>
              <tr>
                <td>Road 8</td>
                <td>High</td>
                <td>11:00</td>
                <td>2026-01-02</td>
              </tr>

            </tbody>
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

        <div class="traffic-status-indicator">
          <div class="traffic-indicator-title">
            <h3>
              <i class="fas fa-traffic-light"></i>
              Barangay Traffic Status
            </h3>
            <p>Real time traffic status</p>
          </div>
          <div class="high-traffic-percent">
            <p>High Traffic:</p>
            <div class="red-percentage">10%</div>
          </div>
          <div class="moderate-traffic-percent">
            <p>Moderate Traffic:</p>
            <div class="yellow-percentage">20%</div>
          </div>
          <div class="low-traffic-percent">
            <p>Low Traffic:</p>
            <div class="green-percentage">70%</div>
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
      </div>
    </section>
  </main>

  <?php include '../includes/admin-footer.php'; ?>

  <script type="module" src="../scripts/traffic_flow_test.js"></script>
  <!--<script
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCm4ObcL1Xl0KdXhP6efApFlaDy99S-Yso&callback=initMap"
    async
    defer></script>-->
    <!--<script
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCm4ObcL1Xl0KdXhP6efApFlaDy99S-Yso&libraries=visualization&callback=initMap"
    async
    defer></script>-->
    <script
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCm4ObcL1Xl0KdXhP6efApFlaDy99S-Yso&callback=initMap"
    async
    defer></script>
</body>

</html>