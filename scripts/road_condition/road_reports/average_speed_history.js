import { getAverageSpeedHistoryLogs } from "../../data/road_condition/fetch_road_condition.js";
import { renderAverageSpeedHistoryChart } from "./road_report_charts/average_speed_history_chart.js";

// Any single reading above this is not physically plausible for city
// road traffic and is treated as a bad sensor/tracking reading rather
// than a real vehicle speed. This is a safety net on top of the fix
// already made at the source (calculate_speed.py) - it protects the
// dashboard even if a bad reading somehow still makes it into the DB
// (e.g. old rows recorded before that fix, or a future regression).
const MAX_PLAUSIBLE_SPEED_KMH = 80;

function parseMySQLDateTime(dateTime) {
  if (!dateTime) {
    return null;
  }

  return new Date(dateTime.replace(" ", "T"));
}

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
          <canvas id="averageSpeedHistoryChart"></canvas>
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

  const chartCanvas = container.querySelector("#averageSpeedHistoryChart");

  async function loadAverageSpeedHistory() {
    const filters = {
      start_date: document.querySelector("#startDate")?.value || "",
      end_date: document.querySelector("#endDate")?.value || "",
      road_id: document.querySelector("#roadFilter")?.value || "all"
    };

    const logs = await getAverageSpeedHistoryLogs(filters);

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
    let discardedCount = 0;

    logs.forEach(log => {
      const roadId = log.road_id;

      const speed = Number(log.avg_speed);

      if(Number.isNaN(speed)) {
        return;
      }

      // Drop physically-implausible readings (bad sensor/tracking data)
      // before they can distort the average, peak, or lowest values for
      // this road. Negative values are dropped too - a valid speed is
      // never below 0.
      if(speed < 0 || speed > MAX_PLAUSIBLE_SPEED_KMH) {
        discardedCount++;
        return;
      }

      if(!roadStats[roadId]) {
        roadStats[roadId] = {
          road_name: log.road_name,
          speeds: [],
          recorded_at: [],
          latest_recorded_at: log.recorded_at
        };
      }
      
      roadStats[roadId].speeds.push(speed);
      roadStats[roadId].recorded_at.push(log.recorded_at);

      if(parseMySQLDateTime(log.recorded_at) > parseMySQLDateTime(roadStats[roadId].latest_recorded_at)) {
        roadStats[roadId].latest_recorded_at = log.recorded_at;
      }
    });

    if(discardedCount > 0) {
      console.warn(
        `Average Speed History: discarded ${discardedCount} implausible reading(s) `
        + `(> ${MAX_PLAUSIBLE_SPEED_KMH} km/h or negative) before computing stats.`
      );
    }

    if(Object.keys(roadStats).length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6">
            No valid average speed records found for this range.
          </td>
        </tr>
      `;
      return;
    }

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
            ${parseMySQLDateTime(road.latest_recorded_at)?.toLocaleString() || "N/A"}
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

    renderAverageSpeedHistoryChart(chartCanvas, roadStats);
  }

  await loadAverageSpeedHistory();

  document.querySelector("#startDate")?.addEventListener("change", loadAverageSpeedHistory);
  document.querySelector("#endDate")?.addEventListener("change", loadAverageSpeedHistory);
  document.querySelector("#roadFilter")?.addEventListener("change", loadAverageSpeedHistory);
}