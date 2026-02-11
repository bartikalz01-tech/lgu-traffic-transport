<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/x-icon" href="../images/favicon.ico">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../styles/global.css">
  <link rel="stylesheet" href="../styles/sidebar.css">
  <link rel="stylesheet" href="../styles/road_condition/road_conditions.css">
  <link rel="stylesheet" href="../styles/road_condition/road_condition_header.css">
  <link rel="stylesheet" href="../styles/road_condition/detailed_cctv.css">
  <link rel="stylesheet" href="../styles/buttons.css">
  <link rel="stylesheet" href="../styles/sidebar-footer.css">
  <title>Road Updates</title>
</head>

<body>
  <main class="app">
    <?php include '../includes/official_sidebar.php'; ?>

    <?php include '../includes/accident_header.php' ?>

    <div class="module-title-container">
      <p class="module-title">Real Time Road Condition Updates</p>
      <h1 class="sub-module-title">CCTV Monitoring</h1>
      <p class="sub-module-description">Real-time surveillance and predictive analytics<span class="streetName remove"></span></p>
    </div>

    <!--<section class="charts-container">
      <div class="chart">
        <div class="chart-title">
          <h2>Traffic Conditions</h2>
        </div>
        <canvas id="trafficConditionChart"></canvas>
      </div>
      <div class="chart">
        <canvas id="topRoadsChart"></canvas>
      </div>
      <div class="chart">
        <canvas id="trafficTrendChart"></canvas>
      </div>
      <div class="chart">
        <canvas id="congestedGauge"></canvas>
      </div>
    </section>-->

    <section class="cctv-grid js-cctv-grid"></section>

    <div class="road-condition-overlay hidden"></div>
  </main>

  <?php include '../includes/admin-footer.php'; ?>

  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script type="module" src="../scripts/road_condition/road_condition.js"></script>
</body>

</html>