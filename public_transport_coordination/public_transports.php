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
  <link rel="stylesheet" href="../styles/transport/public_coordination.css">
  <link rel="stylesheet" href="../styles/transport/add_group.css">
  <link rel="stylesheet" href="../styles/transport/add_group_member.css">
  <link rel="stylesheet" href="../styles/transport/member_info_modal.css">
  <link rel="stylesheet" href="../styles/sidebar-footer.css">
  <title>Public Transport Coordination</title>
</head>

<body>
  <?php include '../includes/official_sidebar.php' ?>

  <?php include '../includes/accident_header.php' ?>

  <main class="app">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
      <div class="module-title-container">
        <p class="module-title">Public Transport Coordination</p>
        <h1 class="sub-module-title">Public Utility Groups</h1>
        <p class="sub-module-description">Manage PUV Groups, Vehicle types, and members</p>
      </div>
      <!--<button class="btn btn-primary" id="quickReportsBtn" style="margin-top: var(--header-h); margin-right: 20px;">
        <i class="fas fa-plus"></i> Quick Reports
      </button>-->
    </div>

    <section class="puv-group-section" id="puvLayout">
      <div class="left-part" id="ptcNavbar">

        <div class="sidebar-component active">
          <div class="component-header">
            <i class="fas fa-bus-alt"></i>
            <span>PUV Groups</span>
          </div>
          <div class="component-links">
            <!--<div class="group active">
              <i class="fas fa-circle"></i>
              <p>Bataan Coordination</p>
            </div>
            <div class="group">
              <i class="fas fa-circle"></i>
              <p>Orion Coop</p>
            </div>
            <div class="group">
              <i class="fas fa-circle"></i>
              <p>Pilar Association</p>
            </div>
            <div class="group">
              <i class="fas fa-circle"></i>
              <p>Test</p>
            </div>-->
          </div>
        </div>

        <div class="sidebar-component">
          <div class="component-header">
            <i class="fas fa-route"></i>
            <span>PUV Alternate Routes</span>
          </div>
        </div>

      </div>
      <div class="right-part" id="ptcContainers">
        
      </div>
    </section>

    <div class="add-puv-group-overlay add-puv-group-hidden" id="addGroupOverlay"></div>
    <div class="add-member-overlay add-member-hidden" id="addGroupMemberOverlay"></div>
    <div class="member-info-overlay member-info-hidden" id="memberInfoOverlay"></div>
  </main>

  <?php include '../includes/admin-footer.php' ?>

  <script src="../scripts/sidebar.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <script type="module" src="../scripts/public_coordination/public_coordination.js"></script>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
</body>

</html>