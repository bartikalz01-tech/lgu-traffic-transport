<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="icon" type="image/x-icon" href="../images/favicon.ico">
  <link rel="stylesheet" href="../styles/global.css">
  <link rel="stylesheet" href="../styles/sidebar.css">
  <link rel="stylesheet" href="../styles/buttons.css">
  <link rel="stylesheet" href="../styles/road_condition/road_condition_header.css">
  <link rel="stylesheet" href="../styles/sidebar-footer.css">
  <link rel="stylesheet" href="../styles/violations/violation.css">
  <title>Violations Reports</title>
</head>

<body>
  <main class="app">
    <?php include '../includes/official_sidebar.php'; ?>

    <?php include '../includes/accident_header.php' ?>

    <!--<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
      <div class="module-title-container">
        <p class="module-title">Violation and Ticketing System</p>
        <h1 class="sub-module-title">Violation Reports</h1>
        <p class="sub-module-description">Violation and ticketing system</p>
      </div>
    </div>-->

    <section class="violation-container">
      <div class="violation-summary-grid" id="violationSummaryPanel"></div>

      <div class="violation-report-panel" id="violationReportsPanel"></div>
    </section>

    <?php include '../includes/admin-footer.php'; ?>
  </main>

  <script src="../scripts/sidebar.js"></script>
  <script type="module" src="../scripts/violation/violation.js"></script>
</body>

</html>