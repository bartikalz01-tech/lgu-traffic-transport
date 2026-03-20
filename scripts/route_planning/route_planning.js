import { trafficTbody, brgyTrafficStatus } from "../global_variables.js";
import { fetchRoadEvents, fetchRoadMap } from "../data/fetch_road_map.js";
import { getEventMarker, getTrafficColor } from "../utils/traffic_and_events.js";
//import { trafficData, fetchTrafficData } from "../data/fetch_traffic_flow.js";
//import { trafficPercent, fetchTrafficPercent } from "../data/brgy_traffic_percent.js";

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

async function loadRoadEvents(map) {
  const events = await fetchRoadEvents();

  events.forEach(event => {
    const marker = L.marker(
      [event.latitude, event.longitude],
      { icon: getEventMarker(event.event_type, event.description) }
    ).addTo(map);

    marker.bindPopup(`
      <b>${event.event_type.toUpperCase()}</b><br>
      ${event.description}
    `);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const map = L.map('map').setView([14.6414, 120.9909], 17.5);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const roads = await fetchRoadMap();

  roads.forEach(road => {
    const color = getTrafficColor(road.traffic_level);

    const polyline = L.polyline(road.coordinates, {
      color: color,
      weight: 6
    }).addTo(map);

    polyline.bindPopup(`
      <b>${road.road_name}</b><br>
      Traffic: ${road.traffic_level}
    `);
  });

  loadRoadEvents(map);
});