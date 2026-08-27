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
  <link rel="stylesheet" href="../styles/ticket/tickets.css">
  <link rel="stylesheet" href="../styles/ticket/create_ticket.css">
  <link rel="stylesheet" href="../styles/sidebar-footer.css">
  <title>Ticketing System</title>
</head>
<body>

  <main class="app">
    <?php include '../includes/official_sidebar.php'; ?>
    <?php include '../includes/accident_header.php' ?>

    <section class="ticket-container">
      <div class="ticket-page-header">

        <div class="header-titles">

          <div class="ticket-title-row">

            <div class="ticket-title-icon">
              <i class="fas fa-ticket"></i>
            </div>

            <div>
              <h2>Ticket Management</h2>

              <p>
                Review, monitor, and manage traffic violation tickets
              </p>
            </div>

          </div>

        </div>


        <div class="header-actions">
          <button
            type="button"
            class="btn-create-ticket"
            id="createTicketBtn"
          >
            <i class="fas fa-plus"></i>
            Create Ticket
          </button>
        </div>
      </div>

      <!--<div class="ticket-stats-grid">

        <div class="ticket-stat-card">

          <div class="ticket-stat-icon total">
            <i class="fas fa-ticket"></i>
          </div>

          <div class="ticket-stat-content">

            <span class="ticket-stat-label">
              Total Tickets
            </span>

            <strong class="ticket-stat-value">
              128
            </strong>

            <span class="ticket-stat-description">
              All recorded tickets
            </span>

          </div>

        </div>

        <div class="ticket-stat-card">

          <div class="ticket-stat-icon pending">
            <i class="fas fa-clock"></i>
          </div>

          <div class="ticket-stat-content">

            <span class="ticket-stat-label">
              Pending
            </span>

            <strong class="ticket-stat-value">
              42
            </strong>

            <span class="ticket-stat-description">
              Awaiting settlement
            </span>

          </div>

        </div>

        <div class="ticket-stat-card">

          <div class="ticket-stat-icon resolved">
            <i class="fas fa-circle-check"></i>
          </div>

          <div class="ticket-stat-content">

            <span class="ticket-stat-label">
              Resolved
            </span>

            <strong class="ticket-stat-value">
              76
            </strong>

            <span class="ticket-stat-description">
              Paid or settled
            </span>

          </div>

        </div>

        <div class="ticket-stat-card">

          <div class="ticket-stat-icon overdue">
            <i class="fas fa-triangle-exclamation"></i>
          </div>

          <div class="ticket-stat-content">

            <span class="ticket-stat-label">
              Overdue
            </span>

            <strong class="ticket-stat-value">
              10
            </strong>

            <span class="ticket-stat-description">
              Requires attention
            </span>

          </div>

        </div>

      </div>-->

      <div class="tickets-panel" id="ticketPanelContainer"></div>

      <div class="create-ticket-overlay create-ticket-hidden"></div>
    </section>

    <?php include '../includes/admin-footer.php'; ?>
  </main>
  
  <script src="../scripts/sidebar.js"></script>
  <script src="../scripts/header.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <script type="module" src="../scripts/tickets/tickets.js"></script>
</body>
</html>