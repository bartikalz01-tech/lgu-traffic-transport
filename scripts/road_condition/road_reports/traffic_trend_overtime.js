import { getTrafficTrendAndCongestionLogs } from "../../data/road_condition/fetch_road_condition.js";
import { renderTrafficTrendChart } from "./road_report_charts/traffic_trend_chart.js";

export async function renderTrafficTrend(container) {
  container.innerHTML = `
    <div class="report-card">
      <div class="report-header">
        <div>
          <h2>Traffic Trend Overtime</h2>
          <p>Historical Traffic flow, average speed and congestion records.</p>
        </div>
      </div>

      <div class="traffic-report-layout">
        <div class="traffic-chart-panel">
          <div class="panel-title">
            Traffic Trend Chart
          </div>

          <div id="trafficTrendChart" class="chart-placeholder">
            Chart will be rendered here
          </div>
        </div>

        <div class="traffic-table-panel">
          <div class="panel-title">
            Traffic Logs
          </div>

          <div class="table-wrapper">
            <table class="traffic-report-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Road</th>
                  <th>Avg Speed</th>
                  <th>Vehicle Flow</th>
                  <th>Traffic Level</th>
                </tr>
              </thead>

              <tbody id="trafficReportTableBody"></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  const tbody = container.querySelector("#trafficReportTableBody");

  async function loadLogs() {
    const filters = {
      start_date: document.querySelector("#startDate")?.value || "",
      end_date: document.querySelector("#endDate")?.value || "",
      road_id: document.querySelector("#roadFilter")?.value || "all"
    };

    const logs = await getTrafficTrendAndCongestionLogs(filters);
    
    const chartContainer = container.querySelector("#trafficTrendChart");

    renderTrafficTrendChart(chartContainer, logs);

    tbody.innerHTML = "";

    logs.forEach(log => {

      let badge = "low";

      if(log.traffic_level.toLowerCase() == "moderate") badge = "medium";

      else if(log.traffic_level.toLowerCase() == "high") badge = "high";


      tbody.innerHTML += `
        <tr>
          <td>${new Date(log.recorded_at).toLocaleString()}</td>
          <td>${log.road_name}</td>
          <td>${Number(log.avg_speed).toFixed(2)} km/h</td>
          <td>${Math.round(log.vehicle_flow)} veh/min</td>
          <td><span class="traffic-badge ${badge}">${log.traffic_level}</span></td>
        </tr>
      `;
 
    });
  }

  await loadLogs();

  document.querySelector("#startDate")?.addEventListener("change", loadLogs);
  document.querySelector("#endDate")?.addEventListener("change", loadLogs);
  document.querySelector("#roadFilter")?.addEventListener("change", loadLogs);
}