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
  <link rel="stylesheet" href="../styles/cards.css">
  <link rel="stylesheet" href="../styles/accident/accident_test.css">
  <link rel="stylesheet" href="../styles/accident/detailed_report.css">
  <link rel="stylesheet" href="../styles/road_condition/road_condition_header.css">
  <link rel="stylesheet" href="../styles/sidebar-footer.css">
  <title>Accident Reports</title>
</head>

<body>
  <main class="app">

    <?php include '../includes/official_sidebar.php'; ?>

    <?php include '../includes/accident_header.php'; ?>

    <section class="accidents-container">

      <div class="accident-summary-grid" id="accidentSummary"></div>

      <div class="accident-reports-panel" id="accidentReportsPanel"></div>

    </section>

    <?php include '../includes/admin-footer.php'; ?>
  </main>

  <script src="../scripts/sidebar.js"></script>
  <script type="module" src="../scripts/accident/accident.js" defer></script>
</body>

</html>