export function renderAccidentSummary(container) {

  container.innerHTML = `
    <div class="accident-summary-card total">
      <div class="accident-summary-icon">
        <i class="fas fa-car-crash"></i>
      </div>

      <div class="accident-summary-info">
        <span>Total Accidents</span>
        <strong>24</strong>
        <small>All recorded reports</small>
      </div>
    </div>


    <div class="accident-summary-card reported">
      <div class="accident-summary-icon">
        <i class="fas fa-exclamation-triangle"></i>
      </div>

      <div class="accident-summary-info">
        <span>Reported</span>
        <strong>5</strong>
        <small>Awaiting response</small>
      </div>
    </div>


    <div class="accident-summary-card dispatched">
      <div class="accident-summary-icon">
        <i class="fas fa-truck-medical"></i>
      </div>

      <div class="accident-summary-info">
        <span>Dispatched</span>
        <strong>4</strong>
        <small>Responders deployed</small>
      </div>
    </div>


    <div class="accident-summary-card on-scene">
      <div class="accident-summary-icon">
        <i class="fas fa-location-dot"></i>
      </div>

      <div class="accident-summary-info">
        <span>On Scene</span>
        <strong>3</strong>
        <small>Responders arrived</small>
      </div>
    </div>


    <div class="accident-summary-card cleared">
      <div class="accident-summary-icon">
        <i class="fas fa-circle-check"></i>
      </div>

      <div class="accident-summary-info">
        <span>Cleared</span>
        <strong>12</strong>
        <small>Response completed</small>
      </div>
    </div>
  `;

}