import { trafficTbody, brgyTrafficStatus, getDivesionPlan } from "../global_variables.js";
import { fetchRoadEvents, fetchRoadMap } from "../data/fetch_road_map.js";
import { getEventMarker, getTrafficColor } from "../utils/traffic_and_events.js";
import { renderDiversionPlan } from "./diversions/set_diversion_plan.js";
//import { trafficData, fetchTrafficData } from "../data/fetch_traffic_flow.js";
//import { trafficPercent, fetchTrafficPercent } from "../data/brgy_traffic_percent.js";

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

const diversionPlan = getDivesionPlan();

diversionPlan.addEventListener('click', (e) => {
  const closeDiversionPlan = e.target.closest('.js-exit-diversion-plan');

  if(!closeDiversionPlan) return;

  diversionPlan.classList.add('diversion-plan-hidden');
  diversionPlan.innerHTML = '';
});

document.getElementById('diversionBtn').addEventListener('click', () => {
  renderDiversionPlan();
});