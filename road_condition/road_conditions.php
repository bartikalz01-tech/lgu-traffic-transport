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
  <link rel="stylesheet" href="../styles/buttons.css">
  <link rel="stylesheet" href="../styles/sidebar-footer.css">
  <title>Road Updates</title>
</head>

<body>
  <main class="app">
    <div class="sidebar-overlay"></div>
    
    <?php include('../includes/official_sidebar.php') ?>

    <header class="road-ud-header">
      <div class="road-ud-title-container">
        <div class="header-left-section">
          <button class="hamburger-menu-btn"><i class="fas fa-bars"></i></button>
        </div>

        <div class="header-middle-section">
          <div class="cctv-title-container">
            <a href="#" class="header-title">
              <i class="fas fa-video"></i>
              <span>CCTV Monitoring</span>
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

        <div class="header-right-section">
          <div class="user-profile" id="userProfileBtn">
            <div class="user-info">
              <div class="user-name">Admin User</div>
              <div class="user-role">Administrator</div>
            </div>
            <div class="user-avatar">
              <img src="https://ui-avatars.com/api/?name=Admin+User&background=4c8a89&color=fff&size=128" alt="Admin User" class="avatar-img">
            </div>
            <i class="fas fa-chevron-down dropdown-icon"></i>
          </div>
        </div>
      </div>
    </header>

    <div class="module-title-container">
      <p class="module-title">Real Time Road Condition Updates</p>
      <h1 class="sub-module-title">CCTV Monitoring</h1>
      <p class="sub-module-description">Real-time surveillance and predictive analytics<span class="streetName remove"></span></p>
    </div>

    <section class="cctv-grid js-cctv-grid"></section>

    <div class="road-condition-overlay hidden"></div>
  </main>

  <?php include '../includes/admin-footer.php'; ?>

  <script type="module" src="../scripts/road_condition.js"></script>
</body>

</html>