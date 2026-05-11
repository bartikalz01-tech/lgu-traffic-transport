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
  <link rel="stylesheet" href="../styles/route_planning/diversion_schedule.css">
  <link rel="stylesheet" href="../styles/sidebar-footer.css">
  <title>Diversion Routes</title>
</head>

<body>
  <main class="app">
    <?php include '../includes/official_sidebar.php' ?>

    <?php include '../includes/accident_header.php' ?>

    <section class="diversion-plan-container">
      <div class="top-navbar">
        <button class="btn btn-outline-primary" id="navDiversion">
          <i class="fas fa-arrow-turn-up"></i> Diversion Routes
        </button>
        <button class="btn btn-outline-primary" id="navActive">
          <i class="fas fa-shuffle"></i> Active Routes
        </button>
        <button class="btn btn-outline-primary" id="navResolved">
          <i class="fas fa-route"></i> Resolved Routes
        </button>
      </div>

      <div class="diversion-info-container">
        <div class="diversion-routes-container" id="diversionContainer"></div>
        <div class="active-routes-container hidden" id="activeContainer"></div>
        <div class="resolved-routes-container hidden" id="resolvedContainer"></div>
      </div>

    </section>
  </main>

  <?php include '../includes/admin-footer.php'; ?>

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script src="../scripts/sidebar.js"></script>
  <script type="module" src="../scripts/route_planning/diversions/diversion_plans.js"></script>
</body>
</html>