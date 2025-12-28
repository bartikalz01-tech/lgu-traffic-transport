import { roads } from './data/roads.js';
import { openSidebarBtn, closeSidebarBtn, sidebar, sidebarOverlay, cctvGrid } from './road_variables.js';

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
          <div class="details-right-arrow">
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

renderCctvFeed();