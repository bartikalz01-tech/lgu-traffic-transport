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
  <link rel="stylesheet" href="../styles/road_condition/road_Condition_test.css">
  <link rel="stylesheet" href="../styles/sidebar-footer.css">
  <title>Document</title>
</head>
<body>
  <?php include '../includes/official_sidebar.php' ?>

  <?php include '../includes/accident_header.php' ?>

  <main class="main">
    <div class="module-title-container">
      <p class="module-title">Real Time Road Condition Updates</p>
      <h1 class="sub-module-title">CCTV Monitoring</h1>
      <p class="sub-module-description">Real-time surveillance and Real-Time analytics<span class="streetName remove"></span></p>
    </div>

    <section class="cctv-management-container">

      <div class="cctv-sidebar">
        <div class="cctv-sidebar-header">
          <div class="logo-container">
            <div class="live-indicator"></div>
            <i class="fas fa-video"></i>
          </div>
          <h4>CCTV Navigation</h4>
        </div>

        <div class="cctv-links">
          <div class="cctv-road active-stream">
            <div class="cctv-road-meta">
              <i class="fas fa-circle"></i>
              <p>CCTV-Dome-1</p>
            </div>
            <i class="fas fa-chevron-right cctv-road-chevron"></i>
          </div>
          <div class="cctv-road">
            <div class="cctv-road-meta">
              <i class="fas fa-circle"></i>
              <p>CCTV-Dome-2</p>
            </div>
            <i class="fas fa-chevron-right cctv-road-chevron"></i>
          </div>
          <div class="cctv-road">
            <div class="cctv-road-meta">
              <i class="fas fa-circle"></i>
              <p>CCTV-Tagaytay-1</p>
            </div>
            <i class="fas fa-chevron-right cctv-road-chevron"></i>
          </div>
          <div class="cctv-road">
            <div class="cctv-road-meta">
              <i class="fas fa-circle"></i>
              <p>CCTV-Tagaytay-2</p>
            </div>
            <i class="fas fa-chevron-right cctv-road-chevron"></i>
          </div>
        </div>
      </div>

      <div class="cctv-container">
        <div class="cctv-stream-card">
          <div class="stream-card-header">
            <span class="stream-badge live"><i class="fas fa-circle stream-pulse"></i> LIVE</span>
            <span class="stream-tag-id">NODE-01</span>
          </div>
          <div class="stream-video-viewport">
            <i class="fas fa-video viewport-center-icon"></i>
            <div class="stream-overlay-metadata">
              <p class="stream-road-name">CCTV-Dome-1</p>
            </div>
          </div>
        </div>

        <div class="cctv-stream-card">
          <div class="stream-card-header">
            <span class="stream-badge live"><i class="fas fa-circle stream-pulse"></i> LIVE</span>
            <span class="stream-tag-id">NODE-02</span>
          </div>
          <div class="stream-video-viewport">
            <i class="fas fa-video viewport-center-icon"></i>
            <div class="stream-overlay-metadata">
              <p class="stream-road-name">CCTV-Dome-2</p>
            </div>
          </div>
        </div>

        <div class="cctv-stream-card">
          <div class="stream-card-header">
            <span class="stream-badge live"><i class="fas fa-circle stream-pulse"></i> LIVE</span>
            <span class="stream-tag-id">NODE-03</span>
          </div>
          <div class="stream-video-viewport">
            <i class="fas fa-video viewport-center-icon"></i>
            <div class="stream-overlay-metadata">
              <p class="stream-road-name">CCTV-Tagaytay-1</p>
            </div>
          </div>
        </div>

        <div class="cctv-stream-card">
          <div class="stream-card-header">
            <span class="stream-badge live"><i class="fas fa-circle stream-pulse"></i> LIVE</span>
            <span class="stream-tag-id">NODE-04</span>
          </div>
          <div class="stream-video-viewport">
            <i class="fas fa-video viewport-center-icon"></i>
            <div class="stream-overlay-metadata">
              <p class="stream-road-name">CCTV-Tagaytay-2</p>
            </div>
          </div>
        </div>
      </div>
    </section>

  </main>
  
  <?php include '../includes/admin-footer.php' ?>

  <script src="../scripts/sidebar.js"></script>
</body>
</html>