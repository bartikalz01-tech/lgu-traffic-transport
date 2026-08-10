export function renderAccidentSummary(container, accidentDetails = []) {

  const totalAccidents = accidentDetails.length;
  
  const reportedCount = accidentDetails.filter(
    accident => String(accident.status ?? "").trim().toLowerCase() === "reported"
  ).length;
  
  const dispatchedCount = accidentDetails.filter(
    accident => String(accident.status ?? "").trim().toLowerCase() === "dispatched"
  ).length;

  const onSceneCount = accidentDetails.filter(
    accident => String(accident.status ?? "").trim().toLowerCase() === "on scene"
  ).length;

  const clearedCount = accidentDetails.filter(
    accident => String(accident.status ?? "").trim().toLowerCase() === "cleared"
  ).length;

  container.innerHTML = `
    <div class="accident-summary-card total">
      <div class="accident-summary-icon">
        <i class="fas fa-car-crash"></i>
      </div>

      <div class="accident-summary-info">
        <span>Total Accidents</span>
        <strong>${totalAccidents}</strong>
        <small>All recorded reports</small>
      </div>
    </div>


    <div class="accident-summary-card reported">
      <div class="accident-summary-icon">
        <i class="fas fa-exclamation-triangle"></i>
      </div>

      <div class="accident-summary-info">
        <span>Reported</span>
        <strong>${reportedCount}</strong>
        <small>Awaiting response</small>
      </div>
    </div>


    <div class="accident-summary-card dispatched">
      <div class="accident-summary-icon">
        <i class="fas fa-truck-medical"></i>
      </div>

      <div class="accident-summary-info">
        <span>Dispatched</span>
        <strong>${dispatchedCount}</strong>
        <small>Responders deployed</small>
      </div>
    </div>


    <div class="accident-summary-card on-scene">
      <div class="accident-summary-icon">
        <i class="fas fa-location-dot"></i>
      </div>

      <div class="accident-summary-info">
        <span>On Scene</span>
        <strong>${onSceneCount}</strong>
        <small>Responders arrived</small>
      </div>
    </div>


    <div class="accident-summary-card cleared">
      <div class="accident-summary-icon">
        <i class="fas fa-circle-check"></i>
      </div>

      <div class="accident-summary-info">
        <span>Cleared</span>
        <strong>${clearedCount}</strong>
        <small>Response completed</small>
      </div>
    </div>
  `;

}