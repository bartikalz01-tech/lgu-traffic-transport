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
      <div class="accident-summary-grid">
        <div class="accident-summary-card">
          <div class="accident-summary-icon">
            <i class="fas fa-car-crash"></i>
          </div>

          <div class="accident-summary-info">
            <span>Total Accidents</span>
            <strong>24</strong>
            <small>All recorded cases</small>
          </div>
        </div>

        <div class="accident-summary-card">
          <div class="accident-summary-icon active">
            <i class="fas fa-folder-open"></i>
          </div>

          <div class="accident-summary-info">
            <span>Active Cases</span>
            <strong>7</strong>
            <small>Cases requiring attention</small>
          </div>
        </div>

        <div class="accident-summary-card">
          <div class="accident-summary-icon resolved">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="accident-summary-info">
            <span>Resolved Cases</span>
            <strong>17</strong>
            <small>Successfully resolved</small>
          </div>
        </div>
      </div>

      <div class="accident-reports-panel">
        <div class="accident-panel-header">
          <div>
            <h2>Accident Reports</h2>
            <p>Monitor and manage reported traffic accidents.</p>
          </div>

          <button class="accident-refresh-btn">
            <i class="fas fa-sync-alt"></i>
            Refresh
          </button>
        </div>

        <div class="accident-toolbar">
          <div class="accident-search-box">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Search accident ID, road, or location...">
          </div>

          <select class="accident-filter">
            <option>All statuses</option>
            <option value="">Reported</option>
            <option value="">Investigating</option>
            <option value="">Resolved</option>
          </select>

          <select class="accident-filter">
            <option value="">All Accident Types</option>
            <option value="">Vehicle Collision</option>
            <option value="">Road Obstruction</option>
            <option value="">Hit and Run</option>
            <option value="">Other</option>
          </select>

          <button class="accident-filter-btn">
            <i class=fas fa-filter></i>
            Filter
          </button>

        </div>

      </div>

      <div class="accident-table-wrapper">
        <table class="accident-table">
          <thead>
            <th>Public Accident ID</th>
            <th>Road / Street</th>
            <th>Date & Time</th>
            <th>Accident Type</th>
            <th>Location</th>
            <th>Status</th>
            <th>Action</th>
          </thead>

          <tbody>
            <tr>
              <td>
                <span class="accident-public-id">ACC-20260809-0001</span>
              </td>
              <td>
                <div class="road-cell">
                  <i class="fas fa-road"></i>
                  <span>Susano Road</span>
                </div>
              </td>
              <td>
                <div class="date-cell">
                  <strong>Aug 09, 2026</strong>
                  <small>08:42 AM</small>
                </div>
              </td>
              <td>Vehicle Collision</td>
              <td>Susano Road Intersection</td>
              <td>
                <span class="accident-status reported">Reported</span>
              </td>
              <td>
                <button class="accident-view-btn">
                  <i class="fas fa-eye"></i>
                  View
                </button>
              </td>
            </tr>

            <tr>
              <td>
                <span class="accident-public-id">ACC-20260808-0009</span>
              </td>
              <td>
                <div class="road-cell">
                  <i class="fas fa-road"></i>
                  <span>Quirino Highway</span>
                </div>
              </td>
              <td>
                <div class="date-cell">
                  <strong>Aug 08, 2026</strong>
                  <small>06:17 PM</small>
                </div>
              </td>
              <td>Hit and Run</td>
              <td>Near Barangay Hall</td>
              <td>
                <span class="accident-status investigating">Investigating</span>
              </td>
              <td>
                <button class="accident-view-btn">
                  <i class="fas fa-eye"></i>
                  View
                </button>
              </td>
            </tr>

            <tr>
              <td>
                <span class="accident-public-id">ACC-20260807-0007</span>
              </td>
              <td>
                <div class="road-cell">
                  <i class="fas fa-road"></i>
                  <span>Novaliches Road</span>
                </div>
              </td>
              <td>
                <div class="date-cell">
                  <strong>Aug 07, 2026</strong>
                  <small>11:23 AM</small>
                </div>
              </td>
              <td>Vehicle Collision</td>
              <td>Near Market Area</td>
              <td>
                <span class="accident-status resolved">Resolved</span>
              </td>
              <td>
                <button class="accident-view-btn">
                  <i class="fas fa-eye"></i>
                  View
                </button>
              </td>
            </tr>

            <tr>
              <td>
                <span class="accident-public-id">ACC-20260806-0004</span>
              </td>
              <td>
                <div class="road-cell">
                  <i class="fas fa-road"></i>
                  <span>Bagbag Road</span>
                </div>
              </td>
              <td>
                <div class="date-cell">
                  <strong>Aug 06, 2026</strong>
                  <small>09:05 PM</small>
                </div>
              </td>
              <td>Road Obstruction</td>
              <td>Bagbag Road Junction</td>
              <td>
                <span class="accident-status reported">Reported</span>
              </td>
              <td>
                <button class="accident-view-btn">
                  <i class="fas fa-eye"></i>
                  View
                </button>
              </td>
            </tr>

            <tr>
              <td>
                <span class="accident-public-id">ACC-20260805-0002</span>
              </td>
              <td>
                <div class="road-cell">
                  <i class="fas fa-road"></i>
                  <span>General Luis Road</span>
                </div>
              </td>
              <td>
                <div class="date-cell">
                  <strong>Aug 05, 2026</strong>
                  <small>03:36 PM</small>
                </div>
              </td>
              <td>Vehicle Collision</td>
              <td>Near School Zone</td>
              <td>
                <span class="accident-status resolved">Resolved</span>
              </td>
              <td>
                <button class="accident-view-btn">
                  <i class="fas fa-eye"></i>
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="accident-table-footer">
        <span>
          Showing <strong>1-5</strong> of <strong>24</strong> accident reports
        </span>

        <div class="accident-pagination">
          <button disabled>
            <i class="fas fa-chevron-left"></i>
          </button>

          <button class="active">1</button>
          <button>2</button>
          <button>3</button>
          <button>4</button>
          <button>5</button>

          <button>
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </section>

    <?php include '../includes/admin-footer.php'; ?>
  </main>

  <script src="../scripts/sidebar.js"></script>
  <script type="module" src="../scripts/accident/accident_test.js" defer></script>
</body>

</html>