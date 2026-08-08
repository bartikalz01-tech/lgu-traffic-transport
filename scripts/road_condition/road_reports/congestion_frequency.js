import { getTrafficTrendAndCongestionLogs } from "../../data/road_condition/fetch_road_condition.js";

export async function renderCongestionFrequency(container) {

  container.innerHTML = `
    <div class="report-card">
      <div class="report-header">
        <div>
          <h2>Congestion Frequency</h2>
          <p>Shows how often each road reached Low, Moderate, and High congestion levels</p>
        </div>
      </div>

      <div class="traffic-report-layout">
        <div class="traffic-chart-panel">
          <div class="panel-title">
            Congestion Frequency Chart
          </div>

          <div class="chart-placeholder">
            Stacked Bar chart will render here
          </div>
        </div>

        <div class="traffic-table-panel">
          <div class="panel-title">
            Congestion Frequency Records
          </div>

          <div class="table-wrapper">
            <table class="traffic-report-table">
              <thead>
                <tr>
                  <th>Road</th>
                  <th>Low</th>
                  <th>Moderate</th>
                  <th>High</th>
                  <th>Congestion Score</th>
                </tr>
              </thead>

              <tbody id="congestionFrequencyTableBody"></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  const tbody = container.querySelector("#congestionFrequencyTableBody");

  async function loadCongestionFrequency() {
    const filters = {
      start_date: document.querySelector("#startDate")?.value || "",
      end_date: document.querySelector("#endDate")?.value || "",
      road_id: document.querySelector("#roadFilter")?.value || "all"
    };

    const logs = await getTrafficTrendAndCongestionLogs(filters);

    const roadStats = {};

    logs.forEach(log => {

      const roadId = log.road_id;

      if(!roadStats[roadId]) {
        roadStats[roadId] = {
          road_name: log.road_name,
          low: 0,
          moderate: 0,
          high: 0
        };
      }

      const level = log.traffic_level.toLowerCase();

      if(level === "low") {
        roadStats[roadId].low++;
      } else if(level === "moderate") {
        roadStats[roadId].moderate++;
      } else if(level === "high") {
        roadStats[roadId].high++;
      }

    });

    tbody.innerHTML = "";

    Object.values(roadStats).forEach(road => {
      const total = road.low + road.moderate + road.high;

      const score = total === 0 ? 0 : (
        (road.moderate * 50) + (road.high * 100)
      ) / total;

      let scoreClass = "low";

      if(score >= 67) {
        scoreClass = "high";
      } else if(score >= 34) {
        scoreClass = "medium";
      }

      tbody.innerHTML += `
        <tr>
          <td>${road.road_name}</td>
          <td>${road.low}</td>
          <td>${road.moderate}</td>
          <td>${road.high}</td>
          <td>
            <span class="congestion-score ${scoreClass}">${score.toFixed(0)}%</span>
          </td>
        </tr>
      `; 
    });
  }

  await loadCongestionFrequency();

  document.querySelector("#startDate")?.addEventListener("change", loadCongestionFrequency);
  document.querySelector("#endDate")?.addEventListener("change", loadCongestionFrequency);
  document.querySelector("#roadFilter")?.addEventListener("change", loadCongestionFrequency);

}