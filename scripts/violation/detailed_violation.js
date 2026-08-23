import { updateViolationStatus } from "../data/violation_report/fetch_violations.js";

export function renderViolationDetailModal(container, violation) {

  function getStatusConfig(status) {
    switch (String(status ?? "").trim()) {

      case "Pending Review":
        return {
          className: "pending",
          icon: "fas fa-clock",
          label: "Pending Review",
          footerMessage: "This report is currently under verification."
        };

      case "Verified":
        return {
          className: "verified",
          icon: "fas fa-circle-check",
          label: "Verified",
          footerMessage: "This report has been verified."
        };

      case "Rejected":
        return {
          className: "rejected",
          icon: "fas fa-circle-xmark",
          label: "Rejected",
          footerMessage: "This report has been rejected."
        };

      default:
        return {
          className: "",
          icon: "fas fa-circle-question",
          label: status || "Unknown",
          footerMessage: "The status of this report is currently unavailable."
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

  const statusConfig = getStatusConfig(violation?.status);
  const typeConfig = getViolationTypeConfig(violation?.violation_type);

  const evidenceFilename = violation?.file_name ?? null;

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

        <div id="violationStatusContainer" class="detailed-report-status ${statusConfig.className}">
          <i id="violationStatusIcon" class="${statusConfig.icon}"></i>
          <div>
            <span class="detailed-report-status-label">
              Status
            </span>
            <select id="violationStatusSelect" class="detailed-report-status-select">
              <option value="Pending Review" ${statusConfig.label === "Pending Review" ? "selected" : ""}>
                Pending Review
              </option>

              <option value="Verified" ${statusConfig.label === "Verified" ? "selected" : ""}>
                Verified
              </option>

              <option value="Rejected" ${statusConfig.label === "Rejected" ? "selected" : ""}>
                Rejected
              </option>
            </select>
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

              <strong class="detailed-report-plate">${violation.plate_number}</strong>
            </div>

            <div class="detailed-report-field">
              <span class="detailed-report-field-label">
                Vehicle Type
              </span>

              <strong>${violation.vehicle_type}</strong>
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
                <span><i class="fas fa-file"></i> File Name</span>
                <strong>${violation.file_name}</strong>
              </div>

              <div class="detailed-report-evidence-row">
                <span><i class="fas fa-folder-open"></i> File Path</span>
                <strong>${violation.file_path}</strong>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div class="detailed-report-footer">
        <div class="detailed-report-footer-info">
          <i class="fas fa-shield-halved"></i>
          <span>${statusConfig.footerMessage}</span>
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

  if(evidenceFilename) {
    evidenceImage.src = `http://localhost:5001/violation_evidence/snapshots/file/${encodeURIComponent(evidenceFilename)}`;

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


  statusSelect.addEventListener("change", async () => {

    const newStatus = statusSelect.value;

    const previousStatus = violation.status;

    statusSelect.disabled = true;

    try {
      const result = await updateViolationStatus(violation.violation_id, newStatus);

      if(!result.success) {
        throw new Error(
          result.message ||
          "Failed to update status."
        );
      }

      const newStatusConfig = getStatusConfig(newStatus);

      violation.status = newStatus;

      // Update container class
      statusContainer.classList.remove(
        "pending",
        "verified",
        "rejected"
      );

      if(newStatusConfig.className) {
        statusContainer.classList.add(
          newStatusConfig.className
        );
      }

      // Update icon
      statusIcon.className = newStatusConfig.icon;

      const footerMessage =
        container.querySelector(
          ".detailed-report-footer-info span"
        );
      
      if(footerMessage) {
        footerMessage.textContent = newStatusConfig.footerMessage;
      }

      Swal.fire({

        toast: true,

        position: "top-end",

        icon: "success",

        title: "Status Updated",

        text:
          `Violation status changed to ${newStatus}.`,

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