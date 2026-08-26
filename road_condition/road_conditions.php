<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="icon" type="image/x-icon" href="../images/favicon.ico">
  <link rel="stylesheet" href="../styles/global.css">
  <link rel="stylesheet" href="../styles/sidebar.css">
  <link rel="stylesheet" href="../styles/buttons.css">
  <link rel="stylesheet" href="../styles/road_condition/road_condition_header.css">
  <link rel="stylesheet" href="../styles/road_condition/road_condition_test.css">
  <link rel="stylesheet" href="../styles/road_condition/detailed_cctv.css">
  <link rel="stylesheet" href="../styles/road_condition/render_historical_recordings.css">
  <link rel="stylesheet" href="../styles/accident/quick_report.css">
  <link rel="stylesheet" href="../styles/violations/violation_quick_report.css">
  <link rel="stylesheet" href="../styles/sidebar-footer.css">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <title>Road Condition Updates</title>
</head>
<body>
  <?php include '../includes/official_sidebar.php' ?>

  <?php include '../includes/accident_header.php' ?>

  <main class="main">

    <div id="cctvPage">
      <div class="module-title-container">
        <p class="module-title">Real Time Road Condition Updates</p>
        <h1 class="sub-module-title" id="subModuleTitle"></h1>
        <p class="sub-module-description">Real-time surveillance and Real-Time analytics<span class="streetName remove"></span></p>
      </div>

      <section class="cctv-management-container" id="cctvManagementContainer"></section>
    </div>
  </main>
  
  <?php include '../includes/admin-footer.php' ?>

  <script src="../scripts/sidebar.js"></script>
  <script src="../scripts/header.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <script type="module" src="../scripts/road_condition/road_condition.js"></script>
</body>
</html>