<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/x-icon" href="../images/favicon.ico">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../styles/global.css">
  <link rel="stylesheet" href="../styles/sidebar.css">
  <link rel="stylesheet" href="../styles/buttons.css">
  <link rel="stylesheet" href="../styles/accident/accident_test.css">
  <link rel="stylesheet" href="../styles/accident/quick_report.css">
  <link rel="stylesheet" href="../styles/accident/detailed_report.css">
  <link rel="stylesheet" href="../styles/tickets.css">
  <link rel="stylesheet" href="../styles/road_condition/road_condition_header.css">
  <link rel="stylesheet" href="../styles/sidebar-footer.css">
  <title>Accident Reports</title>
</head>

<body>
  <main class="app">

    <?php include '../includes/official_sidebar.php'; ?>

    <?php include '../includes/accident_header.php'; ?>

    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
      <div class="module-title-container">
        <p class="module-title">Accident Reports</p>
        <h1 class="sub-module-title">Accident Reports System</h1>
        <p class="sub-module-description">Report and manage traffic accidents, violations, and incidents in real-time</p>
      </div>
      <button class="btn btn-primary" id="quickReportsBtn" style="margin-top: var(--header-h); margin-right: 20px;">
        <i class="fas fa-plus"></i> Quick Reports
      </button>
    </div>

    <section class="accidents-container">
      <div class="accident-list-panel">
        <div class="list-header">
          <h3><i class="fas fa-history"></i> Recent Reports</h3>
          <div class="list-controls">
            <div class="filter-container">
              <div class="date-filter">
                <button class="date-filter-btn" title="Filter by date">
                  <i class="fas fa-calendar-days"></i>
                </button>

                <div class="date-filter-field">
                  <label for="dateFromm">From</label>
                  <input type="date" id="dateFrom">
                </div>

                <div class="date-filter-field">
                  <label for="dateTo">To</label>
                  <input type="date" id="dateTo">
                </div>

                <div class="date-filter-actions">
                  <button type="button" class="btn btn-secondary">Clear</button>
                  <button type="button" class="btn btn-primary">Apply</button>
                </div>
              </div>
              <div class="search-box">
                <i class="fas fa-search"></i>
                <input type="text" id="searchReports" placeholder="Search reports...">
              </div>
            </div>
            <button class="btn btn-secondary" id="refreshListBtn">
              <i class="fas fa-sync-alt"></i>
            </button>
          </div>
        </div>

        <div class="list-body" id="accidentList">
          <!-- Accident items will be loaded here -->
        </div>
      </div>
    </section>

    <div class="quick-report-overlay hidden"></div>

    <div class="detailed-reports-overlay detailed-reports-hidden"></div>

    <?php include '../includes/admin-footer.php'; ?>
  </main>

  <script type="module" src="../scripts/accident/accident_test.js" defer></script>
</body>

</html>