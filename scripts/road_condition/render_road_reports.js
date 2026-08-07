import { renderTrafficTrend } from "./road_reports/traffic_trend_overtime.js";
import { renderCongestionFrequency } from "./road_reports/congestion_frequency.js";
import { getCctvAiDetails } from "../data/road_condition/fetch_road_condition.js";

export async function roadReports(container) {
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

  const reportContent = container.querySelector('#reportContent');

  const roads = await getCctvAiDetails();

  const roadFilter = container.querySelector("#roadFilter");
  roads.forEach(road => {

    const option = document.createElement("option");

    option.value = road.road_id;
    option.textContent = road.road_name;
    
    roadFilter.appendChild(option);

  });

  return reportContent;
}