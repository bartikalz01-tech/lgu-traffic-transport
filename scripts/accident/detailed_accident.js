function formatAccidentDateTime(dateTime) {

  if (!dateTime) {
    return {
      date: "-",
      time: "-",
      dateTime: "-"
    };
  }

  const date = new Date(
    dateTime.replace(" ", "T")
  );

  if (isNaN(date.getTime())) {
    return {
      date: dateTime,
      time: "",
      dateTime: dateTime
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


export function detailedAccidentReport(
  container,
  accidentDetail
) {

  /*
   * ----------------------------------------
   * FORMAT DATE / TIME DATA
   * ----------------------------------------
   */

  const detectedDateTime =
    formatAccidentDateTime(
      accidentDetail.detected_at
    );

  const reportedDateTime =
    formatAccidentDateTime(
      accidentDetail.reported_at
    );

  const updatedDateTime =
    formatAccidentDateTime(
      accidentDetail.updated_at
    );

  const recordingFrom =
    formatAccidentDateTime(
      accidentDetail.recording_from
    );

  const recordingTo =
    formatAccidentDateTime(
      accidentDetail.recording_to
    );


  /*
   * ----------------------------------------
   * CCTV URLS
   * ----------------------------------------
   */

  const snapshotUrl =
    accidentDetail.snapshot_filename
      ? `http://127.0.0.1:5001/accident_evidence/snapshots/file/${encodeURIComponent(
          accidentDetail.snapshot_filename
        )}`
      : null;


  const recordingUrl =
    accidentDetail.recording_filename
      ? `http://127.0.0.1:5001/recording/file/${encodeURIComponent(
          accidentDetail.recording_filename
        )}`
      : null;


  /*
   * ----------------------------------------
   * STATUS
   * ----------------------------------------
   */

  const status =
    accidentDetail.status || "Reported";

  const statusClass =
    status
      .toLowerCase()
      .replace(/\s+/g, "-");


  /*
   * ----------------------------------------
   * RENDER MODAL
   * ----------------------------------------
   */

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


        <!-- CCTV RECORDING -->

        <!--<div class="detailed-accident-recording">

          <div class="detailed-section-header">

            <div>

              <h3>
                <i class="fas fa-film"></i>
                CCTV Historical Recording
              </h3>

              <p>
                Historical footage associated with this accident.
              </p>

            </div>

          </div>


          <div class="detailed-recording-container">

            ${
              recordingUrl
                ? `
                  <video
                    class="detailed-accident-recording-video"
                    controls
                    preload="metadata"
                    playsinline
                  >

                    <source
                      src="${recordingUrl}"
                      type="video/mp4"
                    >

                    Your browser does not support
                    HTML5 video playback.

                  </video>
                `
                : `
                  <div class="no-recording-film">

                    <i class="fas fa-film"></i>

                    <h4>
                      No Historical Recording Available
                    </h4>

                    <p>
                      A CCTV recording has not yet been
                      attached to this accident case.
                    </p>

                  </div>
                `
            }

          </div>


          ${
            recordingUrl
              ? `
                <div class="detailed-recording-meta">

                  <div>

                    <span>
                      Recording File
                    </span>

                    <strong>
                      ${accidentDetail.recording_filename}
                    </strong>

                  </div>


                  <div>

                    <span>
                      From
                    </span>

                    <strong>
                      ${recordingFrom.dateTime}
                    </strong>

                  </div>


                  <div>

                    <span>
                      To
                    </span>

                    <strong>
                      ${recordingTo.dateTime}
                    </strong>

                  </div>

                </div>
              `
              : ""
          }

        </div>-->


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
                ${accidentDetail.road_name || "-"}
              </strong>

            </div>


            <div class="detailed-info-item">

              <span class="detailed-info-label">
                Accident Date
              </span>

              <strong>
                ${detectedDateTime.date}
              </strong>

            </div>


            <div class="detailed-info-item">

              <span class="detailed-info-label">
                Accident Time
              </span>

              <strong>
                ${detectedDateTime.time}
              </strong>

            </div>


            <div class="detailed-info-item">

              <span class="detailed-info-label">
                Accident Type
              </span>

              <strong>
                ${accidentDetail.accident_type || "-"}
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
                ${status}
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
                Detection Time
              </span>

              <strong>
                ${detectedDateTime.dateTime}
              </strong>

            </div>


            <div>

              <span>
                Reported At
              </span>

              <strong>
                ${reportedDateTime.dateTime}
              </strong>

            </div>


            <div>

              <span>
                Last Updated
              </span>

              <strong>
                ${updatedDateTime.dateTime}
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


  /*
   * ----------------------------------------
   * SHOW OVERLAY
   * ----------------------------------------
   */

  container.classList.remove(
    "detailed-reports-hidden"
  );


  /*
   * ----------------------------------------
   * CLOSE BUTTONS
   * ----------------------------------------
   */

  const closeBtn =
    container.querySelector(
      "#closeDetailedAccident"
    );

  const closeFooterBtn =
    container.querySelector(
      "#closeDetailedAccidentFooter"
    );


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


  /*
   * ----------------------------------------
   * CLOSE WHEN CLICKING OUTSIDE
   * ----------------------------------------
   */

  container.addEventListener(
    "click",
    event => {

      if(event.target === container) {
        closeModal();
      }

    }
  );

}