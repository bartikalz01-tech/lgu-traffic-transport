import { getPeakHourAnalyticsLogs } from "../../data/road_condition/fetch_road_condition.js";

export async function renderPeakHour(container) {
  container.innerHTML = `
    <div class="traffic-report-header">
      <h2 id="peakHourTitle">Peak Hour Analytics</h2>

      <p id="peakHourDescription">
        Detects the busiest traffic periods based on
        vehicle count, congestion level, and average speed.
      </p>
    </div>

    <div class="peak-hour-layout">
      <div class="traffic-chart-panel">
        <div class="panel-title">
          Peak Hour Distribution
        </div>

        <div id="peakHourChart" class="chart-placeholder">
          Column Bar Chart will render here
        </div>
      </div>

      <div class="summary-panel">
        <div class="panel-title">
          Peak Hour Summary
        </div> 

        <div class="summary-grid">
          <div class="summary-card danger">
            <span class="summary-label">Peak Hour</span>
            <span class="summary-value" id="peakHourValue">5:00 PM - 6:00 PM</span>
          </div>

           <div class="summary-card warning">
            <span class="summary-label">Highest Vehicle Flow</span>
            <span class="summary-value" id="highestFlowValue">214 vehicles/min</span>
          </div>

          <div class="summary-card info">
            <span class="summary-label">Average Peak Speed</span>
            <span class="summary-value" id="averagePeakSpeedValue">21 km/h</span>
          </div>
        </div>
      </div>

      <div class="summary-panel">
        <div class="panel-title">
          Lowest Traffic Summary
        </div>

        <div class="summary-grid">
          <div class="summary-card success">
            <span class="summary-label">Lowest Traffic Hour</span>
            <span class="summary-value" id="lowestHourValue">5:00 PM - 6:00 PM</span>
          </div>

           <div class="summary-card success success">
            <span class="summary-label">Lowest Vehicle Flow</span>
            <span class="summary-value" id="lowestFlowValue">214 vehicles/min</span>
          </div>

          <div class="summary-card primary">
            <span class="summary-label">Average Speed</span>
            <span class="summary-value" id="lowestSpeedValue">21 km/h</span>
          </div>
        </div>
      </div>
    </div>
  `;

  async function loadPeakAnalytics() {
    const startDate = document.querySelector("#startDate")?.value || "";
    const endDate = document.querySelector("#endDate")?.value || "";
    const roadId = document.querySelector("#roadFilter")?.value || "all";

    const filters = {
      start_date: startDate,
      end_date: endDate,
      road_id: roadId
    };

    const result = await getPeakHourAnalyticsLogs(filters);

    if(!result || (!result.peak && !result.lowest)) {
      document.querySelector("#peakHourValue").textContent = "--";
      document.querySelector("#highestFlowValue").textContent = "--";
      document.querySelector("#averagePeakSpeedValue").textContent = "--";

      document.querySelector("#lowestHourValue").textContent = "--";
      document.querySelector("#lowestFlowValue").textContent = "--";
      document.querySelector("#lowestSpeedValue").textContent = "--";

      document.querySelector("#peakHourChart").innerHTML = "No traffic records found.";

      return;
    }

    const peakHour = result.peak;
    const lowestHour = result.lowest;

    const isBarangayWide = roadId === "all";
    const title = document.querySelector("#peakHourTitle");
    const description = document.querySelector("#peakHourDescription");

    if(isBarangayWide) {
      title.textContent = "Barangay Peak Hour Analytics";
      description.textContent = "Shows the busiest and lowest traffic periods across all monitored roads.";
    } else {
      const roadName = peakHour?.road_name || lowestHour?.road_name || "Selected Road";
      title.textContent = `${roadName} Peak Hour Analytics`;
      description.textContent = `Shows the busiest and lowest traffic periods for ${roadName}.`;
    }

    function formatHour(hour) {
      const start = new Date();
      start.setHours(hour, 0, 0, 0);

      const end = new Date();
      end.setHours(hour + 1, 0, 0, 0);

      const startText = start.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit"
      });

      const endText = end.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit"
      });

      return `${startText} - ${endText}`;
    }

    if(peakHour) {
      document.querySelector("#peakHourValue").textContent = formatHour(peakHour.traffic_hour);

      document.querySelector("#highestFlowValue").textContent = `${Number(peakHour.avg_vehicle_flow).toFixed(0)} vehicles/min`;

      document.querySelector("#averagePeakSpeedValue").textContent = `${Number(peakHour.avg_speed).toFixed(0)} km/h`;
    }

    if(lowestHour) {
      document.querySelector("#lowestHourValue").textContent = formatHour(lowestHour.traffic_hour);

      document.querySelector("#lowestFlowValue").textContent = `${Number(lowestHour.avg_vehicle_flow).toFixed(0)} vehicles/min`;

      document.querySelector("#lowestSpeedValue").textContent = `${Number(lowestHour.avg_speed).toFixed(0)} km/h`;
    }
  }

  await loadPeakAnalytics();

  document.querySelector("#startDate")?.addEventListener("change", loadPeakAnalytics);
  document.querySelector("#endDate")?.addEventListener("change", loadPeakAnalytics);
  document.querySelector("#roadFilter")?.addEventListener("change", loadPeakAnalytics);
}