import { updateVerificationStatus } from "../data/violation_report/fetch_violations.js";

export function renderViolationDetailModal(container, violation) {

  function getVerificationConfig(status) {

    switch (String(status ?? "").trim()) {

      case "Pending Review":
        return {
          className: "verification-pending",
          icon: "fas fa-clock",
          label: "Pending Review",
          footerMessage: "This violation report is awaiting verification."
        };

      case "Verified":
        return {
          className: "verification-verified",
          icon: "fas fa-circle-check",
          label: "Verified",
          footerMessage: "This violation has been verified and the offense level has been determined."
        };

      case "Rejected":
        return {
          className: "verification-rejected",
          icon: "fas fa-circle-xmark",
          label: "Rejected",
          footerMessage: "This violation report was rejected and will not proceed as a confirmed violation."
        };

      default:
        return {
          className: "",
          icon: "fas fa-circle-question",
          label: "Unknown"
        };
    }
  }

  function getOffenseConfig(level) {

    switch (String(level ?? "").trim()) {

      case "First Offense":
        return {
          className: "first-offense",
          icon: "fas fa-1"
        };

      case "Second Offense":
        return {
          className: "second-offense",
          icon: "fas fa-2"
        };

      case "Third Offense":
        return {
          className: "third-offense",
          icon: "fas fa-gavel"
        };

      default:
        return {
          className: "not-assigned",
          icon: "fas fa-minus"
        };
    }
  }

  function getViolationTypeConfig(type) {
    switch (String(type ?? "").trim()) {

      case "Illegal Parking":
        return {
          className: "parking",
          icon: "fas fa-square-parking",
          label: "Illegal Parking"
        };

      case "Road Obstruction":
        return {
          className: "obstruction",
          icon: "fas fa-road-barrier",
          label: "Road Obstruction"
        };

      case "Route Violation":
        return {
          className: "route",
          icon: "fas fa-route",
          label: "Route Violation"
        };

      default:
        return {
          className: "",
          icon: "fas fa-circle-question",
          label: type || "Unknown Violation"
        };
    }
  }


  const dateTime = violation?.violation_datetime
    ? new Date(violation.violation_datetime)
    : null;

  const dateText = dateTime
    ? dateTime.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      })
    : "-";

  const timeText = dateTime
    ? dateTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit"
      })
    : "-";

  const verificationConfig = getVerificationConfig(violation?.verification_status);

  const offenseConfig = getOffenseConfig(violation?.offense_level);
  const typeConfig = getViolationTypeConfig(violation?.violation_type);

  //const evidenceFilename = violation?.file_name ?? null;
  const evidenceUrl = violation?.cloudinary_url ?? null;

  container.innerHTML = `
    <div class="detailed-report-modal">
      <div class="detailed-report-header">
        <div class="detailed-report-header-left">
          <div class="detailed-report-icon">
            <i class="fas fa-triangle-exclamation"></i>
          </div>

          <div>
            <div class="detailed-report-title">
              Violation Report
            </div>

            <div class="detailed-report-subtitle">
              Detailed traffic and transport violation record
            </div>
          </div>
        </div>

        <button type="button" class="detailed-report-close-btn" id="closeDetailedViolationBtn" aria-label="Close violation report">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="detailed-report-summary">
        <div class="detailed-report-reference">
          <span class="detailed-report-reference-label">
            Report Reference
          </span>

          <strong class="detailed-report-reference-id">
            ${violation.public_violation_id ?? "-"}
          </strong>
        </div>

        <div id="violationStatusContainer" class="detailed-report-status ${verificationConfig.className}">
          <i id="violationStatusIcon" class="${verificationConfig.icon}"></i>
          <div>
            <span class="detailed-report-status-label">
              Status
            </span>
            <select id="violationStatusSelect" class="detailed-report-status-select">
              <option value="Pending Review" ${violation.verification_status === "Pending Review" ? "selected" : ""}>
                Pending Review
              </option>
              <option value="Verified" ${violation.verification_status === "Verified" ? "selected" : ""}>
                Verified
              </option>
              <option value="Rejected" ${violation.verification_status === "Rejected" ? "selected" : ""}>
                Rejected
              </option>
            </select>
          </div>
        </div>

        <div id="violationOffenseContainer" class="detailed-report-status ${offenseConfig.className}">
          <i id="violationOffenseIcon" class="${offenseConfig.icon}"></i>
          <div>
            <span class="detailed-report-status-label">
              Offense Level
            </span>

            <strong id="violationOffenseLevel">
              ${violation.offense_level ?? "Not Assigned"}
            </strong>
          </div>
        </div>
      </div>

      <div class="detailed-report-body">
        <section class="detailed-report-section">
          <div class="detailed-report-section-header">
            <div class="detailed-report-section-icon"> 
              <i class="fas fa-circle-info"></i> 
            </div>

            <div>
              <h3>Violation Information</h3>
              <p>Details recorded when the violation was reported.</p>
            </div>
          </div>

          <div class="detailed-report-grid">
            <div class="detailed-report-field">
              <span class="detailed-report-field-label">Violation ID</span>
              <strong>${violation.public_violation_id}</strong>
            </div>

            <div class="detailed-report-field">
              <span class="detailed-report-field-label">Violation Type</span>
              <span class="detailed-report-type-badge ${typeConfig.className}">
                <i class="${typeConfig.icon}"></i>
                ${typeConfig.label}
              </span>
            </div>

            <div class="detailed-report-field">
              <span class="detailed-report-field-label">
                Road / Street
              </span>

              <strong>${violation.road_name}</strong>
            </div>

            <div class="detailed-report-field">
              <span class="detailed-report-field-label">Date & Time</span>
              <strong>
                ${dateText}
                <small>${timeText}</small>
              </strong>
            </div>

            <div class="detailed-report-field full-width">
              <span class="detailed-report-field-label">Location Details</span>
              <div class="detailed-report-text-box">
                ${violation.location_details}
              </div>
            </div>
          </div>
        </section>

        <section class="detailed-report-section">
          <div class="detailed-report-section-header">
            <div class="detailed-report-section-icon"> 
              <i class="fas fa-car"></i> 
            </div>

            <div>
              <h3>Vehicle Information</h3>
              <p>DVehicle details associated with the reported violation.</p>
            </div>
          </div>

          <div class="detailed-report-grid">
            <div class="detailed-report-field">
              <span class="detailed-report-field-label">
                Plate Number
              </span>

              <strong class="detailed-report-plate">${violation.plate_number ?? "N/A"}</strong>
            </div>

            <div class="detailed-report-field">
              <span class="detailed-report-field-label">
                Vehicle Type
              </span>

              <strong>${violation.vehicle_type ?? "N/A"}</strong>
            </div>
          </div>
        </section>

        <section class="detailed-report-section">
          <div class="detailed-report-section-header">
            <div class="detailed-report-section-icon">
              <i class="fas fa-align-left"></i>
            </div>

            <div>
              <h3>Description</h3>

              <p>Additional observation recorded by the reporter</p>
            </div>
          </div>

          <div class="detailed-report-description">
            ${violation.description ?? ""}
          </div>
        </section>

        <section class="detailed-report-section">
          <div class="detailed-report-section-header">
            <div class="detailed-report-section-icon">
              <i class="fas fa-camera"></i>
            </div>

            <div>
              <h3>CCTV Evidence</h3>
              <p>Captured evidence associated with this violation report.</p>
            </div>
          </div>

          <div class="detailed-report-evidence">
            <div class="detailed-report-evidence-preview">
              <img
                src=""
                id="detailedViolationEvidenceImage"
                alt="CCTV violation evidence"
                style="display: none;"
              />

              <div class="detailed-report-no-evidence" id="detailedViolationNoEvidence">
                <i class="fas fa-image"></i>
                <strong>No evidence available</strong>
                <span>No CCTV snapshot was attached to this report.</span>
              </div>
            </div>

            <div class="detailed-report-evidence-info">
              <div class="detailed-report-evidence-row">
                <span><i class="fas fa-file-image"></i> Evidence Type</span>
                <strong>CCTV Snapshot</strong>
              </div>

              <div class="detailed-report-evidence-row">
                <span><i class="fas fa-link"></i> Evidence URL</span>
                <strong>${violation.cloudinary_url ?? "-"}</strong>
              </div>

              <!--<div class="detailed-report-evidence-row">
                <span><i class="fas fa-folder-open"></i> File Path</span>
                <strong>${violation.file_path}</strong>
              </div>-->
            </div>
          </div>
        </section>
      </div>

      <div class="detailed-report-footer">
        <div class="detailed-report-footer-info">
          <i class="fas fa-shield-halved"></i>
          <span>${verificationConfig.footerMessage}</span>
        </div>

        <div class="detailed-report-footer-actions">
          <button type="button" class="btn btn-secondary" id="closeDetailedViolationFooterBtn">Close</button>
        </div>
      </div>
    </div>
  `;

  container.classList.remove("detailed-reports-hidden");


  const evidenceImage = container.querySelector("#detailedViolationEvidenceImage");
  const noEvidence = container.querySelector("#detailedViolationNoEvidence");

  if(evidenceUrl) {
    evidenceImage.src = evidenceUrl;

    evidenceImage.style.display = "block";
    noEvidence.style.display = "none";
  } else {
    evidenceImage.src = "";
    evidenceImage.style.display = "none";
    noEvidence.style.display = "flex";
  }


  const closeBtn = container.querySelector("#closeDetailedViolationBtn");
  const closeFooterBtn = container.querySelector("#closeDetailedViolationFooterBtn");

  const statusContainer = container.querySelector("#violationStatusContainer");
  const statusIcon = container.querySelector("#violationStatusIcon");
  const statusSelect = container.querySelector("#violationStatusSelect");
  const offenseContainer = container.querySelector("#violationOffenseContainer");

  const offenseIcon =
    container.querySelector("#violationOffenseIcon");

  const offenseLevel =
    container.querySelector("#violationOffenseLevel");


  statusSelect.addEventListener("change", async () => {

    const newVerificationStatus = statusSelect.value;

    const previousStatus = violation.verification_status;

    statusSelect.disabled = true;

    try {
      const result = await updateVerificationStatus(violation.violation_id, newVerificationStatus);

      if(!result.success) {
        throw new Error(
          result.message ||
          "Failed to update status."
        );
      }

      violation.verification_status = result.verification_status;

      violation.offense_level = result.offense_level;

      const newOffenseConfig = getOffenseConfig(result.offense_level);

      offenseContainer.classList.remove(
        "first-offense",
        "second-offense",
        "third-offense",
        "not-assigned"
      );

      offenseContainer.classList.add(
        newOffenseConfig.className
      );

      offenseIcon.className =
        newOffenseConfig.icon;

      offenseLevel.textContent =
        result.offense_level || "Not Assigned";

      const newVerificationConfig = getVerificationConfig(newVerificationStatus);

      violation.verification_status = newVerificationStatus;

      // Update container class
      statusContainer.classList.remove(
        "verification-pending",
        "verification-verified",
        "verification-rejected"
      );

      if(newVerificationConfig.className) {
        statusContainer.classList.add(
          newVerificationConfig.className
        );
      }

      // Update icon
      statusIcon.className = newVerificationConfig.icon;

      const footerMessage =
        container.querySelector(
          ".detailed-report-footer-info span"
        );
      
      if(footerMessage) {
        footerMessage.textContent = newVerificationConfig.footerMessage || "Verification status updated.";
      }

      Swal.fire({

        toast: true,

        position: "top-end",

        icon: "success",

        title: "Status Updated",

        text: `Verification: ${result.verification_status}. Offense: ${result.offense_level || "Not Assigned"}.`,

        showConfirmButton: false,

        timer: 2200

      });

    } catch(error) {
      console.error(
        "Failed to update violation status:",
        error
      );

      statusSelect.value = previousStatus || "Pending Review";

      Swal.fire({

        icon: "error",

        title: "Update Failed",

        text:
          error.message ||
          "Unable to update the violation status."

      });

    } finally {
      statusSelect.disabled = false;
    }

  });


  const closeModal = () => {
    container.classList.add("detailed-reports-hidden");
  };

  closeBtn.addEventListener("click", closeModal)


  closeFooterBtn.addEventListener("click", closeModal)
}