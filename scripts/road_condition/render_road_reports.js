import { renderTrafficTrend } from "./road_reports/traffic_trend_overtime.js";
import { renderCongestionFrequency } from "./road_reports/congestion_frequency.js";

export function roadReports(container) {
  container.innerHTML = `
    <div class="road-report-toolbar">

      <div class="toolbar-left">
        <div class="filter-group">
          <label>Date Range</label>
          <input type="date" id="startDate">
        </div>

        <div class="filter-group">
          <label>To</label>
          <input type="date" id="endDate">
        </div>

        <div class="filter-group">
          <label>Road</label>
          <select id="roadFilter">
            <option value="all">All Roads</option>
          </select>
        </div>

      </div>

      <button class="export-btn">
        <i class="fas fa-file-pdf"></i>
        Export PDF
      </button>

    </div>

    <div id="reportContent"></div>
  `

  const reportContent =  container.querySelector('#reportContent');

  return reportContent;
}