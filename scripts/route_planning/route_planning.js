import { trafficTbody, brgyTrafficStatus, getDivesionPlan, getEmergencyPlan } from "../global_variables.js";
import { fetchRoadEvents, fetchRoadMap, fetchDiversions, fetchDiversionDetails, fetchAllDiversionStatus } from "../data/fetch_road_map.js";
import { getEmergenciesLocation } from "../data/fetch_emergencies.js";
import { getEventMarker, getTrafficColor } from "../utils/traffic_and_events.js";
import { renderDiversionPlan } from "./diversions/set_diversion_plan.js";
import { renderEmergencyPlan } from "./emergency/set_emergency_plan.js";
import { renderDiversionMaps } from "./diversions/final_render_diversion.js";
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

async function loadDiversionRoutes() {
  const diversions = await fetchDiversions();

  const activeCountEl = document.getElementById("activeCount");
  const routeCountEl = document.getElementById("routeCount");

  activeCountEl.textContent = diversions.length;

  const uniqueRoads = new Set();

  for(const diversion of diversions) {
    const points = await fetchDiversionDetails(diversion.diversion_id);

    points.forEach(point => {

      if(point.road_name) {
        uniqueRoads.add(point.road_name);
      }
    });
  }

  routeCountEl.textContent = uniqueRoads.size;
}

async function renderEmergencyCounts() {

  const emergencies = await getEmergenciesLocation();

  const pendingCount = emergencies.filter(
    emergency => emergency.status === "active"
  ).length;

  const assignedCount = emergencies.filter(
    emergency => emergency.status === "assigned"
  ).length;

  const pendingEl = document.getElementById(
    "emergencyPendingCount"
  );

  const assignedEl = document.getElementById(
    "emergencyAssignedCount"
  );

  pendingEl.textContent = pendingCount;

  assignedEl.textContent = assignedCount;
}

document.addEventListener('DOMContentLoaded', async () => {

  /*const activeElSummary = document.getElementById('activeCount');
  const scheduledElSummary = document.getElementById('scheduledCount');
  const resolvedElSummary = document.getElementById('resolvedCount');

  async function renderDiversionSummary() {
    const data = await fetchDiversionSummary();

    if(!data) return;

    if(activeElSummary) {
      activeElSummary.textContent = data.active ?? 0;
    }

    if(scheduledElSummary) {
      scheduledElSummary.textContent = data.scheduled ?? 0;
    }

    if(resolvedElSummary) {
      resolvedElSummary.textContent = data.resolved ?? 0;
    }
  }

  await renderDiversionSummary();*/

  /*setInterval(() => {
    renderDiversionSummary();
  }, 5000);*/

  const leftSide = document.querySelector(".left-side");
  await renderDiversionMaps(leftSide);

  /*const map = L.map('map').setView([14.6414, 120.9909], 17.5);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);*/

  /*const roads = await fetchRoadMap();

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
  });*/

  //loadRoadEvents(map);
  await loadDiversionRoutes();
  await renderEmergencyCounts();
});

//const diversionPlan = getDivesionPlan();
const emergencyPlan = getEmergencyPlan();

emergencyPlan.addEventListener('click', (e) => {
  const closeEmergencyPlan = e.target.closest('.js-exit-emergency');

  if(!closeEmergencyPlan) return;

  emergencyPlan.classList.add('emergency-hidden');
  emergencyPlan.innerHTML = '';
});

document.getElementById('emergencyBtn').addEventListener('click', () => {
  renderEmergencyPlan();
});