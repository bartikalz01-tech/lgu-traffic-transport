export function renderAccidentSummary(container) {

  container.innerHTML = `
    <div class="accident-summary-card">
      <div class="accident-summary-icon">
        <i class="fas fa-car-crash"></i>
      </div>

      <div class="accident-summary-info">
        <span>Total Accidents</span>
        <strong>24</strong>
        <small>All recorded cases</small>
      </div>
    </div>

    <div class="accident-summary-card">
      <div class="accident-summary-icon active">
        <i class="fas fa-folder-open"></i>
      </div>

      <div class="accident-summary-info">
        <span>Active Cases</span>
        <strong>7</strong>
        <small>Cases requiring attention</small>
      </div>
    </div>

    <div class="accident-summary-card">
      <div class="accident-summary-icon resolved">
        <i class="fas fa-check-circle"></i>
      </div>
      <div class="accident-summary-info">
        <span>Resolved Cases</span>
        <strong>17</strong>
        <small>Successfully resolved</small>
      </div>
    </div>
  `;

}