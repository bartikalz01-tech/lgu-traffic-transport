export function renderTrafficTrend(container) {
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

          <div class="chart-placeholder">
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

              <tbody id="trafficReportTableBody">
                <tr>
                  <td>Aug 04, 2026</td>
                  <td>Rizal Avenue</td>
                  <td>32 km/h</td>
                  <td>186 veh/min</td>
                  <td><span class="traffic-badge high">High</span></td>
                </tr>

                <tr>
                  <td>Aug 04, 2026</td>
                  <td>Mabini Street</td>
                  <td>41 km/h</td>
                  <td>121 veh/min</td>
                  <td><span class="traffic-badge medium">Medium</span></td>
                </tr>

                <tr>
                  <td>Aug 04, 2026</td>
                  <td>Bonifacio Road</td>
                  <td>58 km/h</td>
                  <td>73 veh/min</td>
                  <td><span class="traffic-badge low">Low</span></td>
                </tr>

                <tr>
                  <td>Aug 03, 2026</td>
                  <td>National Highway</td>
                  <td>29 km/h</td>
                  <td>214 veh/min</td>
                  <td><span class="traffic-badge high">High</span></td>
                </tr>

                <tr>
                  <td>Aug 03, 2026</td>
                  <td>Quezon Street</td>
                  <td>47 km/h</td>
                  <td>108 veh/min</td>
                  <td><span class="traffic-badge medium">Medium</span></td>
                </tr>

                <tr>
                  <td>Aug 02, 2026</td>
                  <td>Rizal Avenue</td>
                  <td>61 km/h</td>
                  <td>64 veh/min</td>
                  <td><span class="traffic-badge low">Low</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}