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
  
  <main class="app">
    <section id="publicTransportCoordinationContainer" class="public-transport-coordination-container"></section>
  </main>

  <?php include '../includes/admin-footer.php' ?>

  <script src="../scripts/sidebar.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <script type="module" src="../scripts/public_coordination/public_coordination_test.js"></script>
</body>
</html>