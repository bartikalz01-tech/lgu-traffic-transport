export function renderPeakHour(container) {
  container.innerHTML = `
    <div class="traffic-report-header">
      <h2>Peak Hour Analytics</h2>
      <p>
        Detects the busiest traffic periods based on
        vehicle count, congestion level, and average speed.
      </p>
    </div>

    <div class="peak-hour-layout">
      <div class="traffic-chart-panel">
        <div class="panel-title">
          Peak Hour Distribution
        </div>

        <div class="chart-placeholder">
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
            <span class="summary-value">5:00 PM - 6:00 PM</span>
          </div>

           <div class="summary-card warning">
            <span class="summary-label">Highest Vehicle Flow</span>
            <span class="summary-value">214 vehicles/min</span>
          </div>

          <div class="summary-card info">
            <span class="summary-label">Average Peak Speed</span>
            <span class="summary-value">21 km/h</span>
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
            <span class="summary-value">5:00 PM - 6:00 PM</span>
          </div>

           <div class="summary-card success success">
            <span class="summary-label">Lowest Vehicle Flow</span>
            <span class="summary-value">214 vehicles/min</span>
          </div>

          <div class="summary-card primary">
            <span class="summary-label">Average Speed</span>
            <span class="summary-value">21 km/h</span>
          </div>
        </div>
      </div>
    </div>
  `;
}