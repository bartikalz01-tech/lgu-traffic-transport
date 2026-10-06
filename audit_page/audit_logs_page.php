<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
  >

  <link rel="icon" type="image/x-icon" href="../images/favicon.ico">

  <link rel="stylesheet" href="../styles/global.css">
  <link rel="stylesheet" href="../styles/sidebar.css">
  <link rel="stylesheet" href="../styles/buttons.css">
  <link rel="stylesheet" href="../styles/road_condition/road_condition_header.css">
  <link rel="stylesheet" href="../styles/header_moodal.css">
  <link rel="stylesheet" href="../styles/sidebar-footer.css">

  <link rel="stylesheet" href="../styles/audit_logs/audit_logs.css">

  <title>Audit Logs</title>
</head>

<body>

  <?php include '../includes/official_sidebar.php' ?>

  <?php include '../includes/accident_header.php' ?>


  <main class="app audit-logs-page">

    <!-- =========================================
         PAGE HEADER
    ========================================== -->

    <div class="audit-logs-header">

      <div class="audit-logs-title-area">

        <div class="audit-logs-title-icon">
          <i class="fas fa-shield-halved"></i>
        </div>

        <div>
          <h1>Audit Logs</h1>

          <p>
            Monitor and review system activities performed by authorized users.
          </p>
        </div>

      </div>

    </div>


    <!-- =========================================
         SUMMARY CARDS
    ========================================== -->

    <!--<section class="audit-summary-grid">

      <div class="audit-summary-card">

        <div class="audit-summary-icon total">
          <i class="fas fa-list-check"></i>
        </div>

        <div class="audit-summary-content">
          <span>Total Logs</span>
          <strong>0</strong>
          <small>Recorded activities</small>
        </div>

      </div>


      <div class="audit-summary-card">

        <div class="audit-summary-icon create">
          <i class="fas fa-plus"></i>
        </div>

        <div class="audit-summary-content">
          <span>Creates</span>
          <strong>0</strong>
          <small>Records created</small>
        </div>

      </div>


      <div class="audit-summary-card">

        <div class="audit-summary-icon update">
          <i class="fas fa-pen"></i>
        </div>

        <div class="audit-summary-content">
          <span>Updates</span>
          <strong>0</strong>
          <small>Records modified</small>
        </div>

      </div>


      <div class="audit-summary-card">

        <div class="audit-summary-icon authentication">
          <i class="fas fa-right-to-bracket"></i>
        </div>

        <div class="audit-summary-content">
          <span>Authentication</span>
          <strong>0</strong>
          <small>Login and logout events</small>
        </div>

      </div>

    </section>-->


    <!-- =========================================
         AUDIT LOG PANEL
    ========================================== -->

    <section class="audit-log-panel">

      <!-- TOOLBAR -->

      <div class="audit-log-toolbar">

        <div class="audit-log-toolbar-left">

          <div class="audit-log-search">

            <i class="fas fa-search"></i>

            <input
              type="text"
              id="auditLogSearch"
              placeholder="Search audit logs..."
            >

          </div>

        </div>


        <div class="audit-log-filters">

          <div class="audit-filter">

            <label for="auditActionFilter">
              Action
            </label>

            <select id="auditActionFilter">

              <option value="all">
                All Actions
              </option>

              <option value="CREATE">
                Create
              </option>

              <option value="UPDATE">
                Update
              </option>

              <option value="LOGIN">
                Login
              </option>

              <option value="LOGOUT">
                Logout
              </option>

              <option value="DELETE">
                Delete
              </option>

            </select>

          </div>


          <div class="audit-filter">

            <label for="auditModuleFilter">
              Module
            </label>

            <select id="auditModuleFilter">

              <option value="all">
                All Modules
              </option>

              <option value="Violation Reports">
                Violation Reports
              </option>

              <option value="Accident Reports">
                Accident Reports
              </option>

              <option value="Authentication">
                Authentication
              </option>

            </select>

          </div>


          <button
            type="button"
            class="audit-filter-reset"
            id="resetAuditFilters"
          >
            <i class="fas fa-rotate-left"></i>
            Reset
          </button>

        </div>

      </div>


      <!-- TABLE -->

      <div class="audit-table-wrapper">

        <table class="audit-table">

          <thead>

            <tr>

              <th>
                <span>Activity</span>
              </th>

              <th>
                <span>User</span>
              </th>

              <th>
                <span>Module</span>
              </th>

              <th>
                <span>Reference</span>
              </th>

              <th>
                <span>Description</span>
              </th>

              <th>
                <span>Date & Time</span>
              </th>

              <th>
                <span>Action</span>
              </th>

            </tr>

          </thead>


          <tbody id="auditLogsTableBody"></tbody>

        </table>

      </div>


      <!-- =========================================
           TABLE FOOTER
      ========================================== -->

      <div class="audit-table-footer">

        <div class="audit-results-info">

          Showing
          <strong>5</strong>
          of
          <strong>6</strong>
          audit logs

        </div>


        <div class="audit-pagination">

          <button
            type="button"
            class="audit-page-btn disabled"
          >
            <i class="fas fa-chevron-left"></i>
          </button>

          <button
            type="button"
            class="audit-page-btn active"
          >
            1
          </button>

          <button
            type="button"
            class="audit-page-btn"
          >
            2
          </button>

          <button
            type="button"
            class="audit-page-btn"
          >
            <i class="fas fa-chevron-right"></i>
          </button>

        </div>

      </div>

    </section>

  </main>


  <?php include '../includes/admin-footer.php' ?>


  <script src="../scripts/sidebar.js"></script>

  <script type="module" src="../scripts/header.js"></script>

  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

  <script type="module" src="../scripts/audit_log_scripts/audit_logs.js"></script>

</body>
</html>