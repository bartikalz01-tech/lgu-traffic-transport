export function renderViolationDetailModal(container) {
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
            VIO-XXXXXXXXX
          </strong>
        </div>

        <div class="detailed-report-status pending">
          <i class="fas fa-clock"></i>
          <div>
            <span clas="detailed-report-status-label">
              Status
            </span>
            <strong>Pending Review</strong>
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
              <strong>#1</strong>
            </div>

            <div class="detailed-report-field">
              <span class="detailed-report-field-label">Violation Type</span>
              <span class="detailed-report-type-badge parking">
                <i class="fas fa-square-parking"></i>
                Illegal Parking
              </span>
            </div>

            <div class="detailed-report-field">
              <span class="detailed-report-field-label">
                Road / Street
              </span>

              <strong>Example Road</strong>
            </div>

            <div class="detailed-report-field">
              <span class="detailed-report-field-label">Date & Time</span>
              <strong>
                Aug 12, 2026
                <small>5:42 PM</small>
              </strong>
            </div>

            <div class="detailed-report-field full-width">
              <span class="detailed-report-field-label">Location Details</span>
              <div class="detailed-report-text-box">
                Near the barangay entrance / eastbound lane
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

              <strong class="detailed-report-plate">ABC-123</strong>
            </div>

            <div class="detailed-report-field">
              <span class="detailed-report-field-label">
                Vehicle Type
              </span>

              <strong>Private Car</strong>
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
            Vehicle was observed parked along the roadside and partially
            obstructing the eastbound lane.
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
                <strong>example_snapshot.jpg</strong>
              </div>

              <div class="detailed-report-evidence-row">
                <span><i class="fas fa-folder-open"></i> File Path</span>
                <strong>violation_evidence/snapshots/</strong>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div class="detailed-report-footer">
        <div class="detailed-report-footer-info">
          <i class="fas fa-shield-halved"></i>
          <span>This report is currently under verification.</span>
        </div>

        <div class="detailed-report-footer-actions">
          <button type="button" class="btn btn-secondary" id="closeDetailedViolationFooterBtn">Close</button>
        </div>
      </div>
    </div>
  `;

  container.classList.remove("detailed-reports-hidden");

  const closeBtn = container.querySelector("#closeDetailedViolationBtn");
  const closeFooterBtn = container.querySelector("#closeDetailedViolationFooterBtn");

  const closeModal = () => {
    container.classList.add("detailed-reports-hidden");
  };

  closeBtn.addEventListener("click", closeModal)


  closeFooterBtn.addEventListener("click", closeModal)
}