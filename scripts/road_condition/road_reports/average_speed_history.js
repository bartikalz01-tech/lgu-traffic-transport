export function renderAverageSpeedHistory(container) {

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

            <tbody>
              <tr class="speed-high">
                <td>Aug 05, 2026</td>
                <td>Rizal Avenue</td>
                <td>65 km/h</td>
                <td>82 km/h</td>
                <td>54 km/h</td>
                <td><span class="speed-badge high">High</span></td>
              </tr>

              <tr class="speed-medium">
                <td>Aug 05, 2026</td>
                <td>Mabini Street</td>
                <td>43 km/h</td>
                <td>59 km/h</td>
                <td>31 km/h</td>
                <td><span class="speed-badge medium">Moderate</span></td>
              </tr>

              <tr class="speed-low">
                <td>Aug 05, 2026</td>
                <td>National Highway</td>
                <td>18 km/h</td>
                <td>35 km/h</td>
                <td>8 km/h</td>
                <td><span class="speed-badge low">Low</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

}