<?php
/**
 * CCTV Traffic Monitoring - Detailed View
 * Enhanced with predictive AI and multiple camera support
 */

$pageTitle = 'CCTV Traffic Monitoring - 127 Street';
$currentCamera = isset($_GET['camera']) ? $_GET['camera'] : 'cam1';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($pageTitle); ?> - Barangay Traffic System</title>
    <link rel="icon" type="image/x-icon" href="images/favicon.ico">
    <link rel="stylesheet" href="styles/global1.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="styles/sidebar1.css">
    <link rel="stylesheet" href="styles/admin/admin-header.css">
    <link rel="stylesheet" href="styles/buttons.css">
    <link rel="stylesheet" href="styles/cards.css">
    <link rel="stylesheet" href="styles/forms.css">
    <link rel="stylesheet" href="styles/content.css">
    <link rel="stylesheet" href="styles/hero.css">
    <link rel="stylesheet" href="styles/sidebar-footer.css">
    <link rel="stylesheet" href="styles/admin/cctv.css">
</head>
<body>
    <!-- Include Sidebar Component -->
    <?php include 'includes/sidebar-traffic-only.php'; ?>

    <!-- Include Admin Header Component -->
    <?php include 'includes/admin-header.php'; ?>
    
    <!-- Main Content -->
    <div class="main-content">
        <div class="main-container">
            <!-- Breadcrumb Navigation -->
            <div class="title">
                <nav class="breadcrumb" aria-label="Breadcrumb">
                    <ol class="breadcrumb-list">
                        <li class="breadcrumb-item">
                            <a href="/" class="breadcrumb-link">
                                <i class="fas fa-home"></i>
                                <span>Home</span>
                            </a>
                        </li>
                        <li class="breadcrumb-item">
                            <a href="traffic-monitoring.php" class="breadcrumb-link">
                                <i class="fas fa-video"></i>
                                <span>Traffic Monitoring</span>
                            </a>
                        </li>
                        <li class="breadcrumb-item active" aria-current="page">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>127 Street - CCTV Monitoring</span>
                        </li>
                    </ol>
                </nav>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <div>
                        <h1>CCTV Traffic Monitoring System</h1>
                        <p>Real-time surveillance and predictive analytics for 127 Street intersection</p>
                    </div>
                    <div>
                        <button class="btn btn-primary" id="fullscreenBtn">
                            <i class="fas fa-expand"></i> Full Screen
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- CCTV Monitoring Dashboard -->
            <div class="cctv-dashboard">
                <div class="cctv-grid">
                    <!-- Main CCTV Feed -->
                    <div class="cctv-video-container">
                        <div class="cctv-video-header">
                            <h3>
                                <i class="fas fa-video"></i>
                                <span id="currentCameraName">Camera 1 - Main Intersection View</span>
                            </h3>
                            <div class="live-status">
                                <i class="fas fa-circle"></i>
                                <span>LIVE FEED</span>
                            </div>
                        </div>
                        
                        <div class="cctv-video-display" id="cctvVideoDisplay">
                            <!-- Video Feed Placeholder -->
                            <div class="video-placeholder">
                                <i class="fas fa-video"></i>
                                <p>Live CCTV Feed - 127 Street Intersection</p>
                                <p style="font-size: 0.875rem; margin-top: 0.5rem; color: rgba(255, 255, 255, 0.5);">
                                    Resolution: 1080p | FPS: 30 | Status: Streaming
                                </p>
                            </div>
                        </div>
                        
                        <div class="video-controls">
                            <div class="control-buttons">
                                <button class="btn btn-warning btn-sm" id="recordBtn">
                                    <i class="fas fa-record-vinyl"></i>
                                    <span>Record</span>
                                </button>
                                <button class="btn btn-primary btn-sm" id="snapshotBtn">
                                    <i class="fas fa-camera"></i>
                                    <span>Snapshot</span>
                                </button>
                                <button class="btn btn-secondary btn-sm" id="zoomInBtn">
                                    <i class="fas fa-search-plus"></i>
                                </button>
                                <button class="btn btn-secondary btn-sm" id="zoomOutBtn">
                                    <i class="fas fa-search-minus"></i>
                                </button>
                                <button class="btn btn-secondary btn-sm" id="rotateBtn">
                                    <i class="fas fa-sync"></i>
                                </button>
                            </div>
                            <div class="time-display" id="currentTime">
                                <?php echo date('Y-m-d H:i:s'); ?>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Sidebar - Camera Information and Controls -->
                    <div class="camera-info-sidebar">
                        <!-- Camera Details Card -->
                        <div class="camera-details-card">
                            <h4><i class="fas fa-info-circle"></i> Camera Details</h4>
                            <div class="details-grid">
                                <div class="detail-item">
                                    <span class="detail-label">Camera ID</span>
                                    <span class="detail-value">CAM-127-001</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Location</span>
                                    <span class="detail-value">127 Street Intersection</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Type</span>
                                    <span class="detail-value">Pan-Tilt-Zoom</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Resolution</span>
                                    <span class="detail-value">1080p @ 30fps</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Field of View</span>
                                    <span class="detail-value">120° Wide Angle</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Installation Date</span>
                                    <span class="detail-value">2024-01-15</span>
                                </div>
                            </div>
                            <div class="camera-status">
                                <span class="status-indicator status-online"></span>
                                <span class="detail-value">Online - Connected to Network</span>
                            </div>
                        </div>
                        
                        <!-- Predictive AI Card -->
                        <div class="predictive-ai-card">
                            <h4><i class="fas fa-brain"></i> Predictive AI Analysis</h4>
                            <div class="ai-predictions">
                                <div class="prediction-item traffic">
                                    <span class="prediction-label">Traffic Congestion Risk</span>
                                    <span class="prediction-value medium">Medium (65%)</span>
                                </div>
                                <div class="prediction-item accident">
                                    <span class="prediction-label">Accident Probability</span>
                                    <span class="prediction-value low">Low (15%)</span>
                                </div>
                                <div class="prediction-item congestion">
                                    <span class="prediction-label">Peak Hour Prediction</span>
                                    <span class="prediction-value high">17:30 - 19:00</span>
                                </div>
                            </div>
                            <div style="margin-top: 1rem; font-size: 0.75rem; color: var(--text-secondary-1);">
                                <i class="fas fa-info-circle"></i>
                                <span>Updated every 5 minutes based on traffic patterns</span>
                            </div>
                        </div>
                        
                        <!-- Camera List Card -->
                        <div class="camera-list-card">
                            <h4><i class="fas fa-list"></i> Available Cameras</h4>
                            <div class="camera-list">
                                <div class="camera-list-item active" data-camera="cam1">
                                    <div class="camera-icon">
                                        <i class="fas fa-video"></i>
                                    </div>
                                    <div class="camera-info">
                                        <div class="camera-name">Camera 1 - Main View</div>
                                        <div class="camera-location">127 Street Intersection</div>
                                    </div>
                                    <span class="live-status" style="font-size: 0.625rem;">LIVE</span>
                                </div>
                                <div class="camera-list-item" data-camera="cam2">
                                    <div class="camera-icon">
                                        <i class="fas fa-video"></i>
                                    </div>
                                    <div class="camera-info">
                                        <div class="camera-name">Camera 2 - North View</div>
                                        <div class="camera-location">127 Street North End</div>
                                    </div>
                                </div>
                                <div class="camera-list-item" data-camera="cam3">
                                    <div class="camera-icon">
                                        <i class="fas fa-video"></i>
                                    </div>
                                    <div class="camera-info">
                                        <div class="camera-name">Camera 3 - South View</div>
                                        <div class="camera-location">127 Street South End</div>
                                    </div>
                                </div>
                                <div class="camera-list-item" data-camera="cam4">
                                    <div class="camera-icon">
                                        <i class="fas fa-video"></i>
                                    </div>
                                    <div class="camera-info">
                                        <div class="camera-name">Camera 4 - Pedestrian</div>
                                        <div class="camera-location">Crosswalk Area</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Traffic Statistics -->
                        <div class="camera-details-card">
                            <h4><i class="fas fa-chart-line"></i> Real-time Statistics</h4>
                            <div class="traffic-stats">
                                <div class="stat-card">
                                    <div class="stat-value">142</div>
                                    <div class="stat-label">Vehicles/min</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-value">23</div>
                                    <div class="stat-label">Pedestrians</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-value">65%</div>
                                    <div class="stat-label">Lane Usage</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-value">42s</div>
                                    <div class="stat-label">Avg Wait Time</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Include Admin Footer Component -->
        <?php include 'includes/admin-footer.php'; ?>
    </div>
    
    <!-- Full Screen Modal -->
    <div class="fullscreen-modal" id="fullscreenModal">
        <div class="fullscreen-video">
            <div class="video-placeholder">
                <i class="fas fa-video" style="font-size: 5rem;"></i>
                <p style="font-size: 1.5rem;">Full Screen CCTV View</p>
                <p>127 Street Intersection - Live Feed</p>
            </div>
            <button class="close-fullscreen" id="closeFullscreen">
                <i class="fas fa-times"></i>
            </button>
            <div class="fullscreen-controls">
                <button class="btn btn-warning">
                    <i class="fas fa-record-vinyl"></i>
                </button>
                <button class="btn btn-primary">
                    <i class="fas fa-camera"></i>
                </button>
                <button class="btn btn-secondary">
                    <i class="fas fa-volume-up"></i>
                </button>
            </div>
        </div>
    </div>

    <script>
    document.addEventListener('DOMContentLoaded', function() {
        // Current time display update
        function updateCurrentTime() {
            const now = new Date();
            const timeString = now.toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
            document.getElementById('currentTime').textContent = timeString;
        }
        
        // Update time every second
        setInterval(updateCurrentTime, 1000);
        updateCurrentTime();
        
        // Camera switching functionality
        const cameraItems = document.querySelectorAll('.camera-list-item');
        const currentCameraName = document.getElementById('currentCameraName');
        
        cameraItems.forEach(item => {
            item.addEventListener('click', function() {
                // Remove active class from all items
                cameraItems.forEach(cam => cam.classList.remove('active'));
                
                // Add active class to clicked item
                this.classList.add('active');
                
                // Update camera name
                const cameraName = this.querySelector('.camera-name').textContent;
                currentCameraName.textContent = cameraName;
                
                // Simulate camera switch with a loading effect
                const videoDisplay = document.getElementById('cctvVideoDisplay');
                videoDisplay.innerHTML = `
                    <div class="video-placeholder">
                        <i class="fas fa-sync fa-spin"></i>
                        <p>Switching to ${cameraName}</p>
                        <p style="font-size: 0.875rem; margin-top: 0.5rem; color: rgba(255, 255, 255, 0.5);">
                            Connecting to camera feed...
                        </p>
                    </div>
                `;
                
                // Simulate loading delay
                setTimeout(() => {
                    videoDisplay.innerHTML = `
                        <div class="video-placeholder">
                            <i class="fas fa-video"></i>
                            <p>Live CCTV Feed - ${cameraName}</p>
                            <p style="font-size: 0.875rem; margin-top: 0.5rem; color: rgba(255, 255, 255, 0.5);">
                                Resolution: 1080p | FPS: 30 | Status: Streaming
                            </p>
                        </div>
                    `;
                    showNotification(`Switched to ${cameraName}`, 'success');
                }, 1500);
            });
        });
        
        // Record button functionality
        const recordBtn = document.getElementById('recordBtn');
        let isRecording = false;
        
        recordBtn.addEventListener('click', function() {
            isRecording = !isRecording;
            
            if (isRecording) {
                this.innerHTML = '<i class="fas fa-stop-circle"></i><span>Stop Recording</span>';
                this.classList.remove('btn-warning');
                this.classList.add('btn-danger');
                showNotification('Recording started - Footage will be saved to archive', 'info');
            } else {
                this.innerHTML = '<i class="fas fa-record-vinyl"></i><span>Record</span>';
                this.classList.remove('btn-danger');
                this.classList.add('btn-warning');
                showNotification('Recording stopped - Footage saved successfully', 'success');
            }
        });
        
        // Snapshot button functionality
        const snapshotBtn = document.getElementById('snapshotBtn');
        
        snapshotBtn.addEventListener('click', function() {
            // Show loading state
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Capturing...</span>';
            this.disabled = true;
            
            // Simulate snapshot capture
            setTimeout(() => {
                this.innerHTML = originalHTML;
                this.disabled = false;
                showNotification('Snapshot captured and saved to gallery', 'success');
            }, 1000);
        });
        
        // Fullscreen functionality
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        const fullscreenModal = document.getElementById('fullscreenModal');
        const closeFullscreen = document.getElementById('closeFullscreen');
        
        fullscreenBtn.addEventListener('click', function() {
            fullscreenModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        closeFullscreen.addEventListener('click', function() {
            fullscreenModal.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Close fullscreen on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && fullscreenModal.classList.contains('active')) {
                fullscreenModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Zoom and rotate controls
        const zoomInBtn = document.getElementById('zoomInBtn');
        const zoomOutBtn = document.getElementById('zoomOutBtn');
        const rotateBtn = document.getElementById('rotateBtn');
        
        zoomInBtn.addEventListener('click', function() {
            showNotification('Zooming in...', 'info');
        });
        
        zoomOutBtn.addEventListener('click', function() {
            showNotification('Zooming out...', 'info');
        });
        
        rotateBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const currentClass = icon.className;
            
            // Rotate through different rotation icons
            if (currentClass.includes('fa-sync')) {
                icon.className = 'fas fa-undo';
                showNotification('Camera rotating 90° clockwise', 'info');
            } else if (currentClass.includes('fa-undo')) {
                icon.className = 'fas fa-redo';
                showNotification('Camera rotating 180°', 'info');
            } else {
                icon.className = 'fas fa-sync';
                showNotification('Camera reset to default position', 'info');
            }
        });
        
        // Notification system
        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : 'var(--primary-color-1)'};
                color: white;
                padding: 12px 16px;
                border-radius: 8px;
                z-index: 1000;
                font-size: 0.875rem;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                display: flex;
                align-items: center;
                gap: 8px;
                animation: slideIn 0.3s ease-out;
            `;
            
            const icon = type === 'success' ? 'check-circle' : 
                        type === 'error' ? 'exclamation-circle' :
                        type === 'warning' ? 'exclamation-triangle' : 'info-circle';
            
            notification.innerHTML = `
                <i class="fas fa-${icon}"></i>
                <span>${message}</span>
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
            
            // Add CSS for animations if not already present
            if (!document.getElementById('notification-animations')) {
                const style = document.createElement('style');
                style.id = 'notification-animations';
                style.textContent = `
                    @keyframes slideIn {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    @keyframes slideOut {
                        from { transform: translateX(0); opacity: 1; }
                        to { transform: translateX(100%); opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }
        }
        
        // Simulate periodic AI updates
        setInterval(() => {
            // Randomly update predictive values
            const predictions = document.querySelectorAll('.prediction-value');
            predictions.forEach(pred => {
                if (pred.classList.contains('medium')) {
                    const randomValue = 60 + Math.floor(Math.random() * 10);
                    pred.textContent = `Medium (${randomValue}%)`;
                } else if (pred.classList.contains('low')) {
                    const randomValue = 10 + Math.floor(Math.random() * 10);
                    pred.textContent = `Low (${randomValue}%)`;
                }
            });
            
            // Update traffic stats
            const stats = document.querySelectorAll('.stat-value');
            stats.forEach(stat => {
                const current = parseInt(stat.textContent);
                if (stat.parentElement.querySelector('.stat-label').textContent === 'Vehicles/min') {
                    const variation = Math.floor(Math.random() * 20) - 10;
                    const newValue = Math.max(50, current + variation);
                    stat.textContent = newValue;
                }
            });
        }, 30000); // Update every 30 seconds
    });
    </script>
</body>
</html>