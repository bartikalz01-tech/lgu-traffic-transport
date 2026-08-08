import { getAverageSpeedHistoryLogs } from "../../data/road_condition/fetch_road_condition.js";

export async function renderAverageSpeedHistory(container) {

  container.innerHTML = `
    <div class="traffic-report-header">
      <h2>Average Speed History</h2>
      <p>
        Shows how the average vehicle speed changes over time.
      </p>
    </div>

    <div class="traffic-report-layout">

      <div class="traffic-chart-panel">
        <div class="panel-title">
          Average Speed Trend
        </div>

        <div class="chart-placeholder">
          Line Chart will render here
        </div>
      </div>

      <div class="traffic-table-layout">
        <div class="panel-title">
          Average Speed Records
        </div>

        <div class="table-wrapper">
          <table class="traffic-report-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Road</th>
                <th>Average Speed</th>
                <th>Peak Speed</th>
                <th>Lowest Speed</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody id="averageSpeedHistoryTableBody"></tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  const tbody = container.querySelector("#averageSpeedHistoryTableBody");

  async function loadAverageSpeedHistory() {
    const filters = {
      start_date: document.querySelector("#startDate")?.value || "",
      end_date: document.querySelector("#endDate")?.value || "",
      road_id: document.querySelector("#roadFilter")?.value || "all"
    };

    const logs = await getAverageSpeedHistoryLogs();

    tbody.innerHTML = "";

    if(!logs || logs.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6">
            No average speed records found.
          </td>
        </tr>
      `;
      return;
    }

    const roadStats = {};

    logs.forEach(log => {
      const roadId = log.road_id;

      const speed = Number(log.avg_speed);

      if(Number.isNaN(speed)) {
        return;
      }

      if(!roadStats[roadId]) {
        roadStats[roadId] = {
          road_name: log.road_name,
          speeds: [],
          latest_recorderd_at: log.recorded_at
        };
      }
      
      roadStats[roadId].speeds.push(speed);

      if(new Date(log.recorded_at) > new Date(roadStats[roadId].latest_recorderd_at)) {
        roadStats[roadId].latest_recorderd_at = log.recorded_at;
      }
    });

    Object.values(roadStats).forEach(road => {
      const speeds = road.speeds;

      if(speeds.length === 0) {
        return;
      }

      const averageSpeed = speeds.reduce(
        (sum, speed) => sum + speed,
        0
      ) / speeds.length;

      const peakSpeed = Math.max(...speeds);

      const lowestSpeed = Math.min(...speeds);

      let status = "Low";
      let statusClass= "low";

      if(averageSpeed >= 50) {
        status = "High";
        statusClass = "high";
      } else if(averageSpeed >= 30) {
        status = "Moderate";
        statusClass = "medium";
      }

      tbody.innerHTML += `
        <tr class="speed-${statusClass}">
          <td>
            ${new Date(
              road.latest_recorded_at
            ).toLocaleString()}
          </td>
          <td>
            ${road.road_name}
          </td>
          <td>
            ${averageSpeed.toFixed(2)} km/h
          </td>
          <td>
            ${peakSpeed.toFixed(2)} km/h
          </td>
          <td>
            ${lowestSpeed.toFixed(2)} km/h
          </td>
          <td>
            <span class="speed-badge ${statusClass}">
              ${status}
            </span>
          </td>
        </tr>
      `;
    });
  }

  await loadAverageSpeedHistory();

  document.querySelector("#startDate")?.addEventListener("change", loadAverageSpeedHistory);
  document.querySelector("#endDate")?.addEventListener("change", loadAverageSpeedHistory);
  document.querySelector("#roadFilter")?.addEventListener("change", loadAverageSpeedHistory);
}