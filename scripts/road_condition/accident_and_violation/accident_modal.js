import { insertAccidentReport } from "../../data/accident_report/fetch_accidents.js";


function formatAccidentDateTime(detectedAt) {
  if (!detectedAt) {
    return {
      date: "",
      time: "",
      dateTime: ""
    };
  }

  // Convert MySQL datetime:
  // "2026-08-31 14:35:22"
  // into something JavaScript can parse.
  const date = new Date(detectedAt.replace(" ", "T"));

  if (isNaN(date.getTime())) {
    return {
      date: "",
      time: "",
      dateTime: detectedAt
    };
  }

  return {
    date: date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }),

    time: date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    }),

    dateTime: date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    })
  };
}


function automaticSpecificLocation(roadName) {

  switch (roadName?.trim()) {

    case "Susano Road":
      return "Long road connected to Don Alejandro and Asuncion Street";

    case "Don Alejandro Street":
      return "Intersection on Susano Road near exit to Barangay San Agustin";

    case "Del Rey":
      return "Near Santo Niño Street";

    case "Santo Niño Street":
      return "Roads intersecting Del Rey and Don Alejandro Streets";

    default:
      return "Location based on detected CCTV road";
  }
}


export function openAccidentModal(container, accident) {

  let snapshotFileName = accident.snapshot_filename || null;

  const formattedDateTime = formatAccidentDateTime(accident.detected_at);

  const automaticLocation = automaticSpecificLocation(accident.road_name);

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
            <input type="text" class="form-control" id="roadName" value="${accident.road_name}" readonly>
          </div>
          <div class="form-group">
            <label class="form-label">Camera Name</label>
            <input type="text" class="form-control" id="cameraName" value="CAM-${accident.road_name}-${accident.camera_name}" readonly>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Accident Date</label>
            <input type="text" class="form-control" id="accidentDate" value="${formattedDateTime.date}" readonly>
          </div>
          <div class="form-group">
            <label class="form-label">Accident Time</label>
            <input type="text" class="form-control" id="accidentTime" value="${formattedDateTime.time}" readonly>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Accident Type</label>
            <input type="text" class="form-control" id="accidentType">
          </div>
          <div class="form-group">
            <label class="form-label">Specific Location</label>
            <input type="text" class="form-control" id="specificLocation" value="${automaticLocation}" readonly>
          </div>
        </div>
      </div>

      <div class="form-section">
        <div class="section-header">
          <h4><i class="fas fa-video"></i> CCTV Evidence</h4>
          <span class="section-badge evidence">
            Detection Evidence
          </span>
        </div>

        <div class="cctv-section">
          ${
            snapshotFileName ? `
              <div class="cctv-snapshot-preview" id="snapshotPreview">
                <img 
                  id="accidentSnapshot" 
                  src="http://127.0.0.1:5001/accident_evidence/snapshots/file/${encodeURIComponent(snapshotFileName)}"
                  alt="Accident CCTV Snapshot"
                >

                <div class="snapshot-meta">
                  <div>
                    <i class"fas fa-clock"></i>
                    <span id="snapshotCapturedAt">
                      ${accident.detected_at}
                    </span>
                  </div>

                  <span class="snapshot-status">
                    Detection Snapshot
                  </span>
                </div>
              </div>
            `
            : `
              <div class="cctv-empty-state" id="cctvEmptyState">
                <div class="cctv-empty-icon">
                  <i class="fas fa-video"></i>
                </div>

                <h5>No Snapshot Available</h5>

                <p>
                  No CCTV snapshot was attached to this detection.
                </p>
              </div>
            `
          }
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

  /*const captureBtn = container.querySelector("#captureSnapshotBtn");
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

      const response = await fetch(`http://127.0.0.1:5001/accident_evidence/snapshots/${encodeURIComponent(road.video_filename)}`,
        {
          method: "POST"
        }
      );

      const data = await response.json();

      if(!data.success) {
        throw new Error(data.message);
      }

      snapshotFileName = data.filename;

      snapshotImage.src = `http://127.0.0.1:5001/accident_evidence/snapshots/file/${encodeURIComponent(data.filename)}`;

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
  });*/


  const submitAccidentBtn = document.getElementById("submitAccidentReport");

  submitAccidentBtn.addEventListener("click", async () => {
  
    const accidentType = container.querySelector("#accidentType").value.trim();
    const specificLocation = container.querySelector("#specificLocation").value.trim();

    if (!accidentType) {
      Swal.fire({
        icon: "warning",
        title: "Accident Type Required",
        text: "Please specify the type of accident before submitting.",
        confirmButtonText: "OK"
      });

      return;
    }

    const accidentData = {
      accident_detection_id: accident.accident_detection_id,
      accident_type: accidentType,
      specific_location: specificLocation
    };

    try {
      submitAccidentBtn.disabled = true;

      Swal.fire({
        title: "Submitting Accident Report",
        text: "Please wait...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const data = await insertAccidentReport(accidentData);

      await Swal.fire({
        icon: "success",
        title: "Accident Report Submitted",
        text: "The accident report has been successfully recorded",
        confirmButtonText: "OK"
      });

      container.classList.add("accident-hidden-overlay");

    } catch(error) {

      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error.message || "Unable to submit accident report.",
        confirmButtonText: "OK"
      });

    } finally {
      submitAccidentBtn.disabled = false;
    }
  });


  const exitBtn = container.querySelector("#exitAccidentBtn");

  exitBtn.addEventListener("click", () => {
    container.classList.add("accident-hidden-overlay");
  });
}