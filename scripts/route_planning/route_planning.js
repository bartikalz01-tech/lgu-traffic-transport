import { trafficTbody, brgyTrafficStatus, getDivesionPlan, getEmergencyPlan } from "../global_variables.js";
import { fetchRoadEvents, fetchRoadMap, fetchDiversions, fetchDiversionDetails, fetchAllDiversionStatus } from "../data/fetch_road_map.js";
import { getEventMarker, getTrafficColor } from "../utils/traffic_and_events.js";
import { renderDiversionPlan } from "./diversions/set_diversion_plan.js";
import { renderEmergencyPlan } from "./emergency/set_emergency_plan.js";
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

async function loadDiversionRoutes(map) {
  const diversions = await fetchDiversions();

  for(const diversion of diversions) {
    const points = await fetchDiversionDetails(diversion.diversion_id);

    if(!points.length) continue;

    const coords = points.map(p => [p.lat, p.lng]);

    const polyline = L.polyline(coords, {
      color: "#7f8c8d",
      weight: 6,
      dashArray: "6, 6"
    }).addTo(map);

    polyline.bindPopup(`
      <b>Diversion Route #${diversion.diversion_id}</b><br>
      ${diversion.start_name} → ${diversion.end_name}
    `);

    polyline.on("click", async () => {
      const details = await fetchAllDiversionStatus(diversion.diversion_id);

      if(!details.length) return;

      const d = details[0];

      document.getElementById("startRoad").textContent = d.start_name;
      document.getElementById("endRoad").textContent = d.end_name;
      document.getElementById("routeDistance").textContent = d.distance;
      document.getElementById("vehicleCount").textContent = d.vehicle_per_min ?? 0;
      document.getElementById("avgSpeed").textContent = d.avg_speed ?? 0;
    });
  }
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

  const map = L.map('map').setView([14.6414, 120.9909], 17.5);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

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
  await loadDiversionRoutes(map);
});

//const diversionPlan = getDivesionPlan();
const emergencyPlan = getEmergencyPlan();

/*diversionPlan.addEventListener('click', (e) => {
  const closeDiversionPlan = e.target.closest('.js-exit-diversion-plan');

  if (!closeDiversionPlan) return;

  diversionPlan.classList.add('diversion-plan-hidden');
  diversionPlan.innerHTML = '';
});

document.getElementById('diversionBtn').addEventListener('click', () => {
  renderDiversionPlan();
});*/

emergencyPlan.addEventListener('click', (e) => {
  const closeEmergencyPlan = e.target.closest('.js-exit-emergency');

  if(!closeEmergencyPlan) return;

  emergencyPlan.classList.add('emergency-hidden');
  emergencyPlan.innerHTML = '';
});

document.getElementById('emergencyBtn').addEventListener('click', () => {
  renderEmergencyPlan();
});