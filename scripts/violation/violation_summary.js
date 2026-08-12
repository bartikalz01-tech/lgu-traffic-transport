export function renderViolationSummaryReports(container) {

  container.innerHTML = `
    <div class="violation-summary-card total">
      <div class="violation-summary-icon total">
        <i class="fas fa-file-lines"></i>
      </div>

      <div class="violation-summary-content">
        <span>Total Reports</span>
        <strong>128</strong>
        <small>All violation reports</small>
      </div>
    </div>

    <div class="violation-summary-card">
      <div class="violation-summary-icon pending">
        <i class="fas fa-clock"></i>
      </div>

      <div class="violation-summary-content">
        <span>Pending Review</span>
        <strong>24</strong>
        <small>Awaiting hearing</small>
      </div>
    </div>

    <div class="violation-summary-card">
      <div class="violation-summary-icon verified">
        <i class="fas fa-circle-check"></i>
      </div>

      <div class="violation-summary-content">
        <span>Verified</span>
        <strong>91</strong>
        <small>Confirmed violations</small>
      </div>
    </div>

    <div class="violation-summary-card">
      <div class="violation-summary-icon rejected">
        <i class="fas fa-circle-xmark"></i>
      </div>

      <div class="violation-summary-content">
        <span>Rejected</span>
        <strong>13</strong>
        <small>Not confirmed</small>
      </div>
    </div>
  `;

}