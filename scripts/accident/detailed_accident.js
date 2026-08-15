export function detailedAccidentReport(
  container,
  accidentDetail
) {

  const snapshotUrl = accidentDetail.snapshot_filename
    ? `http://127.0.0.1:5001/accident_evidence/snapshots/file/${encodeURIComponent(
        accidentDetail.snapshot_filename
      )}`
    : null;


  const statusClass = accidentDetail.status
    .toLowerCase()
    .replace(/\s+/g, "-");


  container.innerHTML = `

    <div class="detailed-accident-modal">

      <div class="detailed-accident-header">

        <div>

          <span class="detailed-accident-label">
            Accident Case
          </span>

          <h2>
            Accident Report Details
          </h2>

          <span class="detailed-accident-public-id">
            ${accidentDetail.public_accident_id}
          </span>

        </div>

        <button
          type="button"
          class="detailed-accident-close"
          id="closeDetailedAccident"
        >
          <i class="fas fa-times"></i>
        </button>

      </div>


      <div class="detailed-accident-body">


        <!-- CCTV SNAPSHOT -->

        <div class="detailed-accident-evidence">

          <div class="detailed-section-header">

            <div>
              <h3>
                <i class="fas fa-camera"></i>
                CCTV Evidence
              </h3>

              <p>
                Snapshot captured from the associated CCTV camera.
              </p>
            </div>

          </div>


          <div class="detailed-snapshot-container">

            ${
              snapshotUrl
                ? `
                  <img
                    src="${snapshotUrl}"
                    class="detailed-accident-snapshot"
                    alt="Accident CCTV Snapshot"
                  >
                `
                : `
                  <div class="no-snapshot-state">

                    <i class="fas fa-image"></i>

                    <h4>No Snapshot Available</h4>

                    <p>
                      No CCTV snapshot was attached
                      to this accident report.
                    </p>

                  </div>
                `
            }

          </div>

        </div>

        <div class="detailed-accident-recording">
          <div class="detailed-section-header">
            <div class="recording-section-heading">
              <div>
                <h3><i class="fas fa-video"></i> Recorded CCTV Evidence</h3>
                <p>Historical CCTV footage surrounding the reported accident time.</p>
              </div>

              <span class="recording-status-badge">
                <i class="fas fa-clock"></i>
                2-Minute Window
              </span>
            </div>
          </div>

          <div class="recording-time-window">
            <div class="recording-time-item">
              <span class="recording-time-label">
                Recording Start
              </span>

              <strong id="recordingFromTime">
                2 mins before report 
              </strong>
            </div>

            <div class="recording-time-arrow">
              <i class="fas fa-arrow-right"></i>
            </div>

            <div class="recording-time-item">
              <span class="recording-time-label">
                Accident Report Time
              </span>

              <strong id="recordingToTime">
                ${accidentDetail.reported_at}
              </strong>
            </div>
          </div>

          <div class="recorded-video-container">
            <div class="recorded-video-empty" id="recordedVideoEmpty"">
              <div class="recorded-video-icon">
                <i class="fas fa-film"></i>
              </div>

              <h4>Accident Recording Not Loaded</h4>

              <p>
                The CCTV recording covering the two minutes 
                before the accident report will appear here.
              </p>

              <button type="button" class="recording-load-btn" id="loadAccidentRecordingBtn">
                <i class="fas fa-video"></i> Load Accident Recording
              </button>
            </div>

            <video id="accidentRecordingVideo" class="recorded-accident-video" controls preload="metadata">
              <source src="..." type="video/mp4">

              Your browser does not support HTML5 video playback.
            </video>
          </div>
        </div>

        <div class="recording-information">
          <div class="recording-information-item">
            <i class="fas fa-camera"></i>

            <div>
              <span>Camera</span>

              <strong>${accidentDetail.recording_camera || "Associated CCTV Camera"}</strong>
            </div>
          </div>

          <div class="recording-information-item">
            <i class="fas fa-clock"></i>

            <div>
              <span>Requested Window</span>
              <strong>2 minutes before accident report</strong>
            </div>
          </div>

          <div class="recording-information-item">
            <i class="fas fa-file-video"></i>

            <div>
              <span>Recording File</span>

              <strong>${accidentDetail.recording_filename || "Not generated yet"}</strong>
            </div>
          </div>
        </div>


        <!-- ACCIDENT INFORMATION -->

        <div class="detailed-accident-information">

          <div class="detailed-section-header">

            <div>
              <h3>
                <i class="fas fa-info-circle"></i>
                Accident Information
              </h3>

              <p>
                Details recorded for this accident case.
              </p>
            </div>

          </div>


          <div class="detailed-info-grid">

            <div class="detailed-info-item">

              <span class="detailed-info-label">
                Public Accident ID
              </span>

              <strong>
                ${accidentDetail.public_accident_id}
              </strong>

            </div>


            <div class="detailed-info-item">

              <span class="detailed-info-label">
                Road / Street
              </span>

              <strong>
                ${accidentDetail.road_name}
              </strong>

            </div>


            <div class="detailed-info-item">

              <span class="detailed-info-label">
                Accident Date
              </span>

              <strong>
                ${accidentDetail.accident_date}
              </strong>

            </div>


            <div class="detailed-info-item">

              <span class="detailed-info-label">
                Accident Time
              </span>

              <strong>
                ${accidentDetail.accident_time}
              </strong>

            </div>


            <div class="detailed-info-item">

              <span class="detailed-info-label">
                Accident Type
              </span>

              <strong>
                ${accidentDetail.accident_type}
              </strong>

            </div>


            <div class="detailed-info-item">

              <span class="detailed-info-label">
                Specific Location
              </span>

              <strong>
                ${accidentDetail.specific_location || "-"}
              </strong>

            </div>


            <div class="detailed-info-item">

              <span class="detailed-info-label">
                Status
              </span>

              <span class="accident-status ${statusClass}">
                ${accidentDetail.status}
              </span>

            </div>

          </div>

        </div>


        <!-- REPORT METADATA -->

        <div class="detailed-accident-metadata">

          <div class="detailed-section-header">

            <div>
              <h3>
                <i class="fas fa-clock"></i>
                Report Information
              </h3>
            </div>

          </div>


          <div class="metadata-grid">

            <div>

              <span>
                Reported At
              </span>

              <strong>
                ${accidentDetail.reported_at}
              </strong>

            </div>


            <div>

              <span>
                Last Updated
              </span>

              <strong>
                ${accidentDetail.updated_at}
              </strong>

            </div>

          </div>

        </div>

      </div>


      <div class="detailed-accident-footer">

        <button
          type="button"
          class="detailed-close-btn"
          id="closeDetailedAccidentFooter"
        >
          Close
        </button>

      </div>

    </div>

  `;


  // Show overlay
  container.classList.remove(
    "detailed-reports-hidden"
  );


  // Close buttons
  const closeBtn =
    container.querySelector("#closeDetailedAccident");

  const closeFooterBtn =
    container.querySelector("#closeDetailedAccidentFooter");


  const closeModal = () => {

    container.classList.add(
      "detailed-reports-hidden"
    );

  };


  closeBtn.addEventListener(
    "click",
    closeModal
  );

  closeFooterBtn.addEventListener(
    "click",
    closeModal
  );


  // Close when clicking outside the modal
  container.addEventListener("click", event => {

    if (event.target === container) {
      closeModal();
    }

  });

  const recordedVideo = container.querySelector("#accidentRecordingVideo");
  const recordedVideoEmpty = container.querySelector("#recordedVideoEmpty");
  const recordingLoadingMessage = container.querySelector("#recordingLoadingMessage");
  const recordingLoadingSpinner = container.querySelector("#recordingLoadingSpinner");
  const loadRecordingBtn = container.querySelector("#loadAccidentRecordingBtn");
  
  recordedVideo.style.display = "none";

  loadRecordingBtn.style.display = "none";

  async function loadAccidentRecording() {
    const cameraName = accidentDetail.recording_camera;
    const reportedAt = accidentDetail.reported_at;

    if(!cameraName) {
      recordingLoadingMessage.textContent = "No CCTV camera is associated with this accident report.";
      recordingLoadingSpinner.style.display = "none";
      loadRecordingBtn.style.display = "inline-flex";
      loadRecordingBtn.innerHTML = ` <i class="fas fa-video"></i> Retry Recording `;

      return;
    }

    if(!reportedAt) {
      recordingLoadingMessage.textContent = "The accident report does not contain a valid report timestamp.";
      recordingLoadingSpinner.style.display = "none";
      loadRecordingBtn.style.display = "inline-flex";

      return;
    }

    recordingLoadingMessage.textContent = "Generating the CCTV footage covering the two minutes before the accident report...";

    recordingLoadingSpinner.style.display = "block";

    loadRecordingBtn.style.display = "none";

    try {
      const response = await fetch(`http://127.0.0.1:5001/accident_evidence/recording/${encodeURIComponent(cameraName)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            reported_at: reportedAt
          })
        }
      );

      const result = await response.json();

      if(!response.ok || !result.success) {
        throw new Error(result.message || "Failed to create accident recording");
      }

      console.log("[ACCIDENT] Recording generated: ", result);

      const recordingUrl = `http://127.0.0.1:5001/recording/file/${encodeURIComponent(result.filename)}`;

      const recordingFromTime = container.querySelector("#recordingFromTime");
      
      const recordingToTime = container.querySelector("#recordingToTime");;
      
      if(recordingFromTime) {
        recordingFromTime.textContent = result.from_time;
      }

      if(recordingToTime) {
        recordingToTime.textContent = result.to_time;
      }

      const recordingFileName = container.querySelector("recordingFileName");

      if(recordingFileName) {
        recordingFilename.textContent = result.filename;
      }

      recordedVideo.src = recordingUrl;

      recordedVideo.load();

      recordedVideoEmpty.style.display = "none";

      recordedVideo.style.display = "block";

    } catch(error) {
      console.error( "[ACCIDENT] Failed to load recording:", error );

      recordingLoadingMessage.textContent = error.message || "Unable to generate the accident recording.";

      recordingLoadingSpinner.style.display = "none";

      loadRecordingBtn.style.display = "inline-flex";

      loadRecordingBtn.innerHTML = ` <i class="fas fa-redo"></i> Retry Recording `;
    }
  }

  loadRecordingBtn.addEventListener("click", () => {
    loadAccidentRecording
  });

  loadAccidentRecording();

}