<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$userName = $_SESSION['full_name'] ?? 'Unknown user';
$userRole = $_SESSION['role'] ?? 'User';
$userEmail = $_SESSION['email'] ?? '';

?>

<header class="road-ud-header">
  <div class="road-ud-title-container">

    <div class="header-left-section">
      <button class="hamburger-menu-btn">
        <i class="fas fa-bars"></i>
      </button>

      <p class="current-time" id="liveClock">
        12:00:00 PM
      </p>
    </div>


    <div class="header-right-section">

      <div class="notification-container">

        <div class="notif-bell" title="Notifications">
          <i class="fas fa-bell"></i>
        </div>

        <div class="email-notif" title="Messages">
          <i class="fas fa-message"></i>
        </div>

      </div>


      <div class="user-profile-wrapper">

        <button
          type="button"
          class="user-profile"
          id="userProfileBtn"
        >

          <div class="user-info">

            <div class="user-name">
              <?= htmlspecialchars($userName) ?>
            </div>

            <div class="user-role">
              <?= htmlspecialchars($userRole) ?>
            </div>

          </div>


          <div class="user-avatar">

            <div class="avatar-img">
              <i class="fas fa-user"></i>
            </div>

          </div>


          <i class="fas fa-chevron-down dropdown-icon"></i>

        </button>


        <div
          class="user-dropdown"
          id="userDropdown"
        >

          <div class="user-dropdown-header">

            <strong>
              <?= htmlspecialchars($userName) ?>
            </strong>

            <span>
              <?= htmlspecialchars($userEmail) ?>
            </span>

          </div>


          <div class="user-dropdown-divider"></div>


          <a
            href="#"
            class="user-dropdown-item"
          >
            <i class="fas fa-user"></i>
            <span>Profile</span>
          </a>


          <a
            href="../logout.php"
            class="user-dropdown-item logout-item"
          >
            <i class="fas fa-right-from-bracket"></i>
            <span>Logout</span>
          </a>

        </div>

      </div>

    </div>

  </div>
</header>

<script>
document.addEventListener('DOMContentLoaded', function() {
    function updateClock() {
        const now = new Date();
        
        // Convert to Philippines time (UTC+8)
        const philippinesTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Manila' }));
        
        let hours = philippinesTime.getHours();
        const minutes = String(philippinesTime.getMinutes()).padStart(2, '0');
        const seconds = String(philippinesTime.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12 || 12; // Convert to 12-hour format
        const timeString = `${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
        
        document.getElementById('liveClock').textContent = timeString;
    }
    
    // Update immediately
    updateClock();
    
    // Update every second
    setInterval(updateClock, 1000);
});
</script>