export function renderViolationSummaryReports(container, violationDetails= []) {

  const totalViolations = violationDetails.length;

  const pendingCount = violationDetails.filter(
    violation => String(violation.status ?? "").trim().toLowerCase() === "pending review"
  ).length;

  const firstOffenseCount = violationDetails.filter(
    violation => String(violation.status ?? "").trim().toLowerCase() === "first offense"
  ).length;

  const secondOffenseCount = violationDetails.filter(
    violation => String(violation.status ?? "").trim().toLowerCase() === "second offense"
  ).length;

  const thirdOffenseCount = violationDetails.filter(
    violation => String(violation.status ?? "").trim().toLowerCase() === "third offense"
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
      <div class="violation-summary-icon first-offense">
        <i class="fas fa-triangle-exclamation"></i>
      </div>

      <div class="violation-summary-content">
        <span>First Offense</span>
        <strong>${firstOffenseCount}</strong>
        <small>First verified offense</small>
      </div>
    </div>

    <div class="violation-summary-card">
      <div class="violation-summary-icon second-offense">
        <i class="fas fa-triangle-exclamation"></i>
      </div>

      <div class="violation-summary-content">
        <span>Rejected</span>
        <strong>${secondOffenseCount}</strong>
        <small>Second verified offense</small>
      </div>
    </div>

    <div class="violation-summary-card">
      <div class="violation-summary-icon third-offense">
        <i class="fas fa-gavel"></i>
      </div>

      <div class="violation-summary-content">
        <span>Third Offense</span>
        <strong>${thirdOffenseCount}</strong>
        <small>Subject to escalation</small>
      </div>
    </div>
  `;

}