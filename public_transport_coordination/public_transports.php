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
  <link rel="stylesheet" href="../styles/transport/public_coordination.css">
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

    <section class="puv-group-section">
      <div class="left-part">
        <div class="title">
          <h1>PUV Groups</h1>
        </div>
        <button class="btn btn-primary" id="addGroup">
          <i class="fas fa-plus"></i>
          Add Group
        </button>
        <div class="group">
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
        </div>
      </div>

      <div class="right-part">
        <div class="group-overview-container">
          <h1 class="group-overview-title">Group Overview</h1>
        </div>

        <div class="group-details">
          <div class="first-part">
            <h1>Group:</h1>
            <p id="puvGroupName">Bataan Transport Cooperative</p>
          </div>
          <div class="total-vehicle-type">
            <div class="total-members">
              <h2>Total Members:</h2>
              <p id="puvTotalMembers">124</p>
            </div>
            <div class="vehicle-type">
              <h2>Vehicle Types:</h2>
              <p id="totalVehicleTypes">3</p>
            </div>
          </div>
          <div class="active-puv">
            <h2>Active PUVs:</h2>
            <p id="activePuv">76</p>
          </div>
        </div>

        <div class="different-vehicles-container" style="margin-top: 20px;">
          <h1 style="text-align: center;">Vehicle Types</h1>
          <div class="different-vehicles">
            <div class="vehicle-card">
              <i class="fas fa-van-shuttle"></i>
              <h3>Jeepneys</h3>
              <p>45 Drivers</p>
            </div>
            <div class="vehicle-card">
              <i class="fas fa-bus"></i>
              <h3>Bus</h3>
              <p>18 Drivers</p>
            </div>
            <div class="vehicle-card">
              <i class="fas fa-van-shuttle"></i>
              <h3>Modern Jeepneys</h3>
              <p>50 Drivers</p>
            </div>
          </div>
          <div class="add-btn-container">
            <button class="btn btn-outline-primary btn-add-vehicle" id="addVehicle">
              <i class="fas fa-plus"></i>
              Add Vehicle Type
            </button>
          </div>
        </div>

        <div class="members-container">
          <h1>PUV Group Members</h1>
          <div class="indicator-button">
            <div class="indicator">
              <h3>Members on:</h3>
              <p>Jeepney</p>
            </div>
            <button class="btn btn-info">
              <i class="fas fa-car-side"></i>
              Select Vehicle Driver
              <i class="fas fa-chevron-down"></i>
            </button>
          </div>

          <div class="members-table-container">
            <table class="members-table">
              <thead>
                <tr>
                  <th>Driver</th>
                  <th>Vehicle Type</th>
                  <th>Position</th>
                  <th>PUV #</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Juan Dela Cruz</td>
                  <td>Jeepney</td>
                  <td>Driver</td>
                  <td>JPN-102</td>
                  <td>
                    <span class="status active">Active</span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-outline-info">
                      <i class="fas fa-eye"></i>
                    </button>
                  </td>
                </tr>

                <tr>
                  <td>Pedro Santos</td>
                  <td>Jeepney</td>
                  <td>JPN-118</td>
                  <td>Conductor</td>
                  <td><span class="status active">Inactive</span></td>
                  <td>
                    <button class="btn btn-sm btn-outline-info">
                      <i class="fas fa-eye"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <?php include '../includes/admin-footer.php' ?>
  </main>

  <script type="module" src="../scripts/public_coordination/public_coordination.js"></script>
</body>

</html>