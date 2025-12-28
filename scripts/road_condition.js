import { roads } from './data/roads.js';
import { openRoadCondition } from './road_details.js';
import { openSidebarBtn, closeSidebarBtn, sidebar, sidebarOverlay, cctvGrid, roadOverlay } from './road_variables.js';

openSidebarBtn.addEventListener('click', () => {
  sidebar.classList.toggle('open');
  sidebarOverlay.classList.toggle('visible');
});

closeSidebarBtn.addEventListener('click', () => {
  sidebar.classList.toggle('open');
  sidebarOverlay.classList.toggle('visible');
});

function renderCctvFeed() {
  let cctvs = '';

  roads.forEach((road) => {
    cctvs = cctvs + `
      <div class="cctv-feed">
        <div class="cctv-info">
          <p>${road.roadName}</p>
          <div class="details-right-arrow" data-road-name="${road.roadName}">
            <p>View Details</p>
            <i class="fas fa-list"></i>
          </div>
        </div>

        <div class="cctv-video">
          <i class="fas fa-video"></i>
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

  if(!detailsBtn) return;

  const roadName = detailsBtn.dataset.roadName;

  openRoadCondition(roadName)
});


renderCctvFeed();