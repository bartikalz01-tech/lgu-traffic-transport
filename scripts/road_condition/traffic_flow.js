import { trafficTbody, brgyTrafficStatus  } from "../global_variables.js";
import { trafficData, fetchTrafficData } from "../data/fetch_traffic_flow.js";
import { trafficPercent, fetchTrafficPercent } from "../data/brgy_traffic_percent.js";

document.addEventListener('DOMContentLoaded', function () {
  const openSidebarBtn = document.querySelector('.hamburger-menu-btn');
  const closeSidebarBtn = document.querySelector('.sidebar-close-btn');
  const sidebar = document.querySelector('.sidebar-container');
  const sidebarOverlay = document.querySelector('.sidebar-overlay');

  if (openSidebarBtn && sidebar && sidebarOverlay) {
    openSidebarBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      sidebarOverlay.classList.toggle('visible');
    });
  }

  if (closeSidebarBtn && sidebar && sidebarOverlay) {
    closeSidebarBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      sidebarOverlay.classList.toggle('visible');
    });
  }

  // Close sidebar when clicking overlay
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
      if (sidebar) {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('visible');
      }
    });
  }
});

export function renderTrafficFlowTable() {
  let trafficFlow = '';

  trafficData.forEach((data) => {
    trafficFlow += `
      <tr>
        <td>${data.road_name}</td>
        <td>${data.traffic_condition}</td>
        <td>${data.start_traffic_time}</td>
        <td>${data.traffic_date}</td>
      </tr>
    `;
  });

  console.log(trafficTbody);

  trafficTbody.innerHTML = trafficFlow;
}

fetchTrafficData();

export function renderTrafficPercentage() {
  const highEl = document.querySelector('.red-percentage');
  const moderateEl = document.querySelector('.yellow-percentage');
  const lowEl = document.querySelector('.green-percentage');

  if(!highEl || !moderateEl || !lowEl) return;

  highEl.textContent = '0%';
  moderateEl.textContent = '0%';
  lowEl.textContent = '0%';

  trafficPercent.forEach(item => {
    const percent = `${item.percentage}%`;

    switch(item.traffic_condition) {
      case 'High Traffic':
        highEl.textContent = percent;
        break;
      
      case 'Moderate Traffic':
        moderateEl.textContent = percent;
        break;

      case 'Low Traffic':
        lowEl.textContent = percent;
        break
    }
  });
}

fetchTrafficPercent();

setInterval(() => {
  fetchTrafficPercent();
}, 300000); // every 5 minutes