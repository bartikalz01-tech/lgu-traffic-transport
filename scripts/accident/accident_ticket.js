import { accidentTckDetails } from "../data/get_accident_tck.js";

export async function renderAccidentTicket(accidentId) {

  const fullData = await accidentTckDetails(accidentId);

  const data = fullData.ticket;
  //const people = fullData.entities;
  const people = (fullData.entities || []).filter(person => 
    person.full_name && person.full_name.trim() !== ''
  );
  const assignedOfficer = fullData.officer;
  const timeData = fullData.time_and_severity || null;
  const severityData = fullData.time_and_severity || null;
  //const timeOfAccident = timeData.time_of_accident || '';

  const hasOfficer = assignedOfficer && assignedOfficer.officer_name && assignedOfficer.officer_name.trim() !== '';
  const hasTime = timeData && timeData.time_of_accident && timeData.time_of_accident.trim() !== '';
  const hasSeverity = severityData && severityData.status_of_accident && severityData.status_of_accident.trim() !== '';

  let peopleSectionHTML = '';
  let officerSectionHTML = '';
  let timeSectionHTML = '';
  let severitySectionHTML = '';
  // FINISH THE ACCIDENT TYPE

  if(people && people.length > 0) {
    const peopleRows = people.map(person => `
      <tr>
        <td>
          <div class="person-info">
            <div class="person-avatar">
              <i class="fas fa-user"></i>
            </div>
            <div class="person-details">
              <div class="person-name">${person.full_name}</div>
              <div class="person-address">${person.address}</div>
              <div class="person-contact">${person.contact_num}</div>
            </div>
          </div>
        </td>
        <td><span class="role-badge role-driver">${person.role}</span></td>
        <td>
          <div class="vehicle-info">
            <i class="fas fa-car-side"></i>
            <span>${person.vehicle_name}</span>
          </div>
        </td>
        <td><span class="plate-number">${person.plate_number}</span></td>
      </tr>
    `).join('');

    peopleSectionHTML = `
      <div class="card people-involved-card">
        <div class="card-header">
          <h3><i class="fas fa-user-friends"></i> People & Vehicles Involved</h3>
        </div>
        <div class="card-body">
          <div class="people-table-container">
            <table class="people-details">
              <thead>
                <tr>
                  <th><i class="fas fa-user"></i> People Involved Details</th>
                  <th><i class="fas fa-car"></i> Role</th>
                  <th><i class="fas fa-id-card"></i> Vehicle</th>
                  <th><i class="fas fa-user-tag"></i> Plate Number</th>
                </tr>
              </thead>
              <tbody>
                ${peopleRows}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  if(hasOfficer) {
    officerSectionHTML = `
      <div class="card officer-section-card">
        <div class="card-body">
          <div class="officer-info">
            <div class="officer-signature">
              <div class="signature-line"></div>
              <div class="officer-details">
                <h4 class="officer-name">${assignedOfficer.officer_name}</h4>
                <p class="officer-role">Assigned Officer</p>
                <p class="officer-id">ID: DISP-${assignedOfficer.officer_id}</p>
              </div>
            </div>
            <div class="ticket-actions">
              <div class="action-buttons">
                <button class="btn btn-primary">
                  <i class="fas fa-print"></i> Print Ticket
                </button>
                <button class="btn btn-success">
                  <i class="fas fa-download"></i> Download PDF
                </button>
                <button class="btn btn-info">
                  <i class="fas fa-share-alt"></i> Share Report
                </button>
                <button class="btn btn-outline-secondary">
                  <i class="fas fa-edit"></i> Edit Details
                </button>
              </div>
              <div class="ticket-footer-info">
                <p class="text-muted">
                  <i class="fas fa-info-circle"></i>
                  This is an official document. Please keep it for your records.
                </p>
                <p class="text-muted">
                  Generated on: 2026-01-01 13:30 | System Version: 2.4.1
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if(hasTime) {
    timeSectionHTML = `
      <div class="detail-item">
        <div class="detail-label">
          <i class="fas fa-clock"></i>
          <span>Time of Accident</span>
        </div>
        <div class="detail-value">${timeData.time_of_accident}</div>
      </div>
    `;
  }

  if(hasSeverity) {
    severitySectionHTML = `
      <div class="detail-item">
        <div class="detail-label">
          <i class="fas fa-exclamation-triangle"></i>
          <span>Severity</span>
        </div>
        <div class="detail-value badge-warning">${severityData.status_of_accident}</div>
      </div>
    `;
  }

  const statusMap = {
    'Open Case': 'status-open-case',
    'Under Investigation': 'status-under-investigation',
    'Resolved': 'status-resolved'
  }

  const statusClass = statusMap[data.status_definition] || 'statis-open-case';

  const accidentTicket = `
    <button class="back-to-detail-btn js-back-to-detail-btn">
      <i class="fas fa-arrow-left"></i>
    </button>
    <section class="ticket-container">
      <div class="card ticket-header-card">
        <div class="card-body">
          <div class="logo-container">
            <img src="../images/logo.svg" alt="Traffic Management System" class="logo-img">
            <!--<h1 class="ticket-title">Traffic Management System</h1>
            <p class="text-muted text-center">Official Traffic Report Ticket</p>-->
          </div>

          <div class="ticket-meta-info">
            <div class="ticket-row-date">
              <div class="ticket-row">
                <span class="label">TICKET NO:</span>
                <span class="value badge-primary">${data.public_ticket_id}</span>
              </div>
              <div class="date">
                <span class="label">Date Issued:</span>
                <span class="value">${data.issued_date}</span>
              </div>
            </div>
            <div class="ticket-row-date">
              <div class="ticket-row">
                <span class="label">Reference:</span>
                <span class="value">${data.public_accident_id}</span>
              </div>
              <div class="ticket-row">
                <span class="label">Reported By:</span>
                <span class="value">${data.reported_by}</span>
              </div>
            </div>
            <div class="ticket-row status-row">
              <span class="label">Status:</span>
              <span class="status-badge ${statusClass}">${data.status_definition}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Report Details Card -->
      <div class="card report-details-card">
        <div class="card-header">
          <h3><i class="fas fa-car-crash"></i> Accident Details</h3>
        </div>
        <div class="card-body">
          <div class="details-grid">
            ${timeSectionHTML}
            <div class="detail-item">
              <div class="detail-label">
                <i class="fas fa-calendar-days"></i>
                <span>Date of Accident</span>
              </div>
              <div class="detail-value">${data.date_of_accident}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">
                <i class="fas fa-map-marker-alt"></i>
                <span>Location</span>
              </div>
              <div class="detail-value">${data.road_name}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">
                <i class="fas fa-chart-bar"></i>
                <span>Accident Description</span>
              </div>
              <div class="detail-value">${data.accident_description}</div>
            </div>
            <!--<div class="detail-item">
              <div class="detail-label">
                <i class="fas fa-users"></i>
                <span>People Involved</span>
              </div>
              <div class="detail-value">3</div>
            </div>-->
            ${severitySectionHTML}
            <div class="detail-item">
              <div class="detail-label">
                <i class="fas fa-car-side"></i>
                <span>Accident Type</span>
              </div>
              <div class="detail-value">Vehicle Collision</div>
            </div>
            <!--<div class="detail-item">
              <div class="detail-label">
                <i class="fas fa-weather"></i>
                <span>Weather Conditions</span>
              </div>
              <div class="detail-value">Clear</div>
            </div>-->
          </div>
        </div>
      </div>

      <!-- People Involved Card -->
      ${peopleSectionHTML}

      <!-- Violation Payment Section (Conditional) -->
      <!--Tanggalin mo tong comment para makita yung payment info -->
      <!--<div class="card payment-section-card">
        <div class="card-header">
          <h3><i class="fas fa-money-bill-wave"></i> Payment Information</h3>
        </div>
        <div class="card-body">
          <div class="payment-details">
            <div class="payment-summary">
              <div class="payment-item">
                <span class="payment-label">Violation Type:</span>
                <span class="payment-value">Speeding Violation</span>
              </div>
              <div class="payment-item">
                <span class="payment-label">Fine Amount:</span>
                <span class="payment-value amount">₱1,500.00</span>
              </div>
              <div class="payment-item">
                <span class="payment-label">Due Date:</span>
                <span class="payment-value">2026-01-15</span>
              </div>
            </div>
            <div class="payment-status">
              <span class="payment-label">Payment Status:</span>
              <span class="payment-status-badge status-unpaid">Unpaid</span>
            </div>
            <div class="payment-actions">
              <button class="btn btn-success payment-btn">
                <i class="fas fa-credit-card"></i> Process Payment
              </button>
              <button class="btn btn-outline-primary payment-btn">
                <i class="fas fa-print"></i> Print Invoice
              </button>
              <button class="btn btn-outline-secondary payment-btn">
                <i class="fas fa-envelope"></i> Send Reminder
              </button>
            </div>
          </div>
        </div>
      </div>-->

      <!-- Officer & Actions Section -->
      ${officerSectionHTML}

      <!-- Toggle for Violation Payment Section -->
      <div class="toggle-section">
        <label class="toggle-label">
          <input type="checkbox" id="showPaymentSection" class="toggle-input">
          <span class="toggle-slider"></span>
          <span class="toggle-text">Show Payment Section (For Violation Tickets)</span>
        </label>
      </div>
      </section>
  `;

  return accidentTicket;

}