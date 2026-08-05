import { subscribeTraffic } from "../data/road_condition/trafficStore.js";

let activeRoadId = null;
let subscribed = false;

export function openRoadCondition(container, road) {

  activeRoadId = road.road_id;

  container.innerHTML = `
    <div class="road-condition-content">

    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div class="module-title-container">
        <button class="close-btn">
          <img class="left-arrow-logo" src="../images/arrow_to_left_fill.svg">
        </button>
        <p class="module-title">Real Time Road Condition Updates</p>
        <h1 class="sub-module-title">CCTV Monitoring</h1>
        <p class="sub-module-description">Real-time surveillance of Susano Road</p>
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
              <span id="currentCameraName">${road.camera_name}</span>
            </h3>
            <div class="live-status">
              <i class="fas fa-circle"></i>
              <span>LIVE FEED</span>
            </div>
          </div>

          <!--<div class="cctv-video-display">
            
          </div>-->

          <div class="cctv-video-display" id="detailedVideoContainer">
            <img id="roadVideo" class="stream-video" src="http://127.0.0.1:5001/video/${road.video_filename}" />
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
                <span class="detail-value">CAM-${road.road_name}-${road.camera_name}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Location</span>
                <span class="detail-value">${road.road_name}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Type</span>
                <span class="detail-value">Pan-Tilt-Zoom</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Resolution</span>
                <span class="detail-value">1080p @ 60fps</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Field of View</span>
                <span class="detail-value">120° Wide Angle</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Installation Date</span>
                <span class="detail-value">2026-08-15</span>
              </div>
            </div>
            <div class="camera-status">
              <span class="status-indicator status-online"></span>
              <span class="detail-value">Online - Connected to Network</span>
            </div>
          </div>

          <!-- Predictive AI Card -->
          <div class="predictive-ai-card">
            <h4><i class="fas fa-brain"></i> Real-Time AI Analysis</h4>
            <div class="ai-predictions">
              <div class="prediction-item traffic">
                <span class="prediction-label">Traffic Congestion</span>
                <span class="prediction-value medium" id="detailTrafficLevel">${road.traffic_level}</span>
              </div>
              <div class="prediction-item vehicle-flow">
                <span class="prediction-label">Vehicle per/min</span>
                <span class="prediction-value vehicle-count-value" id="detailVehicleFlow">${road.vehicle_flow}</span>
              </div>
              <div class="prediction-item congestion">
                <span class="prediction-label">Average Street Speed</span>
                <span class="prediction-value average-speed" id="detailAverageSpeed">${road.avg_speed} km/h</span>
              </div>
            </div>
            <div style="margin-top: 1rem; font-size: 0.75rem; color: var(--text-secondary-1);">
              <i class="fas fa-info-circle"></i>
              <span>Updated every 1 minute based on traffic patterns</span>
            </div>
          </div>

          <!-- Traffic Statistics -->
          <!--<div class="camera-details-card">
            <h4><i class="fas fa-chart-line"></i> Real-time Statistics</h4>
            <div class="traffic-stats">
              <div class="stat-card">
                <div class="stat-value" id="detailVehicleFlow">${road.vehicle_flow}</div>
                <div class="stat-label">Vehicles/min</div>
              </div>
              <div class="stat-card">
                <div class="stat-value" id="detailAverageSpeed">${road.avg_speed} km/h</div>
                <div class="stat-label">Average Street Speed</div>
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
          </div>-->
        </div>
      </div>
    </div>
  </div>

  <div class="fullscreen-modal" id="fullscreenModal">
    <div class="fullscreen-video">
      <div class="video-placeholder">
        <i class="fas fa-video" style="font-size: 5rem;"></i>
        <p style="font-size: 1.5rem;">Full Screen CCTV View</p>
        <p>Susano Road Street Intersection - Live Feed</p>
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

  container.classList.remove('hidden');

  const closeBtn = container.querySelector(".close-btn");

  closeBtn.addEventListener("click", () => {

    activeRoadId = null;

    container.classList.add("hidden");

    document.getElementById("cctvPage").classList.remove("hidden");
  });

  if (!subscribed) {

    subscribeTraffic((roads) => {

      if (!activeRoadId) return;

      const latestRoad = roads.find(r => r.road_id == activeRoadId);

      if (!latestRoad) return;

      const vehicle = document.getElementById("detailVehicleFlow");

      const speed = document.getElementById("detailAverageSpeed");

      const traffic = document.getElementById("detailTrafficLevel");
      const trafficItem = traffic?.closest(".prediction-item");

      if (vehicle) vehicle.textContent = latestRoad.vehicle_flow;

      if (speed) speed.textContent = `${latestRoad.avg_speed} km/h`;

      if(traffic) {
        traffic.textContent = latestRoad.traffic_level

        // Remove old colors
        traffic.classList.remove("low", "moderate", "high", "medium");

        trafficItem.classList.remove("low", "moderate", "high", "medium");

        const level = latestRoad.traffic_level.toLowerCase();

        traffic.classList.add(level);
        trafficItem.classList.add(level);
      }

    });

    subscribed = true;

  }

}