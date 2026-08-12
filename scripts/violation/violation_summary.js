export function renderViolationSummaryReports(container, violationDetails= []) {

  const totalViolations = violationDetails.length;

  const pendingCount = violationDetails.filter(
    violation => String(violation.status ?? "").trim().toLowerCase() === "pending review"
  ).length;

  const verifiedCount = violationDetails.filter(
    violation => String(violation.status ?? "").trim().toLowerCase() === "verified"
  ).length;

  const rejectedCount = violationDetails.filter(
    violation => String(violation.status ?? "").trim().toLowerCase() === "rejected"
  ).length;

  container.innerHTML = `
    <div class="violation-summary-card total">
      <div class="violation-summary-icon total">
        <i class="fas fa-file-lines"></i>
      </div>

      <div class="violation-summary-content">
        <span>Total Reports</span>
        <strong>${totalViolations}</strong>
        <small>All violation reports</small>
      </div>
    </div>

    <div class="violation-summary-card">
      <div class="violation-summary-icon pending">
        <i class="fas fa-clock"></i>
      </div>

      <div class="violation-summary-content">
        <span>Pending Review</span>
        <strong>${pendingCount}</strong>
        <small>Awaiting hearing</small>
      </div>
    </div>

    <div class="violation-summary-card">
      <div class="violation-summary-icon verified">
        <i class="fas fa-circle-check"></i>
      </div>

      <div class="violation-summary-content">
        <span>Verified</span>
        <strong>${verifiedCount}</strong>
        <small>Confirmed violations</small>
      </div>
    </div>

    <div class="violation-summary-card">
      <div class="violation-summary-icon rejected">
        <i class="fas fa-circle-xmark"></i>
      </div>

      <div class="violation-summary-content">
        <span>Rejected</span>
        <strong>${rejectedCount}</strong>
        <small>Not confirmed</small>
      </div>
    </div>
  `;

}