<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../styles/global.css">
  <link rel="stylesheet" href="../styles/sidebar.css">
  <link rel="stylesheet" href="../styles/road_condition/road_conditions.css">
  <link rel="stylesheet" href="../styles/road_condition/road_condition_header.css">
  <link rel="stylesheet" href="../styles/road_condition/detailed_cctv.css">
  <title>Road Updates</title>
</head>

<body>
  <main class="app">
    <div class="sidebar-overlay"></div>

    <nav class="sidebar-container">
      <div class="sidebar-header">
        <div class="sidebar-header-content">
          <i class="fas fa-traffic-light"></i>
        </div>
        <button class="sidebar-close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="menu-items">
        <a href="#" class="sidebar-link">
          <i class="fas fa-home"></i>
          <span>Dashboard</span>
        </a>
        <a href="#" class="sidebar-link">
          <i class="fas fa-road"></i>
          <span>Road Conditions</span>
        </a>
        <a href="#" class="sidebar-link">
          <i class="fas fa-car-crash"></i>
          <span>Accident Reports</span>
        </a>
        <a href="#" class="sidebar-link">
          <i class="fas fa-route"></i>
          <span>Route Planning</span>
        </a>
        <a href="#" class="sidebar-link">
          <i class="fas fa-car"></i>
          <span>Public Transport</span>
        </a>
        <a href="#" class="sidebar-link">
          <i class="fas fa-ticket-alt"></i>
          <span>Violation Ticketing</span>
        </a>
      </div>

    </nav>

    <header class="road-ud-header">
      <div class="road-ud-title-container">
        <button class="hamburger-menu-btn"><i class="fas fa-bars"></i></button>
        <div class="cctv-title-container">
          <a href="#" class="header-title">
            <i class="fas fa-video"></i>
            <span>CCTV Monitor</span>
          </a>
        </div>
        <div class="cctv-title-container">
          <a href="#" class="header-title">
            <i class="fas fa-traffic-light"></i>
            Traffic Flow Monitoring
          </a>
        </div>
        <div class="cctv-title-container">
          <a href="#" class="header-title">
            <i class="fas fa-car-crash"></i>
            Prone Road Accidents
          </a>
        </div>
      </div>
    </header>

    <section class="cctv-grid js-cctv-grid"></section>

    <div class="road-condition-overlay hidden"></div>
  </main>

  <script type="module" src="../scripts/road_condition.js"></script>
</body>

</html>