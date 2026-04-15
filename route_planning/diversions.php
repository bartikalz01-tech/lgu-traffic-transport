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
        <!--
        <div class="diversion-routes-container" id="diversionContainer">
          <div class="route-card">
            <div class="left-part">
              <div class="route-map-display" id="routeMap"></div>
            </div>
            <div class="right-part">
              <div class="info-header">
                <span class="status-badge pending">Pending</span>
                <h3>Diversion Alpha</h3>
              </div>

              <div class="info-grid">
                <div class="info-item">
                  <label><i class="fas fa-play"></i> Start Route</label>
                  <p class="road-value">Mt.Natib</p>
                </div>
                <div class="info-item">
                  <label><i class="fas fa-location-dot"></i> Destination</label>
                  <p class="road-value">Kalandang</p>
                </div>
                <div class="info-item">
                  <label><i class="fas fa-road"></i> Distance</label>
                  <p class="kilometer-value">15 km</p>
                </div>

                <div class="card-actions">
                  <button class="btn btn-sm btn-info">Activate</button>
                </div>
              </div>
            </div>
          </div>

          <div class="route-card">
            <div class="left-part">
              <div class="route-map-display" id="routeMap"></div>
            </div>
            <div class="right-part">
              <div class="info-header">
                <span class="status-badge pending">Pending</span>
                <h3>Diversion Alpha</h3>
              </div>

              <div class="info-grid">
                <div class="info-item">
                  <label><i class="fas fa-play"></i> Start Route</label>
                  <p class="road-value">Mt.Natib</p>
                </div>
                <div class="info-item">
                  <label><i class="fas fa-location-dot"></i> Destination</label>
                  <p class="road-value">Kalandang</p>
                </div>
                <div class="info-item">
                  <label><i class="fas fa-road"></i> Distance</label>
                  <p class="kilometer-value">15 km</p>
                </div>

                <div class="card-actions">
                  <button class="btn btn-sm btn-info">Activate</button>
                </div>
              </div>
            </div>
          </div>

          <div class="route-card">
            <div class="left-part">
              <div class="route-map-display" id="routeMap"></div>
            </div>
            <div class="right-part">
              <div class="info-header">
                <span class="status-badge pending">Pending</span>
                <h3>Diversion Alpha</h3>
              </div>

              <div class="info-grid">
                <div class="info-item">
                  <label><i class="fas fa-play"></i> Start Route</label>
                  <p class="road-value">Mt.Natib</p>
                </div>
                <div class="info-item">
                  <label><i class="fas fa-location-dot"></i> Destination</label>
                  <p class="road-value">Kalandang</p>
                </div>
                <div class="info-item">
                  <label><i class="fas fa-road"></i> Distance</label>
                  <p class="kilometer-value">15 km</p>
                </div>

                <div class="card-actions">
                  <button class="btn btn-sm btn-info">Activate</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="active-routes-container hidden" id="activeContainer">
          <div class="active-route-card">
            <div class="active-left-part">
              <div class="route-map-display" id="activeMap"></div>
            </div>
            <div class="active-right-part">
              <div class="active-info-header">
                <span class="status-badge active">Active</span>
                <h3>Diversion Alpha</h3>
              </div>

              <div class="active-info-grid">
                <div class="active-info-item">
                  <label><i class="fas fa-play"></i> Start Route</label>
                  <p class="road-value">Mt.Natib</p>
                </div>

                <div class="active-info-item">
                  <label><i class="fas fa-location-dot"></i> Destination</label>
                  <p class="road-value">Kalandang</p>
                </div>

                <div class="active-info-item">
                  <label><i class="fas fa-calendar-check"></i> Deadline</label>
                  <p class="date-value">April 10 - 6:00pm</p>
                </div>

                <div class="active-info-item">
                  <label><i class="fas fa-road"></i> Distance</label>
                  <p class="kilometer-value">15 km</p>
                </div>

                <div class="active-info-item">
                  <label><i class="fas fa-car"></i> Vehicles Per Min</label>
                  <p class="vehicle-per-min-value"> 24</p>
                </div>

                <div class="active-info-item">
                  <label><i class="fas fa-tachometer-alt"></i> Average Route Speed</label>
                  <p class="route-speed-value"> 37km/h</p>
                </div>
              </div>
            </div>
          </div>

          <div class="active-route-card">
            <div class="active-left-part">
              <div class="route-map-display" id="activeMap"></div>
            </div>
            <div class="active-right-part">
              <div class="active-info-header">
                <span class="status-badge scheduled">Scheduled</span>
                <h3>Diversion Alpha</h3>
              </div>

              <div class="active-info-grid">
                <div class="active-info-item">
                  <label><i class="fas fa-play"></i> Start Route</label>
                  <p class="road-value">Mt.Natib</p>
                </div>

                <div class="active-info-item">
                  <label><i class="fas fa-location-dot"></i> Destination</label>
                  <p class="road-value">Kalandang</p>
                </div>

                <div class="active-info-item">
                  <label><i class="fas fa-calendar-check"></i> Starting Date</label>
                  <p class="date-value">April 10 - 6:00pm</p>
                </div>

                <div class="active-info-item">
                  <label><i class="fas fa-road"></i> Distance</label>
                  <p class="kilometer-value">15 km</p>
                </div>

                <div class="active-info-item">
                  <label><i class="fas fa-car"></i> Vehicles Per Min</label>
                  <p class="vehicle-per-min-value"> 24</p>
                </div>

                <div class="active-info-item">
                  <label><i class="fas fa-tachometer-alt"></i> Average Route Speed</label>
                  <p class="route-speed-value"> 37km/h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="resolved-routes-container hidden" id="resolvedContainer">
          <div class="resolved-route-card success-border">
            <div class="resolved-summary">
              <div class="mini-map-placeholder">
                <i class="fas fa-map"></i>
              </div>

              <div class="resolved-main-info">
                <div class="resolved-header">
                  <h3>Diversion Alpha <small>#D-102</small></h3>
                  <span class="status-badge success">Success</span>
                </div>
                <div class="resolved-quick-stats">
                  <span><i class="fas fa-play"></i> Mt. Natib</span>
                  <span><i class="fas fa-location-dot"></i> Kalandang</span>
                </div>

                <div class="resolved-schedule-info">
                  <div class="schedule-item">
                    <label><i class="fas fa-calendar-days"></i> Project Duration</label>
                    <p>April 01, 2026 - April 12, 2026</p>
                  </div>
                  <div class="schedule-item">
                    <label><i class="fas fa-clock"></i> Active Window</label>
                    <p>Daily at 6:00pm - 10:00pm</p>
                  </div>
                </div>
              </div>

              <div class="resolved-metrics">
                <div class="metric-box">
                  <label>Avg Speed</label>
                  <p>42 km/h</p>
                </div>
                <div class="metric-box">
                  <label>Total Flow</label>
                  <p>1.2k Vehicles</p>
                </div>
              </div>

              <div class="resolved-actions">
                <button class="btn btn-icon-delete" title="Delete record">
                  <i class="fas fa-trash-can"></i>
                </button>
              </div>
            </div>
          </div>

          <div class="resolved-route-card failed-border">
            <div class="resolved-summary">
              <div class="mini-map-placeholder">
                <i class="fas fa-map"></i>
              </div>

              <div class="resolved-main-info">
                <div class="resolved-header">
                  <h3>Diversion Gamma <small>#D-098</small></h3>
                  <span class="status-badge failed">Failed</span>
                </div>
                <div class="resolved-quick-stats">
                  <span><i class="fas fa-play"></i> Klawit</span>
                  <span><i class="fas fa-location-dot"></i> Kalandang</span>
                </div>

                <div class="resolved-schedule-info">
                  <div class="schedule-item">
                    <label><i class="fas fa-calendar-days"></i> Project Duration</label>
                    <p>April 01, 2026 - April 12, 2026</p>
                  </div>
                  <div class="schedule-item">
                    <label><i class="fas fa-clock"></i> Active Window</label>
                    <p>Daily at 6:00pm - 10:00pm</p>
                  </div>
                </div>
              </div>

              <div class="resolved-metrics">
                <div class="metric-box">
                  <label>Avg Speed</label>
                  <p>12 km/h</p>
                </div>
                <div class="metric-box">
                  <label>Total Flow</label>
                  <p>1.2k Vehicles</p>
                </div>
              </div>

              <div class="resolved-actions">
                <button class="btn btn-icon-delete" title="Delete record">
                  <i class="fas fa-trash-can"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        -->

        <div class="diversion-routes-container" id="diversionContainer"></div>
        <div class="active-routes-container hidden" id="activeContainer"></div>
        <div class="resolved-routes-container hidden" id="resolvedContainer"></div>
      </div>

    </section>
  </main>

  <?php include '../includes/admin-footer.php'; ?>

  <script src="../scripts/sidebar.js"></script>
  <script type="module" src="../scripts/route_planning/diversion_plans.js"></script>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
</body>

</html>