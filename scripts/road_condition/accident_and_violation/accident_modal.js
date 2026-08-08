export function openAccidentModal(container) {
  container.innerHTML = `
    <div class="form-panel">
      <div class="accident-modal-header">
        <div class="accident-modal-title">
          <div class="accident-icon">
            <i class="fas fa-car-crash"></i>
          </div>

          <div>
            <h3>Accident Report</h3>
            <p>Record and document a road accident incident.</p>
          </div>
        </div>
      </div>

      <div class="form-section">
        <div class="section-header">
          <h4><i class="fas fa-info-circle"></i> Accident Details</h4>
          <span class="section-badge">
            Required Information
          </span>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Road/Street</label>
            <input type="text" class="form-control" id="roadName" value="Susano Road" readonly>
          </div>
          <div class="form-group">
            <label class="form-label">Camera Name</label>
            <input type="text" class="form-control" id="cameraName" value="CAM-Susano Rd-NODE-01" readonly>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Accident Date</label>
            <input type="date" class="form-control" id="accidentDate">
          </div>
          <div class="form-group">
            <label class="form-label">Accident Time</label>
            <input type="time" class="form-control" id="accidentTime">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Accident Type</label>
            <input type="text" class="form-control" id="accidentType">
          </div>
          <div class="form-group">
            <label class="form-label">Specific Location</label>
            <input type="text" class="form-control" id="specificLocation">
          </div>
        </div>
      </div>

      <div class="form-section">
        <div class="section-header">
          <h4><i class="fas fa-video"></i> CCTV Evidence</h4>
          <span class="section-badge evidence">
            Evidence
          </span>
        </div>

        <div class="cctv-section">
          <div class="cctv-empty-state">

            <div class="cctv-empty-icon">
              <i class="fas fa-video"></i>
            </div>

            <h5>CCTV Evidence</h5>

            <p>
              CCTV recording and incident snapshots
              will be attached here.
            </p>

          </div>
        </div>
      </div>

      <div class="form-actions">
        <button class="btn btn-danger" id="exitAccidentBtn">
          Cancel
        </button>
        <button class="btn btn-success" id="submitAccidentReport">
          Submit
        </button>
      </div>
    </div>
  `

  container.classList.remove("accident-hidden-overlay")

  const exitBtn = container.querySelector("#exitAccidentBtn");

  exitBtn.addEventListener("click", () => {
    container.classList.add("accident-hidden-overlay");
  });
}