export function openAccidentModal(container, road) {
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
          <div class="cctv-empty-state" id="cctvEmptyState">

            <div class="cctv-empty-icon">
              <i class="fas fa-video"></i>
            </div>

            <h5>CCTV Evidence</h5>

            <p>
              CCTV recording and incident snapshots
              will be attached here.
            </p>

            <button type="button" class="btn btn-primary" id="captureSnapshotBtn">
              <i class="fas fa-camera"></i>
              Capture Snapshot
            </button>
          </div>

          <div class="cctv-snapshot-preview hidden" id="snapshotPreview">
            <img id="accidentSnapshot" src="" alt="Accident CCTV Snapshot">
            <div class="snapshot-meta">
              <div>
                <i class="fas fa-clock"></i>
                <span id="snapshotCapturedAt"></span>
              </div>

              <span class="snapshot-status">
                Snapshot Captured
              </span>
            </div>

            <button type="button" class="btn btn-secondary" id="retakeSnapshotBtn">
              <i class="fas fa-camera"></i>
              Retake Snapshot
            </button>
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

  const captureBtn = container.querySelector("#captureSnapshotBtn");
  const snapshotPreview = container.querySelector("#snapshotPreview");
  const emptyState = container.querySelector("#cctvEmptyState");
  const snapshotImage = container.querySelector("#accidentSnapshot");
  const snapshotCapturedAt = container.querySelector("#snapshotCapturedAt");

  captureBtn.addEventListener("click", async () => {
    try {
      captureBtn.disabled = true;

      captureBtn.innerHTML = `
        <i class="fas fa-spinner fa-spin"></i>
        Capturing...
      `;

      const response = await fetch(`http://127.0.0.1:5001/snapshot/${encodeURIComponent(road.video_filename)}`,
        {
          method: "POST"
        }
      );

      const data = await response.json();

      if(!data.success) {
        throw new Error(data.message);
      }

      console.log("Snapshot captured:", data);

      snapshotImage.src = `http://127.0.0.1:5001/accident_snapshot/${encodeURIComponent(data.filename)}`;

      snapshotCapturedAt.textContent = data.captured_at;

      emptyState.classList.add("hidden");
      snapshotPreview.classList.remove("hidden");

    } catch(error) {
      console.error("Snapshot error:", error);

      alert("Unable to capture CCTV snapshot.");

    } finally {
      captureBtn.disabled = false;

      captureBtn.innerHTML = `
        <i class="fas fa-camera"></i>
        Capture Snapshot
      `;
    }
  });


  const exitBtn = container.querySelector("#exitAccidentBtn");

  exitBtn.addEventListener("click", () => {
    container.classList.add("accident-hidden-overlay");
  });
}