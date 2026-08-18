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
  <link rel="stylesheet" href="../styles/transport/public_coordination_test.css">
  <link rel="stylesheet" href="../styles/sidebar-footer.css">
  <title>Public Transport Coordination</title>
</head>
<body>
  <?php include '../includes/official_sidebar.php' ?>

  <?php include '../includes/accident_header.php' ?>
  
  <main class="app">
    <section id="publicTransportCoordinationContainer" class="public-transport-coordination-container">
      <div class="ptc-page">
        <div class="ptc-page-header">
          <div>
            <span class="ptc-module-label">
              Public Transport Coordination
            </span>

            <h2 class="ptc-page-title">
              PUV Group Coordination
            </h2>

            <p class="ptc-page-description">
              Register and manage public transport groups
              operating within the barangay.
            </p>
          </div>

          <button type="button" class="ptc-primary-btn" id="registerPuvGroupBtn">
            <i class="fas fa-plus"></i> Register PUV Group
          </button>
        </div>

        <div id="ptcSummaryContainer"></div>

        <div id="ptcReportPanelContainer"></div>

        <div id="ptcRegisterModalContainer"></div>
      </div>
    </section>
  </main>

  <?php include '../includes/admin-footer.php' ?>

  <script src="../scripts/sidebar.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <script type="module" src="../scripts/public_coordination/public_coordination.js"></script>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
</body>
</html>