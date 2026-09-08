import { getNotifications } from "../data/fetch_notifications.js";

export async function openNotificationModal(container) {

  try {
    const notifications = await getNotifications();

    console.log("Notifications response:", notifications);
  } catch (error) {
    console.error("Unable to load notifications:", error);
  }


  container.innerHTML = `

    <div class="notification-modal">

    <!-- HEADER -->
    <div class="notification-modal-header">

      <div class="notification-modal-title">
        <span class="notification-modal-icon">🔔</span>

        <div>
          <h2>Notifications</h2>
          <p>Traffic and accident system alerts</p>
        </div>
      </div>

      <button
        type="button"
        class="notification-modal-close"
        id="exitNotificationModalBtn"
      >
        &times;
      </button>

    </div>


    <!-- FILTER / SUMMARY -->
    <div class="notification-modal-toolbar">

      <div class="notification-summary">

        <div class="notification-summary-item">
          <span class="notification-summary-number">3</span>
          <span class="notification-summary-label">
            Unread
          </span>
        </div>

        <div class="notification-summary-divider"></div>

        <div class="notification-summary-item">
          <span class="notification-summary-number">8</span>
          <span class="notification-summary-label">
            Total
          </span>
        </div>

      </div>


      <div class="notification-filter">

        <button
          type="button"
          class="notification-filter-btn active"
        >
          All
        </button>

        <button
          type="button"
          class="notification-filter-btn"
        >
          Unread
        </button>

      </div>

    </div>


    <!-- NOTIFICATION LIST -->
    <div class="notification-list">


      <!-- POSSIBLE ACCIDENT -->
      <div class="notification-item unread">

        <div class="notification-item-icon possible-accident">
          ⚠
        </div>

        <div class="notification-item-content">

          <div class="notification-item-top">

            <h3>
              Possible Accident Detected
            </h3>

            <span class="notification-time">
              Just now
            </span>

          </div>

          <p class="notification-message">
            Possible accident detected on
            Commonwealth Avenue.
          </p>

          <div class="notification-item-meta">

            <span class="notification-type">
              Accident Detection
            </span>

            <span class="notification-status-dot"></span>

            <span>
              Unread
            </span>

          </div>

        </div>

      </div>


      <!-- UNDISPATCHED ACCIDENT -->
      <div class="notification-item unread">

        <div class="notification-item-icon undispatched">
          🚨
        </div>

        <div class="notification-item-content">

          <div class="notification-item-top">

            <h3>
              Accident Awaiting Dispatch
            </h3>

            <span class="notification-time">
              30 sec ago
            </span>

          </div>

          <p class="notification-message">
            Accident ACC-2026-001 on
            Commonwealth Avenue has not been
            dispatched yet.
          </p>

          <div class="notification-item-meta">

            <span class="notification-type">
              Undispatched Accident
            </span>

            <span class="notification-status-dot"></span>

            <span>
              Unread
            </span>

          </div>

        </div>

      </div>


      <!-- READ NOTIFICATION -->
      <div class="notification-item">

        <div class="notification-item-icon accident">
          🚗
        </div>

        <div class="notification-item-content">

          <div class="notification-item-top">

            <h3>
              Accident Reported
            </h3>

            <span class="notification-time">
              5 min ago
            </span>

          </div>

          <p class="notification-message">
            Accident ACC-2026-002 was reported
            on Quezon Avenue.
          </p>

          <div class="notification-item-meta">

            <span class="notification-type">
              Accident Report
            </span>

            <span class="notification-read">
              Read
            </span>

          </div>

        </div>

      </div>


      <!-- EMPTY STATE EXAMPLE -->
      <!--
      <div class="notification-empty">

        <div class="notification-empty-icon">
          🔔
        </div>

        <h3>No notifications</h3>

        <p>
          You're all caught up.
        </p>

      </div>
      -->


    </div>


    <!-- FOOTER -->
    <div class="notification-modal-footer">

      <button
        type="button"
        class="notification-mark-all"
      >
        Mark all as read
      </button>

      <button
        type="button"
        class="notification-clear"
      >
        Clear
      </button>

    </div>

    </div>

  `;

  container.classList.remove("notification-modal-hidden");

  const exitNotificationModalBtn = container.querySelector("#exitNotificationModalBtn");

  exitNotificationModalBtn.addEventListener("click", () => {
    container.classList.add("notification-modal-hidden");
  });
}