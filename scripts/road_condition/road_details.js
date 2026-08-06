import { subscribeTraffic } from "../data/road_condition/trafficStore.js";
import { updateRoadCondition } from "./update_road_details.js";

let activeRoadId = null;
//let subscribed = false;

let dom = {};

let initialized = false;

export function getActiveRoadId() {
  return activeRoadId;
}

export function getRoadDetailDom() {
  return dom;
}

export function openRoadCondition(container, road) {

  activeRoadId = road.road_id;

  if(!initialized) {
    container.innerHTML = `
      <div class="road-condition-content">
        <div class="cctv-dashboard">
          <div class="cctv-details-grid">

            <div class="cctv-video-container">
              <div class="cctv-video-header">
                <h3>
                  <button class="close-btn">
                    <i class="fas fa-arrow-left"></i>
                  </button>
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
                <!--<div class="time-display" id="currentTime">
                  01/02/2026 12:00
                </div>-->
              </div>
            </div>

            <div class="camera-info-sidebar">
              <!-- Camera Details Card -->
              <div class="camera-details-card">
                <h4><i class="fas fa-info-circle"></i> Camera Details</h4>
                <div class="details-grid">
                  <div class="detail-item">
                    <span class="detail-label">Camera ID</span>
                    <span class="detail-value" id="detailCameraId">CAM-${road.road_name}-${road.camera_name}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Location</span>
                    <span class="detail-value" id="detailLocation">${road.road_name}</span>
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
                  <div class="prediction-item">
                    <span class="prediction-label">Traffic Congestion</span>
                    <span class="prediction-value" id="detailTrafficLevel">${road.traffic_level}</span>
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

    dom = {
      currentCameraName: document.getElementById("currentCameraName"),
      roadVideo: document.getElementById("roadVideo"),

      detailCameraId: document.getElementById("detailCameraId"),
      detailLocation: document.getElementById("detailLocation"),

      detailTrafficLevel: document.getElementById("detailTrafficLevel"),
      detailVehicleFlow: document.getElementById("detailVehicleFlow"),
      detailAverageSpeed: document.getElementById("detailAverageSpeed")
    };

    getRoadDetailDom();

    const closeBtn = container.querySelector(".close-btn");

    const gridView = container.parentElement.querySelector("#cctvGridView");

    closeBtn.addEventListener("click", () => {

      activeRoadId = null;

      container.classList.add("hidden");

      gridView.classList.remove("hidden");

      document.querySelectorAll(".cctv-road").forEach(item =>
        item.classList.remove("active-stream")
      ); 
    });
  }

  container.classList.remove('hidden');

  updateRoadCondition(road, dom)

}