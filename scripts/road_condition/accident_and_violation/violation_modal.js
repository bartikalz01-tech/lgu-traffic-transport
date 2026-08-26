import { insertViolationReport } from "../../data/violation_report/fetch_violations.js";

export async function openViolationModal(container, road) {

  let snapshotFileName = null;

  let snapshotCloudinaryUrl = null;

  container.innerHTML = `
    <div class="violation-modal">

      <!-- HEADER -->
      <div class="violation-modal-header">

        <div>
          <div class="violation-modal-title">
            <i class="fas fa-triangle-exclamation"></i>
            Violation Report
          </div>

          <div class="violation-modal-subtitle">
            Report a traffic or transport violation observed through CCTV.
          </div>
        </div>

        <button
          type="button"
          class="violation-close-btn"
          id="closeViolationModalBtn"
        >
          <i class="fas fa-times"></i>
        </button>

      </div>


      <!-- BODY -->
      <div class="violation-modal-body">

        <!-- VIOLATION INFORMATION -->
        <section class="violation-section">

          <div class="violation-section-header">
            <div>
              <h3>Violation Information</h3>
              <p>Provide the details of the observed violation.</p>
            </div>
          </div>


          <div class="violation-form-grid">

            <!-- ROAD -->
            <div class="violation-form-group">

              <label>Road</label>

              <div class="violation-readonly-field">
                <i class="fas fa-road"></i>
                <span>${road.road_name}</span>
              </div>

            </div>


            <!-- CAMERA -->
            <div class="violation-form-group">

              <label>CCTV Camera</label>

              <div class="violation-readonly-field">
                <i class="fas fa-video"></i>
                <span>${road.camera_name ?? road.video_filename}</span>
              </div>

            </div>


            <!-- VIOLATION TYPE -->
            <div class="violation-form-group">

              <label for="violationType">
                Violation Type
                <span class="required">*</span>
              </label>

              <select id="violationType" required>

                <option value="">
                  Select violation type
                </option>

                <option value="Illegal Parking">
                  Illegal Parking
                </option>

                <option value="Road Obstruction">
                  Road Obstruction
                </option>

                <option value="Route Violation">
                  Route Violation
                </option>

              </select>

            </div>

            <div class="violation-form-group">
              <label for="subjectType">
                Subject Type
                <span class="required"> * </span>
              </label>

              <select id="subjectType" required>
                <option value="Vehicle">
                  Vehicle
                </option>

                <option value="Person">
                  Person
                </option>

                <option value="Unknown">
                  Unknown
                </option>
              </select>
            </div>


            <!-- DATE/TIME -->
            <div class="violation-form-group">

              <label for="violationDatetime">
                Date & Time
                <span class="required">*</span>
              </label>

              <input
                type="datetime-local"
                id="violationDatetime"
                required
              />

            </div>


            <!-- PLATE -->
            <div class="violation-form-group subject-field vehicle-field hidden" id="vehiclePlateField">

              <label for="plateNumber">
                Plate Number

                <span class="required"> * </span>
              </label>

              <input
                type="text"
                id="plateNumber"
                maxlength="20"
                placeholder="e.g. ABC 1234"
              />

            </div>


            <!-- VEHICLE TYPE -->
            <div class="violation-form-group subject-field vehicle-field hidden" id="vehicleTypeField">

              <label for="vehicleType">
                Vehicle Type
              </label>

              <select id="vehicleType">

                <option value="">
                  Select vehicle type
                </option>

                <option value="Private Car">
                  Private Car
                </option>

                <option value="Motorcycle">
                  Motorcycle
                </option>

                <option value="Tricycle">
                  Tricycle
                </option>

                <option value="Jeepney">
                  Jeepney
                </option>

                <option value="Bus">
                  Bus
                </option>

                <option value="Truck">
                  Truck
                </option>

                <option value="Van">
                  Van
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>


            <!-- LOCATION DETAILS -->
            <div class="violation-form-group full-width">

              <label for="locationDetails">
                Location Details
              </label>

              <input
                type="text"
                id="locationDetails"
                maxlength="255"
                placeholder="e.g. Near the barangay entrance / eastbound lane"
              />

            </div>


            <!-- DESCRIPTION -->
            <div class="violation-form-group full-width">

              <label for="violationDescription">
                Description
              </label>

              <textarea
                id="violationDescription"
                rows="4"
                placeholder="Describe what was observed..."
              ></textarea>

            </div>

          </div>

        </section>


        <!-- CCTV EVIDENCE -->
        <section class="violation-section">

          <div class="violation-section-header">

            <div>
              <h3>CCTV Evidence</h3>
              <p>
                Capture a snapshot from the current CCTV feed as evidence.
              </p>
            </div>

            <span class="evidence-status" id="evidenceStatus">
              No snapshot captured
            </span>

          </div>


          <div class="violation-cctv-container">

            <div class="violation-cctv-preview">

              <img
                id="violationCctvPreview"
                src="http://127.0.0.1:5001/video/${road.video_filename}"
                alt="CCTV live feed"
              />

              <div class="violation-cctv-overlay">
                <span>
                  <i class="fas fa-circle"></i>
                  LIVE
                </span>

                <span>
                  ${road.road_name}
                </span>
              </div>

            </div>


            <div class="violation-evidence-actions">

              <button
                type="button"
                class="btn btn-primary"
                id="captureViolationSnapshotBtn"
              >
                <i class="fas fa-camera"></i>
                Capture Snapshot
              </button>

            </div>


            <div
              class="violation-snapshot-preview hidden"
              id="violationSnapshotPreview"
            >

              <div class="snapshot-header">

                <div>
                  <i class="fas fa-image"></i>
                  Captured Evidence
                </div>

                <button
                  type="button"
                  class="snapshot-remove-btn"
                  id="removeViolationSnapshotBtn"
                >
                  <i class="fas fa-times"></i>
                </button>

              </div>

              <img
                id="capturedViolationSnapshot"
                alt="Captured CCTV evidence"
              />

            </div>

          </div>

        </section>

      </div>


      <!-- FOOTER -->
      <div class="violation-modal-footer">

        <div class="violation-footer-info">
          <i class="fas fa-circle-info"></i>
          This report will be submitted for verification.
        </div>

        <div class="violation-footer-actions">

          <button
            type="button"
            class="btn btn-secondary"
            id="cancelViolationBtn"
          >
            Cancel
          </button>

          <button
            type="button"
            class="btn btn-info"
            id="submitViolationBtn"
          >
            <i class="fas fa-paper-plane"></i>
            Submit Violation Report
          </button>

        </div>

      </div>

    </div>
  `;


  // Close modal
  const closeModal = () => {
    container.innerHTML = "";
    container.classList.add("violation-hidden-overlay");
  };


  document
    .getElementById("closeViolationModalBtn")
    .addEventListener("click", closeModal);

  document
    .getElementById("cancelViolationBtn")
    .addEventListener("click", closeModal);


  // Open modal
  container.classList.remove("violation-hidden-overlay");

  const subjectType = container.querySelector("#subjectType");

  const vehiclePlateField = container.querySelector("#vehiclePlateField");
  const vehicleTypeField = container.querySelector("#vehicleTypeField");

  const plateNumber = container.querySelector("#plateNumber");

  const vehicleType = container.querySelector("#vehicleType");

  const captureSnapshotBtn = container.querySelector("#captureViolationSnapshotBtn");

  const snapshotPreview = container.querySelector("#violationSnapshotPreview");

  const capturedSnapshot = container.querySelector("#capturedViolationSnapshot");

  const evidenceStatus = container.querySelector("#evidenceStatus");

  subjectType.addEventListener("change", () => {
    const type = subjectType.value;

    vehiclePlateField.classList.add("hidden");

    vehicleTypeField.classList.add("hidden");

    plateNumber.required = false;

    if(type === "Vehicle") {
      vehiclePlateField.classList.remove("hidden");
      vehicleTypeField.classList.remove("hidden");

      plateNumber.required = true;
    }
  });

  // Set current date/time
  const now = new Date();

  const localDateTime =
    new Date(
      now.getTime() - now.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 16);

  container.querySelector("#violationDatetime").value = localDateTime;

  captureSnapshotBtn.addEventListener("click", async () => {

    evidenceStatus.textContent =
      "Capturing snapshot...";

    captureSnapshotBtn.disabled = true;

    try {

      captureSnapshotBtn.disabled = true;

      captureSnapshotBtn.innerHTML = `
        <i class="fas fa-spinner fa-spin"></i>
        Capturing...
      `;

      const response = await fetch(`http://127.0.0.1:5001/violation_evidence/snapshots/${encodeURIComponent(road.video_filename)}`, {
        method: "POST"
      });

      const data = await response.json();

      if(!data.success) {
        throw new Error(data.message);
      }

      snapshotFileName = data.filename;

      snapshotCloudinaryUrl = data.cloudinary_url || null;

      capturedSnapshot.src = `http://127.0.0.1:5001/violation_evidence/snapshots/file/${encodeURIComponent(data.filename)}`;;

      capturedSnapshot.dataset.filename = data.filename;

      snapshotPreview.classList.remove("hidden");

      evidenceStatus.textContent = `Snapshot Captured - ${data.captured_at}`;

    } catch(error) {

      console.error(
        "Snapshot capture error:",
        error
      );

      evidenceStatus.textContent =
        "Failed to capture snapshot";

    } finally {

      captureSnapshotBtn.disabled = false;

      captureSnapshotBtn.innerHTML = `<i class="fas fa-camera"></i> Capture Snapshot `;

    }

  });

  container.querySelector('#removeViolationSnapshotBtn').addEventListener("click", () => {
    snapshotFileName = null;

    capturedSnapshot.removeAttribute("src");
    delete capturedSnapshot.dataset.filename;

    snapshotPreview.classList.add("hidden");

    evidenceStatus.textContent = "No snapshot captured";
  });

  const submitViolationBtn = document.getElementById("submitViolationBtn");
  submitViolationBtn.addEventListener("click", async () => {
    const violationType = document.getElementById("violationType").value;
    const violationDatetime = document.getElementById("violationDatetime").value;
    const locationDetails = document.getElementById("locationDetails").value.trim();
    const description = document.getElementById("violationDescription").value.trim();
    const selectedSubjectType = subjectType.value;

    if(!violationType) {
      alert("Please select a violation type");
      return;
    }

    if(!selectedSubjectType) {
      alert("Please Select the subject type.");

      return
    }

    if(!violationDatetime) {
      alert("Please select the violation date and time");
      return;
    }

    const violationData = {
      road_id: road.road_id,
      subject_type: selectedSubjectType,
      violation_type: violationType,
      violation_datetime: violationDatetime.replace("T", " ") + ":00",
      location_details: locationDetails || null,
      plate_number: selectedSubjectType === "Vehicle" 
        ? plateNumber.value.trim().toUpperCase() : null,
      vehicle_type: selectedSubjectType === "Vehicle"
        ? (vehicleType.value || null) : null,
      description: description || null,
      evidence: capturedSnapshot.dataset.filename || null,
      cloudinary_url: snapshotCloudinaryUrl,
    };

    submitViolationBtn.disabled = true;

    submitViolationBtn.innerHTML = `
      <i class="fas fa-spinner fa-spin"></i>
      Submitting...
    `;

    try {
      const result = await insertViolationReport(violationData);

      console.log("Violation report submitted:", result);

      alert("Violation report submitted successfully");

      container.innerHTML = "";
      container.classList.add("violation-hidden-overlay");

    } catch(error) {
      console.error("Failed to submit violation", error);
      alert(error.message || "Failed to submit violation report");
    }
  });

}