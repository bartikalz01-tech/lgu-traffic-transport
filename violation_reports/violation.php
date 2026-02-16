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
  <link rel="stylesheet" href="../styles//violations/violation.css">
  <title>Violations and Ticketing</title>
</head>

<body>
  <main class="app">
    <?php include '../includes/official_sidebar.php'; ?>

    <?php include '../includes/accident_header.php' ?>

    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
      <div class="module-title-container">
        <p class="module-title">Violation and Ticketing System</p>
        <h1 class="sub-module-title">Violation Reports</h1>
        <p class="sub-module-description">Report violations and record their tickets</p>
      </div>
      <!--<button class="btn btn-primary" id="quickReportsBtn" style="margin-top: var(--header-h); margin-right: 20px;">
        <i class="fas fa-plus"></i> Quick Reports
      </button>-->
    </div>

    <section class="violation-system">
      <div class="violation-content">
        <div class="quick-actions-panel">
          <div class="quick-action-card">
            <h4><i class="fas fa-bolt"></i> Quick Actions</h4>
            <div class="action-buttons">
              <button class="btn btn-primary action-btn" id="quickIssueBtn">
                <i class="fas fa-ticket-alt"></i> Issue Violation Reports
              </button>
              <button class="btn btn-secondary action-btn" id="barangayReportsBtn">
                <i class="fas fa-money-bill"></i> Barangay Reports
              </button>
              <button class="btn btn-secondary action-btn" id="escalatedReportsBtn">
                <i class="fas fa-chart-bar"></i> Escalated Reports <!-- To create violatios based on barangay ordinance -->
              </button>
              <!--<button class="btn btn-secondary action-btn" id="sendRemindersBtn">
                <i class="fas fa-user-group"></i> Dispatch Officers
              </button>-->
            </div>
          </div>

          <div class="quick-action-card">
            <h4><i class="fas fa-chart-pie"></i> Today's Statistics</h4>
            <div class="statistics-grid">
              <div class="stat-item">
                <div class="stat-value">23</div>
                <div class="stat-label">New Violations</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">18</div>
                <div class="stat-label">Tickets Issued</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">15</div>
                <div class="stat-label">Payments Processed</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">₱12,350</div>
                <div class="stat-label">Total Collected</div>
              </div>
            </div>
          </div>

          <div class="quick-action-card">
            <h4><i class="fas fa-exclamation-circle"></i> Barangay Violations</h4>
            <div style="margin-top: 1rem;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>Obstruction of Roads</span>
                <span class="stat-value">45</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>Illegal Parking</span>
                <span class="stat-value">38</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>Route Violations</span>
                <span class="stat-value">32</span>
              </div>
              <!--<div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>Red Light</span>
                <span class="stat-value">24</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>No License</span>
                <span class="stat-value">18</span>
              </div>-->
            </div>
          </div>
        </div>

        <div class="violation-list-panel">
          <div class="panel-header">
            <h3><i class="fas fa-list"></i> Recent Violations</h3>
            <div class="panel-controls">
              <select class="filter-select" id="violationFilter">
                <option value="all">All Violations</option>
                <option value="pending">Pending</option>
                <option value="issued">Issued</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
              <div class="search-box">
                <i class="fas fa-search"></i>
                <input type="text" id="searchViolations" placeholder="Search violations...">
              </div>
            </div>
          </div>

          <div class="violations-container">
            <!--<div class="violations-table-wrapper">
              <table class="violations-table">
                <thead>
                  <tr>
                    <th>Violation ID</th>
                    <th>Vehicle</th>
                    <th>Person</th>
                    <th>Violation Type</th>
                    <th>Fine Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="violationsTableBody">
                  
                  <tr>
                    <td>VIO-20240115-001</td>
                    <td>ABC-1234 (Toyota)</td>
                    <td>Juan Dela Cruz</td>
                    <td>Speeding</td>
                    <td>₱1,500</td>
                    <td>2024-01-15 10:30</td>
                    <td><span class="violation-status status-paid">Paid</span></td>
                    <td>
                      <div class="table-actions">
                        <button class="btn btn-success" title="View Details">
                          View Details
                        </button>
                        <button class="btn btn-info" title="Print Receipt">
                          Print Receipt
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>VIO-20240114-002</td>
                    <td>XYZ-5678 (Motorcycle)</td>
                    <td>Maria Santos</td>
                    <td>No Helmet</td>
                    <td>₱750</td>
                    <td>2024-01-14 14:15</td>
                    <td><span class="violation-status status-issued">Issued</span></td>
                    <td>
                      <div class="table-actions">
                        <button class="btn btn-success" title="View Details">
                          View Details
                        </button>
                        <button class="btn btn-info" title="Print Receipt">
                          Print Receipt
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>VIO-20240113-003</td>
                    <td>DEF-9012 (Van)</td>
                    <td>Pedro Reyes</td>
                    <td>Illegal Parking</td>
                    <td>₱1,000</td>
                    <td>2024-01-13 09:45</td>
                    <td><span class="violation-status status-overdue">Overdue</span></td>
                    <td>
                      <div class="table-actions">
                        <button class="btn btn-success" title="View Details">
                          View Details
                        </button>
                        <button class="btn btn-info" title="Print Receipt">
                          Print Receipt
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>VIO-20240112-004</td>
                    <td>GHI-3456 (Sedan)</td>
                    <td>Ana Torres</td>
                    <td>Red Light</td>
                    <td>₱2,000</td>
                    <td>2024-01-12 16:20</td>
                    <td><span class="violation-status status-pending">Pending</span></td>
                    <td>
                      <div class="table-actions">
                        <button class="btn btn-success" title="View Details">
                          View Details
                        </button>
                        <button class="btn btn-info" title="Print Receipt">
                          Print Receipt
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>VIO-20240111-005</td>
                    <td>JKL-7890 (Truck)</td>
                    <td>Carlos Gomez</td>
                    <td>Overloading</td>
                    <td>₱3,500</td>
                    <td>2024-01-11 11:10</td>
                    <td><span class="violation-status status-paid">Paid</span></td>
                    <td>
                      <div class="table-actions">
                        <button class="btn btn-success" title="View Details">
                          View Details
                        </button>
                        <button class="btn btn-info" title="Print Receipt">
                          Print Receipt
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>-->
            <div class="list-body" id="violationList">
              <div class="violation-item active">
                <div class="violation-header">
                  <span class="violation-id">VIOLATION-20240115-001</span>
                  <span class="violation-time">Today, 10:15 AM</span>
                </div>
                <div class="violation-details">
                  <h4>Vehicle Collision at Road 123</h4>
                  <div class="violation-meta">
                    <span><i class="fas fa-road"></i> Road 123</span>
                    <span><i class="fas fa-users"></i> 3 People</span>
                    <span><i class="fas fa-car"></i> 2 Vehicles</span>
                  </div>
                  <div class="status-and-action">
                    <span class="status-badge status-investigation">Under Investigation</span>
                    <div class="all-about-ticket-buttons">
                      <button class="btn btn-info js-modify-report" data-accident-id="">Modfiy Report</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="pagination">
              <button class="page-btn">
                <i class="fas fa-chevron-left"></i>
              </button>
              <button class="page-btn active">1</button>
              <button class="page-btn">2</button>
              <button class="page-btn">3</button>
              <span class="page-info">of 12</span>
              <button class="page-btn">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <?php include '../includes/admin-footer.php'; ?>
  </main>

  <script type="module" src="../scripts/violation/violation.js"></script>
</body>

</html>