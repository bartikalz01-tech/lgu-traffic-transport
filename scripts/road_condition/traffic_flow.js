import { trafficTbody  } from "../global_variables.js";
import { trafficData, fetchTrafficData } from "../data/fetch_traffic_flow.js";

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
        <td>${data.traffic_time}</td>
        <td>${data.traffic_date}</td>
      </tr>
    `;
  });

  trafficTbody.innerHTML = trafficFlow;
}

fetchTrafficData();