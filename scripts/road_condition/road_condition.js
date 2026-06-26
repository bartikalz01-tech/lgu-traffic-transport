import { roads, fetchRoads } from '../data/fetch_roads.js';
/*import { trafficData, fetchTrafficData } from "../data/fetch_traffic_flow.js";
import { trafficPercent, fetchTrafficPercent } from "../data/brgy_traffic_percent.js";*/
import { openRoadCondition } from './road_details.js';
//import { renderTrafficConditionChart, renderTopRoadsChart, renderTrafficTrendChart } from './road_charts.js';
import { cctvGrid, roadOverlay } from '../global_variables.js';

export function renderCctvFeed() {
  let cctvs = '';

  roads.forEach((road) => {
    cctvs = cctvs + `
      <div class="cctv-feed">
        <!--<div class="cctv-info">
          <div class='cctv-road-title'>
            <i class='fas fa-video'></i>
            <p>${road.road_name}</p>
          </div>
          <div class="details-right-arrow" data-road-id="${road.road_id}">
            <p>View Details</p>
            <i class="fas fa-list"></i>
          </div>
        </div>-->

        <div class="cctv-video">
          <iframe 
            src="https://www.youtube.com/embed/${road.video_id}?autoplay=1&mute=1&controls=0&rel=0"
            frameborder="0"
            allow="autoplay; encrypted-media"
            allowfullscreen>
          </iframe>
        </div>
      </div>
    `;
  });

  cctvGrid.innerHTML = cctvs;
}

roadOverlay.addEventListener('click', (e) => {
  const closeBtn = e.target.closest('.close-btn');

  if (!closeBtn) return;

  roadOverlay.classList.add('hidden');
  roadOverlay.innerHTML = '';
});

cctvGrid.addEventListener('click', (e) => {
  const detailsBtn = e.target.closest('.details-right-arrow');

  if (!detailsBtn) return;

  const roadId = detailsBtn.dataset.roadId;
  const selectedRoad = roads.find(r => String(r.road_id) === String(roadId));

  if(!selectedRoad) return;

  openRoadCondition(selectedRoad)
});

fetchRoads();