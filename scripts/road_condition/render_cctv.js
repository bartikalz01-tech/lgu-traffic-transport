import { getCctvAiDetails } from "../data/road_condition/fetch_road_condition.js";
import { getCurrentTraffic, subscribeTraffic } from "../data/road_condition/trafficStore.js";
import { openRoadCondition } from "./road_details.js";

export async function renderCctvAi(container) {

  let cctvRoads = getCurrentTraffic();

  if(cctvRoads.length === 0) {
    cctvRoads = await getCctvAiDetails();
  }

  let sidebarHTML = "";
  let cctvCardsHTML = "";

  const VIDEO_FOLDER = "/lgu-traffic-transport/cctv_ai/cctv_feeds/";

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
          <video autoplay muted class="stream-video" id="video-${roads.road_id}">
            <source src="${VIDEO_FOLDER}${roads.video_filename}" type="video/mp4">
          </video>

          <div class="stream-overlay-metadata">
            <p class="stream-road-name">CCTV-${roads.road_name}</p>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = `
    <div class="cctv-sidebar">
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

    <div class="cctv-container">
      ${cctvCardsHTML}
    </div>
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
      }

    });

  });

  const videos = container.querySelectorAll(".stream-video");
  
  videos.forEach(video => {

    video.addEventListener("loadedmetadata", () => {
      video.currentTime = 7;
    });

    video.addEventListener("ended", () => {
      video.currentTime = 7;
      video.play();
    });

  });



  const cctvItems = container.querySelectorAll(".cctv-road");

  cctvItems.forEach(item => {
    item.addEventListener("click", () => {

      /*const roadId = item.dataset.roadId;*/
      const selectedRoad = cctvRoads.find(
        road => road.road_id == item.dataset.roadId
      );

      const cctvPage = document.getElementById("cctvPage");
      const roadContainer = document.getElementById("roadConditionContainer");

      cctvPage.classList.add("hidden");
      roadContainer.classList.remove("hidden");

      openRoadCondition(roadContainer, selectedRoad);

    });
  });
}