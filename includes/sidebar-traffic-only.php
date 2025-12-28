
<?php
/**
 * Traffic and Transport Management Sidebar
 * 
 */

// Get current page for active state
$currentPage = basename($_SERVER['PHP_SELF']);
?>

<!-- Sidebar Component -->
<aside class="sidebar" id="sidebar">
    <div class="sidebar-header">
        <div class="sidebar-brand">
            <div class="brand-logo">
                <img src="images/logo.svg" alt="Traffic Management System" class="logo-img">
            </div>
        </div>
    </div>
    
    <div class="sidebar-content">
        <!-- Navigation Menu -->
        <nav class="sidebar-nav">
            <!-- Traffic and Transport Management Section -->
            <div class="sidebar-section">
                <h3 class="sidebar-section-title">Traffic and Transport Management</h3>
                <ul class="sidebar-menu">
                    
                    <!-- 1. Traffic Flow Monitoring (CCTV Integration) -->
                    <li class="sidebar-menu-item">
                        <a href="traffic-monitoring.php" class="sidebar-link <?php echo $currentPage == 'traffic-monitoring.php' ? 'active' : ''; ?>">
                            <i class="fas fa-video"></i>
                            <span>Traffic Flow Monitoring</span>
                            <span class="submenu-tag">CCTV</span>
                        </a>
                    </li>
                    
                    <!-- 2. Real-Time Road Condition Updates -->
                    <li class="sidebar-menu-item">
                        <a href="road-conditions.php" class="sidebar-link <?php echo $currentPage == 'road-conditions.php' ? 'active' : ''; ?>">
                            <i class="fas fa-road"></i>
                            <span>Road Condition Updates</span>
                            <span class="submenu-tag">Real-Time</span>
                        </a>
                    </li>
                    
                    <!-- 3. Accident and Violation Reporting -->
                    <li class="sidebar-menu-item">
                        <a href="accident-reports.php" class="sidebar-link <?php echo $currentPage == 'accident-reports.php' ? 'active' : ''; ?>">
                            <i class="fas fa-car-crash"></i>
                            <span>Accident Reporting</span>
                            <span class="submenu-tag">Violations</span>
                        </a>
                    </li>
                    
                    <!-- 4. Vehicle Routing and Diversion Planning -->
                    <li class="sidebar-menu-item">
                        <a href="route-planning.php" class="sidebar-link <?php echo $currentPage == 'route-planning.php' ? 'active' : ''; ?>">
                            <i class="fas fa-route"></i>
                            <span>Vehicle Routing</span>
                            <span class="submenu-tag">Diversion</span>
                        </a>
                    </li>
                    
                    <!-- 5. Traffic Signal Control System -->
                    <li class="sidebar-menu-item">
                        <a href="signal-control.php" class="sidebar-link <?php echo $currentPage == 'signal-control.php' ? 'active' : ''; ?>">
                            <i class="fas fa-traffic-light"></i>
                            <span>Traffic Signal Control</span>
                            <span class="submenu-tag">System</span>
                        </a>
                    </li>
                    
                    <!-- 6. Public Transport Coordination -->
                    <li class="sidebar-menu-item">
                        <a href="public-transport.php" class="sidebar-link <?php echo $currentPage == 'public-transport.php' ? 'active' : ''; ?>">
                            <i class="fas fa-bus"></i>
                            <span>Public Transport</span>
                            <span class="submenu-tag">Coordination</span>
                        </a>
                    </li>
                    
                    <!-- 7. Permit and Violation Ticketing System -->
                    <li class="sidebar-menu-item">
                        <a href="violation-tickets.php" class="sidebar-link <?php echo $currentPage == 'violation-tickets.php' ? 'active' : ''; ?>">
                            <i class="fas fa-ticket-alt"></i>
                            <span>Violation Ticketing</span>
                            <span class="submenu-tag">Permits</span>
                        </a>
                    </li>
                    
                </ul>
            </div>
            
            <!-- Quick Actions Section -->
            <div class="sidebar-section">
                <h3 class="sidebar-section-title">Quick Actions</h3>
                <ul class="sidebar-menu">
                    <li class="sidebar-menu-item">
                        <a href="dashboard.php" class="sidebar-link <?php echo $currentPage == 'dashboard.php' ? 'active' : ''; ?>">
                            <i class="fas fa-tachometer-alt"></i>
                            <span>Dashboard Overview</span>
                        </a>
                    </li>
                    
                    <li class="sidebar-menu-item">
                        <a href="emergency-alert.php" class="sidebar-link">
                            <i class="fas fa-exclamation-triangle"></i>
                            <span>Emergency Alert</span>
                        </a>
                    </li>
                    
                    <li class="sidebar-menu-item">
                        <a href="system-status.php" class="sidebar-link">
                            <i class="fas fa-chart-line"></i>
                            <span>System Status</span>
                        </a>
                    </li>
                </ul>
            </div>
            
            <!-- System Section -->
            <div class="sidebar-section">
                <h3 class="sidebar-section-title">System</h3>
                <ul class="sidebar-menu">
                    <li class="sidebar-menu-item">
                        <a href="reports.php" class="sidebar-link <?php echo $currentPage == 'reports.php' ? 'active' : ''; ?>">
                            <i class="fas fa-chart-bar"></i>
                            <span>Reports & Analytics</span>
                        </a>
                    </li>
                    
                    <li class="sidebar-menu-item">
                        <a href="settings.php" class="sidebar-link <?php echo $currentPage == 'settings.php' ? 'active' : ''; ?>">
                            <i class="fas fa-cog"></i>
                            <span>System Settings</span>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    </div>
    
    <div class="sidebar-footer">
        <div class="online-status">
            <div class="status-indicator"></div>
            <div class="status-text">Traffic System Online</div>
        </div>
    </div>
</aside>

<!-- Sidebar Overlay for mobile -->
<div class="sidebar-overlay" id="sidebarOverlay"></div>

<style>
    
    .submenu-tag {
        margin-left: auto;
        background: rgba(76, 138, 137, 0.1);
        color: var(--primary-color-1);
        font-size: 0.65rem;
        padding: 0.125rem 0.375rem;
        border-radius: 4px;
        font-weight: 600;
        letter-spacing: 0.05em;
        text-transform: uppercase;
    }
    
    .sidebar-link.active .submenu-tag {
        background: rgba(255, 255, 255, 0.2);
        color: white;
    }
    
    .sidebar-section-title {
        font-style: normal;
        font-weight: 600;
        letter-spacing: 0.03em;
        margin-bottom: 1rem;
        padding: 0 1rem;
        color: var(--primary-color-1);
    }
    
    [data-theme="dark"] .sidebar-section-title {
        color: var(--text-secondary-1);
    }
    
    /* Improve spacing for the 7 modules */
    .sidebar-section:first-child .sidebar-menu {
        gap: 0.125rem;
    }
    
    .sidebar-section:first-child .sidebar-menu-item {
        margin-bottom: 0.125rem;
    }
    
    .sidebar-link {
        padding: 0.875rem 1rem;
    }
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Sidebar functionality
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    // Toggle sidebar
    function toggleSidebar() {
        sidebar.classList.toggle('sidebar-open');
        sidebarOverlay.classList.toggle('sidebar-overlay-open');
        document.body.classList.toggle('sidebar-open');
    }
    
    // Close sidebar
    function closeSidebar() {
        sidebar.classList.remove('sidebar-open');
        sidebarOverlay.classList.remove('sidebar-overlay-open');
        document.body.classList.remove('sidebar-open');
    }

    // Expose functions globally
    window.sidebarToggle = toggleSidebar;
    window.sidebarClose = closeSidebar;
    
    // Close sidebar when clicking overlay
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }
    
    // Close sidebar on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('sidebar-open')) {
            closeSidebar();
        }
    });
    
    // Add click animation to sidebar links
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            sidebarLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
            
            // If on mobile, close sidebar after clicking
            if (window.innerWidth < 1024) {
                setTimeout(closeSidebar, 300);
            }
        });
    });
    
    // Update online status indicator
    function updateOnlineStatus() {
        const statusIndicator = document.querySelector('.status-indicator');
        const statusText = document.querySelector('.status-text');
        
        // Simulate connection check
        const isOnline = navigator.onLine;
        
        if (isOnline) {
            statusIndicator.style.backgroundColor = '#10b981';
            statusText.textContent = 'System Online';
        } else {
            statusIndicator.style.backgroundColor = '#ef4444';
            statusText.textContent = 'System Offline';
        }
    }
    
    // Check online status on load and when connection changes
    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Add subtle animation to status indicator
    const statusIndicator = document.querySelector('.status-indicator');
    if (statusIndicator) {
        statusIndicator.style.animation = 'pulse 2s infinite';
    }
});
</script>