import {
  getCctvHistoricalRecords
} from "../data/road_condition/fetch_road_condition.js";


export async function renderCctvRecords(container) {

  container.innerHTML = `

    <div class="cctv-records-page">

      <div class="cctv-records-header">

        <div>

          <div class="cctv-records-title-row">

            <div class="cctv-records-title-icon">
              <i class="fas fa-film"></i>
            </div>

            <div>

              <h2 class="cctv-records-title">
                CCTV Records
              </h2>

              <p class="cctv-records-subtitle">
                Historical surveillance recordings captured by the CCTV monitoring system.
              </p>

            </div>

          </div>

        </div>


        <button
          type="button"
          class="btn btn-primary cctv-records-refresh-btn"
          id="refreshCctvRecordsBtn"
        >
          <i class="fas fa-rotate"></i>
          Refresh
        </button>

      </div>


      <!-- ========================= -->
      <!-- SUMMARY -->
      <!-- ========================= -->

      <div class="cctv-records-summary">

        <div class="cctv-record-summary-card">

          <div class="cctv-record-summary-icon">
            <i class="fas fa-video"></i>
          </div>

          <div>

            <span>
              Total Recordings
            </span>

            <strong id="cctvTotalRecordings">
              0
            </strong>

          </div>

        </div>


        <div class="cctv-record-summary-card">

          <div class="cctv-record-summary-icon">
            <i class="fas fa-clock"></i>
          </div>

          <div>

            <span>
              Total Duration
            </span>

            <strong id="cctvTotalDuration">
              0 min
            </strong>

          </div>

        </div>


        <div class="cctv-record-summary-card">

          <div class="cctv-record-summary-icon">
            <i class="fas fa-camera"></i>
          </div>

          <div>

            <span>
              Cameras
            </span>

            <strong id="cctvTotalCameras">
              0
            </strong>

          </div>

        </div>

      </div>


      <!-- ========================= -->
      <!-- FILTERS -->
      <!-- ========================= -->

      <div class="cctv-records-filter-card">

        <div class="cctv-records-filter-group">

          <label for="cctvRecordSearch">
            Search
          </label>

          <div class="cctv-record-input-wrap">

            <i class="fas fa-search"></i>

            <input
              type="text"
              id="cctvRecordSearch"
              placeholder="Search camera or filename..."
            />

          </div>

        </div>


        <div class="cctv-records-filter-group">

          <label for="cctvRecordCamera">
            Camera
          </label>

          <select id="cctvRecordCamera">

            <option value="all">
              All Cameras
            </option>

          </select>

        </div>


        <div class="cctv-records-filter-group">

          <label for="cctvRecordStartDate">
            From
          </label>

          <input
            type="date"
            id="cctvRecordStartDate"
          />

        </div>


        <div class="cctv-records-filter-group">

          <label for="cctvRecordEndDate">
            To
          </label>

          <input
            type="date"
            id="cctvRecordEndDate"
          />

        </div>


        <button
          type="button"
          class="btn btn-secondary cctv-record-reset-btn"
          id="resetCctvRecordsBtn"
        >
          <i class="fas fa-filter-circle-xmark"></i>
          Reset
        </button>

      </div>


      <!-- ========================= -->
      <!-- RECORDINGS -->
      <!-- ========================= -->

      <div
        class="cctv-records-list-card"
        id="cctvRecordsList"
      >

        <div class="cctv-records-loading">

          <i class="fas fa-spinner fa-spin"></i>

          <span>
            Loading CCTV records...
          </span>

        </div>

      </div>

    </div>


    <!-- ========================= -->
    <!-- VIDEO MODAL -->
    <!-- ========================= -->

    <div
      class="cctv-recording-modal hidden"
      id="cctvRecordingModal"
    >

      <div class="cctv-recording-modal-backdrop"></div>


      <div class="cctv-recording-modal-content">

        <div class="cctv-recording-modal-header">

          <div>

            <strong id="cctvModalTitle">
              Historical Recording
            </strong>

            <span id="cctvModalSubtitle">
              CCTV Recording
            </span>

          </div>


          <button
            type="button"
            class="cctv-recording-modal-close"
            id="closeCctvRecordingModal"
          >

            <i class="fas fa-times"></i>

          </button>

        </div>


        <div class="cctv-recording-player">

          <video
            id="cctvHistoricalVideo"
            controls
            preload="metadata"
          >

            Your browser does not support HTML5 video.

          </video>

        </div>


        <div class="cctv-recording-modal-footer">

          <div>

            <span id="cctvModalFrom"></span>

            <span class="cctv-modal-separator">
              →
            </span>

            <span id="cctvModalTo"></span>

          </div>

          <span id="cctvModalDuration"></span>

        </div>

      </div>

    </div>

  `;


  const searchInput =
    container.querySelector(
      "#cctvRecordSearch"
    );

  const cameraSelect =
    container.querySelector(
      "#cctvRecordCamera"
    );

  const startDateInput =
    container.querySelector(
      "#cctvRecordStartDate"
    );

  const endDateInput =
    container.querySelector(
      "#cctvRecordEndDate"
    );

  const list =
    container.querySelector(
      "#cctvRecordsList"
    );

  const totalRecordings =
    container.querySelector(
      "#cctvTotalRecordings"
    );

  const totalDuration =
    container.querySelector(
      "#cctvTotalDuration"
    );

  const totalCameras =
    container.querySelector(
      "#cctvTotalCameras"
    );


  const refreshBtn =
    container.querySelector(
      "#refreshCctvRecordsBtn"
    );

  const resetBtn =
    container.querySelector(
      "#resetCctvRecordsBtn"
    );


  const modal =
    container.querySelector(
      "#cctvRecordingModal"
    );

  const video =
    container.querySelector(
      "#cctvHistoricalVideo"
    );

  const modalTitle =
    container.querySelector(
      "#cctvModalTitle"
    );

  const modalSubtitle =
    container.querySelector(
      "#cctvModalSubtitle"
    );

  const modalFrom =
    container.querySelector(
      "#cctvModalFrom"
    );

  const modalTo =
    container.querySelector(
      "#cctvModalTo"
    );

  const modalDuration =
    container.querySelector(
      "#cctvModalDuration"
    );

  const closeModalBtn =
    container.querySelector(
      "#closeCctvRecordingModal"
    );

  let records = [];


  function formatDuration(seconds) {

    seconds = Number(seconds || 0);

    if (seconds < 60) {
      return `${seconds}s`;
    }

    const minutes =
      Math.floor(seconds / 60);

    const remainingSeconds =
      seconds % 60;

    if (minutes < 60) {

      return remainingSeconds
        ? `${minutes}m ${remainingSeconds}s`
        : `${minutes}m`;
    }

    const hours =
      Math.floor(minutes / 60);

    const remainingMinutes =
      minutes % 60;

    return remainingMinutes
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  }


  function formatDateTime(value) {

    if (!value) {
      return "-";
    }

    const date =
      new Date(
        value.replace(" ", "T")
      );

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
      }
    );
  }


  function updateSummary(data) {

    const total =
      data.length;

    const duration =
      data.reduce(
        (sum, record) =>
          sum +
          Number(
            record.duration_seconds || 0
          ),
        0
      );

    const cameras =
      new Set(
        data.map(
          record =>
            record.camera_name
        )
      );


    totalRecordings.textContent =
      total;

    totalDuration.textContent =
      formatDuration(duration);

    totalCameras.textContent =
      cameras.size;
  }


  function populateCameraFilter(data) {

    const currentValue =
      cameraSelect.value;

    const cameras =
      [...new Set(
        data.map(
          record =>
            record.camera_name
        )
      )].sort();

    cameraSelect.innerHTML = `
      <option value="all">
        All Cameras
      </option>

      ${cameras.map(camera => `
        <option value="${camera}">
          ${camera}
        </option>
      `).join("")}
    `;

    if (
      cameras.includes(currentValue)
    ) {
      cameraSelect.value =
        currentValue;
    }
  }


  function renderRecords(data) {

    updateSummary(data);


    if (!data.length) {

      list.innerHTML = `

        <div class="cctv-records-empty">

          <div class="cctv-records-empty-icon">
            <i class="fas fa-film"></i>
          </div>

          <h3>
            No CCTV recordings found
          </h3>

          <p>
            There are no historical recordings matching the current filters.
          </p>

        </div>

      `;

      return;
    }


    list.innerHTML = `

      <div class="cctv-record-table-wrapper">

        <table class="cctv-record-table">

          <thead>

            <tr>

              <th>
                Camera
              </th>

              <th>
                Recording
              </th>

              <th>
                Recorded From
              </th>

              <th>
                Recorded To
              </th>

              <th>
                Duration
              </th>

              <th>
                Action
              </th>

            </tr>

          </thead>


          <tbody>

            ${data.map((record, index) => `

              <tr>

                <td>

                  <div class="cctv-record-camera">

                    <div class="cctv-record-camera-icon">
                      <i class="fas fa-camera"></i>
                    </div>

                    <div>

                      <strong>
                        ${record.camera_name}
                      </strong>

                      <small>
                        CCTV Recording
                      </small>

                    </div>

                  </div>

                </td>


                <td>

                  <div class="cctv-record-filename">

                    <i class="fas fa-file-video"></i>

                    <span>
                      ${record.recording_filename}
                    </span>

                  </div>

                </td>


                <td>
                  ${formatDateTime(record.recording_from)}
                </td>


                <td>
                  ${formatDateTime(record.recording_to)}
                </td>


                <td>

                  <span class="cctv-duration-badge">
                    <i class="fas fa-clock"></i>
                    ${formatDuration(record.duration_seconds)}
                  </span>

                </td>


                <td>

                  <button
                    type="button"
                    class="btn btn-primary btn-sm view-cctv-record-btn"
                    data-index="${index}"
                  >

                    <i class="fas fa-play"></i>
                    View

                  </button>

                </td>

              </tr>

            `).join("")}

          </tbody>

        </table>

      </div>

    `;


    list.querySelectorAll(".view-cctv-record-btn").forEach(button => {

      button.addEventListener("click", () => {

        const record =data[Number(button.dataset.index)];

        openRecording(record);

      });
      
    });
  }


  function openRecording(record) {

    const filename =
      record.recording_filename;

    const sourceUrl =
      `http://127.0.0.1:5001/recording/file/${encodeURIComponent(filename)}`;


    modalTitle.textContent =
      record.camera_name;

    modalSubtitle.textContent =
      "Historical CCTV Recording";

    modalFrom.textContent =
      formatDateTime(
        record.recording_from
      );

    modalTo.textContent =
      formatDateTime(
        record.recording_to
      );

    modalDuration.textContent =
      formatDuration(
        record.duration_seconds
      );


    video.src =
      sourceUrl;

    modal.classList.remove(
      "hidden"
    );

    video.load();

  }


  function closeModal() {

    video.pause();

    video.removeAttribute(
      "src"
    );

    video.load();

    modal.classList.add(
      "hidden"
    );

  }


  async function loadRecords() {

    list.innerHTML = `

      <div class="cctv-records-loading">

        <i class="fas fa-spinner fa-spin"></i>

        <span>
          Loading CCTV records...
        </span>

      </div>

    `;


    try {

      records =
        await getCctvHistoricalRecords({
          camera_name:
            cameraSelect.value,

          start_date:
            startDateInput.value,

          end_date:
            endDateInput.value,

          search:
            searchInput.value.trim()
        });


      populateCameraFilter(records);

      renderRecords(records);

    } catch(error) {

      console.error(
        "CCTV records error:",
        error
      );


      list.innerHTML = `

        <div class="cctv-records-error">

          <i class="fas fa-triangle-exclamation"></i>

          <strong>
            Unable to load CCTV records
          </strong>

          <span>
            ${error.message}
          </span>

        </div>

      `;

    }

  }


  refreshBtn.addEventListener(
    "click",
    loadRecords
  );


  resetBtn.addEventListener(
    "click",
    () => {

      searchInput.value = "";

      cameraSelect.value = "all";

      startDateInput.value = "";

      endDateInput.value = "";

      loadRecords();

    }
  );


  [
    searchInput,
    cameraSelect,
    startDateInput,
    endDateInput
  ]
  .forEach(input => {

    input.addEventListener(
      "change",
      loadRecords
    );

  });


  searchInput.addEventListener(
    "keyup",
    event => {

      if (
        event.key === "Enter"
      ) {

        loadRecords();

      }

    }
  );


  closeModalBtn.addEventListener(
    "click",
    closeModal
  );


  modal
    .querySelector(
      ".cctv-recording-modal-backdrop"
    )
    .addEventListener(
      "click",
      closeModal
    );


  await loadRecords();
}