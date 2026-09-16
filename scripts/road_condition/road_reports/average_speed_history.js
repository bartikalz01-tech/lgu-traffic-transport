import { getAverageSpeedHistoryLogs } from "../../data/road_condition/fetch_road_condition.js";
import { renderAverageSpeedHistoryChart } from "./road_report_charts/average_speed_history_chart.js";

// Maximum physically plausible city-road speed
const MAX_PLAUSIBLE_SPEED_KMH = 80;


function parseMySQLDateTime(dateTime) {

  if (!dateTime) {
    return null;
  }

  return new Date(
    dateTime.replace(" ", "T")
  );

}

function formatReportDateTime(dateTime) {

  const date = parseMySQLDateTime(dateTime);

  if (!date || Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });

}


function getSpeedStatus(speed) {

  let status = "Low";
  let statusClass = "low";

  if (speed >= 50) {

    status = "High";
    statusClass = "high";

  } else if (speed >= 30) {

    status = "Moderate";
    statusClass = "medium";

  }

  return {
    status,
    statusClass
  };

}


export async function renderAverageSpeedHistory(container) {

  container.innerHTML = `

    <div class="traffic-report-header">

      <h2>Average Speed History</h2>

      <p>
        Shows how average vehicle speed changes over time.
      </p>

    </div>


    <div class="traffic-report-layout">


      <!-- =====================================================
           CHART
      ====================================================== -->

      <div class="traffic-chart-panel">

        <div class="panel-title">
          Average Speed Trend
        </div>


        <div class="traffic-chart-scroll">

          <div class="traffic-chart-inner">

            <canvas id="averageSpeedHistoryChart"></canvas>

          </div>

        </div>

      </div>


      <!-- =====================================================
           TABLE
      ====================================================== -->

      <div class="traffic-table-layout">

        <div class="panel-title">
          Average Speed Records
        </div>


        <div class="table-wrapper">

          <table class="traffic-report-table">

            <thead>

              <tr>

                <th>Date & Time</th>

                <th>Road</th>

                <th>Average Speed</th>

                <th>Status</th>

              </tr>

            </thead>


            <tbody id="averageSpeedHistoryTableBody"></tbody>

          </table>

        </div>

      </div>


    </div>

  `;


  const tbody =
    container.querySelector(
      "#averageSpeedHistoryTableBody"
    );


  const chartCanvas =
    container.querySelector(
      "#averageSpeedHistoryChart"
    );


  async function loadAverageSpeedHistory() {

    const filters = {

      start_date:
        document.querySelector("#startDate")?.value || "",

      end_date:
        document.querySelector("#endDate")?.value || "",

      road_id:
        document.querySelector("#roadFilter")?.value || "all"

    };


    const logs =
      await getAverageSpeedHistoryLogs(filters);


    tbody.innerHTML = "";


    // =========================================================
    // NO DATA
    // =========================================================

    if (!logs || logs.length === 0) {

      tbody.innerHTML = `

        <tr>

          <td colspan="4">
            No average speed records found.
          </td>

        </tr>

      `;

      return;

    }


    // =========================================================
    // FILTER INVALID SPEED READINGS
    // =========================================================

    const validLogs = [];

    let discardedCount = 0;


    logs.forEach(log => {

      const speed =
        Number(log.avg_speed);


      if (Number.isNaN(speed)) {

        discardedCount++;

        return;

      }


      if (
        speed < 0 ||
        speed > MAX_PLAUSIBLE_SPEED_KMH
      ) {

        discardedCount++;

        return;

      }


      validLogs.push({
        ...log,
        avg_speed: speed
      });

    });


    if (discardedCount > 0) {

      console.warn(

        `Average Speed History: discarded `
        + `${discardedCount} implausible reading(s) `
        + `(negative or above `
        + `${MAX_PLAUSIBLE_SPEED_KMH} km/h).`

      );

    }


    // =========================================================
    // NO VALID DATA
    // =========================================================

    if (validLogs.length === 0) {

      tbody.innerHTML = `

        <tr>

          <td colspan="4">
            No valid average speed records found.
          </td>

        </tr>

      `;

      return;

    }


    // =========================================================
    // CHART DATA
    //
    // Chart needs chronological order.
    // =========================================================

    const chartLogs = [...validLogs].sort(

      (a, b) => {

        return (
          parseMySQLDateTime(a.recorded_at)
          -
          parseMySQLDateTime(b.recorded_at)
        );

      }

    );


    // =========================================================
    // TABLE DATA
    //
    // Keep newest records first.
    // =========================================================

    const tableLogs = [...validLogs].sort(

      (a, b) => {

        return (
          parseMySQLDateTime(b.recorded_at)
          -
          parseMySQLDateTime(a.recorded_at)
        );

      }

    );


    // =========================================================
    // TABLE
    // =========================================================

    tableLogs.forEach(log => {

      const speed =
        Number(log.avg_speed);


      const {
        status,
        statusClass
      } = getSpeedStatus(speed);

      tbody.innerHTML += `

        <tr>

          <td>
            ${formatReportDateTime(log.recorded_at)}
          </td>


          <td>
            ${log.road_name}
          </td>


          <td>
            ${speed.toFixed(2)} km/h
          </td>


          <td>

            <span class="speed-badge ${statusClass}">
              ${status}
            </span>

          </td>

        </tr>

      `;

    });


    // =========================================================
    // CHART
    // =========================================================

    renderAverageSpeedHistoryChart(
      chartCanvas,
      chartLogs
    );

  }


  // ===========================================================
  // INITIAL LOAD
  // ===========================================================

  await loadAverageSpeedHistory();


  // ===========================================================
  // FILTER EVENTS
  // ===========================================================

  document
    .querySelector("#startDate")
    ?.addEventListener(
      "change",
      loadAverageSpeedHistory
    );


  document
    .querySelector("#endDate")
    ?.addEventListener(
      "change",
      loadAverageSpeedHistory
    );


  document
    .querySelector("#roadFilter")
    ?.addEventListener(
      "change",
      loadAverageSpeedHistory
    );

}