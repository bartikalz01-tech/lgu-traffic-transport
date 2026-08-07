import { getCctvAiDetails } from "../data/road_condition/fetch_road_condition.js";
import { getCurrentTraffic, subscribeTraffic } from "../data/road_condition/trafficStore.js";
import { roadReports } from "./render_road_reports.js";
import { getActiveRoadId, getRoadDetailDom, openRoadCondition } from "./road_details.js";
import { renderCongestionFrequency } from "./road_reports/congestion_frequency.js";
import { renderTrafficTrend } from "./road_reports/traffic_trend_overtime.js";
import { renderAverageSpeedHistory } from "./road_reports/average_speed_history.js";
import { updateRoadCondition } from "./update_road_details.js";

const subModuleTitle = document.getElementById("subModuleTitle");

let reportsInitialized = false;

let reportContent = null;

export async function renderCctvAi(container) {

  subModuleTitle.textContent = "CCTV Monitoring";

  let cctvRoads = getCurrentTraffic();

  if(cctvRoads.length === 0) {
    cctvRoads = await getCctvAiDetails();
  }

  let sidebarHTML = "";
  let cctvCardsHTML = "";

  //const VIDEO_FOLDER = "/lgu-traffic-transport/cctv_ai/cctv_feeds/";

  cctvRoads.forEach((roads, index) => {
    sidebarHTML += `
      <div class="cctv-road ${index === 0 ? "active-stream" : ""}" data-road-id="${roads.road_id}">
        <div class="cctv-road-meta">
          <i class="fas fa-circle"></i>
          <p>CCTV-${roads.road_name}</p>
        </div>
        <i class="fas fa-eye cctv-road-chevron"></i>
      </div>
    `

    cctvCardsHTML += `
      <div class="cctv-stream-card" data-road-id=${roads.road_id}>
        <div class="stream-card-header">
          <span class="stream-badge live"><i class="fas fa-circle stream-pulse"></i> LIVE</span>
          <span class="stream-tag-id">${roads.camera_name}</span>
        </div>
        <div class="stream-video-viewport" id="viewport-${roads.road_id}">
          <img class="stream-video" id="video-${roads.road_id}" src="http://127.0.0.1:5001/video/${roads.video_filename}" />

          <div class="stream-overlay-metadata">
            <p class="stream-road-name">CCTV-${roads.road_name}</p>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = `
    <div class="cctv-sidebar">
      <div class="cctv-sidebar-controller">
        <div class="cctv-sidebar-header">
          <div class="logo-container">
            <div class="live-indicator"></div>
            <i class="fas fa-video"></i>
          </div>
          <h4>CCTV Navigation</h4>
        </div>

        <div class="cctv-links">
          ${sidebarHTML}
        </div>
      </div>

      <div class="cctv-sidebar-controller reports-controller" id="reportsController">
        <div class="cctv-sidebar-header reports-header">
          <div class="logo-container reports-logo">
            <!--<div class="live-indicator"></div>-->
            <i class="fas fa-chart-column"></i>
          </div>
          <p class="road-p">Road Reports Summary</p>
        </div>

        <div class="report-links">
          <div class="report-link active-report" data-report="traffic-trend">
            <i class="fas fa-chart-line"></i>
            <span>Traffic Trend</span>
          </div>

          <div class="report-link active-report" data-report="congestion-frequency">
            <i class="fas fa-road"></i>
            <span>Congestion Frequency</span>
          </div>

          <div class="report-link" data-report="average-speed-history">
            <i class="fas fa-gauge-high"></i>
            <span>Average Speed History</span>
          </div>
        </div>
      </div>
    </div>

    <div class="cctv-content">
      <div id="cctvGridView" class="cctv-container">
        ${cctvCardsHTML}
      </div>

      <div id="roadDetailView" class="hidden"></div>
      
    </div>

    <div class="road-reports-content hidden" id="roadReportsView"></div>
  `;

  subscribeTraffic((roads) => {

    roads.forEach(road => {

      const card = container.querySelector(
        `.cctv-stream-card[data-road-id="${road.road_id}"]`
      );

      if(!card) return;

      const roadName = card.querySelector(".stream-road-name");

      if (roadName) {
        roadName.textContent = `CCTV-${road.road_name}`;
        
        const activeRoadId = getActiveRoadId();

        if (road.road_id == activeRoadId) {
          const dom = getRoadDetailDom();
          updateRoadCondition(road, dom);
        }
      }

    });

  });

  const cctvItems = container.querySelectorAll(".cctv-road");
  const reportItems = container.querySelectorAll(".report-link");

  const reportsController = container.querySelector("#reportsController");

  const reportsHeader = container.querySelector("#reportsController .reports-header");

  const cctvContent = container.querySelector(".cctv-content");
  const reportsView = container.querySelector("#roadReportsView");

  cctvItems.forEach(item => item.classList.remove("active-stream"));

  reportItems.forEach(item => item.classList.remove("active-report"));

  cctvItems.forEach(item => {
    item.addEventListener("click", () => {

      subModuleTitle.textContent = "CCTV Monitoring";

      cctvContent.classList.remove("hidden");
      reportsView.classList.add("hidden");
      reportsController.classList.remove("active-stream");
      reportItems.forEach(item => item.classList.remove("active-report"));

      /*const roadId = item.dataset.roadId;*/
      const selectedRoad = cctvRoads.find(
        road => road.road_id == item.dataset.roadId
      );

      const gridView = container.querySelector("#cctvGridView");
      const detailView = container.querySelector("#roadDetailView");

      gridView.classList.add("hidden");
      detailView.classList.remove("hidden");

      cctvItems.forEach(item => item.classList.remove("active-stream"));

      item.classList.add("active-stream");

      openRoadCondition(detailView, selectedRoad);

    });
  });


  async function openReport(reportName) {
    subModuleTitle.textContent = "Road Reports";

    cctvContent.classList.add("hidden");
    reportsView.classList.remove("hidden");

    cctvItems.forEach(item => item.classList.remove("active-stream"));

    if(!reportsInitialized) {
      reportContent = roadReports(reportsView);
      reportsInitialized = true;
    }

    switch(reportName) {
      case "traffic-trend":
        renderTrafficTrend(reportContent);
        break;

      case "congestion-frequency":
        renderCongestionFrequency(reportContent);
        break;

      case "average-speed-history":
        renderAverageSpeedHistory(reportContent);
        break;
    }
  }


  reportItems.forEach(item => {

    item.addEventListener("click", async () => {

      reportItems.forEach(link => link.classList.remove("active-report"));

      item.classList.add("active-report");

      await openReport(item.dataset.report);

    });

  });

}