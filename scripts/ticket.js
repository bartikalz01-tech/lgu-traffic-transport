 document.addEventListener('DOMContentLoaded', function() {
      // Toggle payment section
      const toggleCheckbox = document.getElementById('showPaymentSection');
      const paymentSection = document.createElement('div');
      paymentSection.innerHTML = `
        <div class="card payment-section-card">
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
        </div>
      `;

      toggleCheckbox.addEventListener('change', function() {
        if (this.checked) {
          // Insert payment section before the officer section
          const officerSection = document.querySelector('.officer-section-card');
          officerSection.parentNode.insertBefore(paymentSection, officerSection);
        } else {
          // Remove payment section if it exists
          if (document.querySelector('.payment-section-card')) {
            paymentSection.remove();
          }
        }
      });

      // Update status badges
      const statusBadge = document.querySelector('.status-badge');
      if (statusBadge) {
        statusBadge.addEventListener('click', function() {
          const statuses = ['Under Investigation', 'Resolved', 'Closed', 'Archived'];
          const currentStatus = this.textContent;
          const currentIndex = statuses.indexOf(currentStatus);
          const nextIndex = (currentIndex + 1) % statuses.length;
          this.textContent = statuses[nextIndex];
          this.className = `status-badge status-${statuses[nextIndex].toLowerCase().replace(' ', '-')}`;
        });
      }

      // Print functionality
      document.querySelector('.btn-primary').addEventListener('click', function() {
        window.print();
      });
    });