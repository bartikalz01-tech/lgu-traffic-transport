import { startTrafficStore, subscribeRoadMap, subscribeTraffic } from "../data/road_condition/trafficStore.js";
import { congestionMap } from "./congestion_map.js";
import { updateRoadMetrics, updateTrafficMetric } from "./dashboard_metrics.js";
import { initializedTrafficChart, updateTrafficChart } from "./traffic_volume_vehicle_chart.js";
import { initializeCongestionPieChart, updateCongestionPieChart } from "./congestion_pie_chart.js";
import { initializeAverageSpeedChart, updateAverageSpeedChart } from "./average_speed_chart.js";

document.addEventListener("DOMContentLoaded", async () => {

  const mapId = document.getElementById("map");

  const map = L.map(mapId).setView([14.72959, 121.03867], 16);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  startTrafficStore();

  initializedTrafficChart();
  initializeCongestionPieChart();
  initializeAverageSpeedChart();

  subscribeRoadMap((roads) => {
    congestionMap(map, roads);
    updateRoadMetrics(roads);
  });

  subscribeTraffic((trafficData) => {
    updateTrafficMetric(trafficData);
    updateTrafficChart(trafficData);
    updateCongestionPieChart(trafficData);
    updateAverageSpeedChart(trafficData);
  })

  //const roadCongestion = await fetchRoadMap();

});