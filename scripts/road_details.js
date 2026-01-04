import { roadOverlay } from './road_variables.js';


export function openRoadCondition(roadName) {
  roadOverlay.innerHTML = `
    <div class="road-condition-content">

    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
      <div class="module-title-container">
        <!--<button class="close-btn">
          <img class="left-arrow-logo" src="../images/arrow_to_left_fill.svg">
        </button>-->
        <p class="module-title">Real Time Road Condition Updates</p>
        <h1 class="sub-module-title">CCTV Monitoring</h1>
        <p class="sub-module-description">Real-time surveillance and predictive analytics of ${roadName}</p>
      </div>
      <button class="btn btn-primary" id="fullscreenBtn">
        <i class="fas fa-expand"></i> Full Screen
      </button>
    </div>

    <div class="cctv-dashboard">
      <div class="cctv-details-grid">

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

          <div class="cctv-video-display">
            <i class="fas fa-video"></i>
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
              01/02/2026 12:00
            </div>
          </div>
        </div>

        <div class="camera-info-sidebar">
          <!-- Camera Details Card -->
          <div class="camera-details-card">
            <h4><i class="fas fa-info-circle"></i> Camera Details</h4>
            <div class="details-grid">
              <div class="detail-item">
                <span class="detail-label">Camera ID</span>
                <span class="detail-value">CAM-${roadName}-001</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Location</span>
                <span class="detail-value">${roadName} Street Intersection</span>
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
                  <div class="camera-location">${roadName} Street Intersection</div>
                </div>
                <span class="live-status" style="font-size: 0.625rem;">LIVE</span>
              </div>
              <div class="camera-list-item" data-camera="cam2">
                <div class="camera-icon">
                  <i class="fas fa-video"></i>
                </div>
                <div class="camera-info">
                  <div class="camera-name">Camera 2 - North View</div>
                  <div class="camera-location">${roadName} Street North End</div>
                </div>
              </div>
              <div class="camera-list-item" data-camera="cam3">
                <div class="camera-icon">
                  <i class="fas fa-video"></i>
                </div>
                <div class="camera-info">
                  <div class="camera-name">Camera 3 - South View</div>
                  <div class="camera-location">${roadName} Street South End</div>
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

  <div class="fullscreen-modal" id="fullscreenModal">
    <div class="fullscreen-video">
      <div class="video-placeholder">
        <i class="fas fa-video" style="font-size: 5rem;"></i>
        <p style="font-size: 1.5rem;">Full Screen CCTV View</p>
        <p>${roadName} Street Intersection - Live Feed</p>
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
  `;

  roadOverlay.classList.remove('hidden');
}