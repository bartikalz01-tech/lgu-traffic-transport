export function renderCongestionFrequency(container) {

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

              <tbody>
                <tr>
                  <td>Rizal Avenue</td>
                  <td>12</td>
                  <td>28</td>
                  <td>43</td>
                  <td>80%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

}