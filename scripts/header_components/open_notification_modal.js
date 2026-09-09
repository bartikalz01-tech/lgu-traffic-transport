import { getNotifications } from "../data/fetch_notifications.js";

export async function openNotificationModal(container) {

  let notifications = [];

  try {

    const result = await getNotifications();

    console.log("Notifications response:", result);

    if (result.success) {
      notifications = result.notifications || [];
    }

  } catch (error) {

    console.error("Unable to load notifications:", error);

  }


  /*
  * Notification counts
  */
  const totalNotifications =
    notifications.length;

  const unreadNotifications =
    notifications.filter(
      notification => Number(notification.is_read) === 0
    ).length;


  /*
  * Create notification HTML
  */
  const notificationListHTML =
    notifications.length > 0

      ? notifications.map(notification => {

          const isUnread =
            Number(notification.is_read) === 0;

          let iconClass = "accident";
          let icon = "🚗";

          if (
            notification.notification_type ===
            "possible_accident"
          ) {

            iconClass = "possible-accident";
            icon = "⚠";

          }

          else if (
            notification.notification_type ===
            "undispatched_accident"
          ) {

            iconClass = "undispatched";
            icon = "🚨";

          }


          return `

            <div
              class="notification-item ${isUnread ? "unread" : ""}"
            >

              <div
                class="notification-item-icon ${iconClass}"
              >
                ${icon}
              </div>


              <div class="notification-item-content">

                <div class="notification-item-top">

                  <h3>
                    ${notification.title}
                  </h3>

                  <span class="notification-time">
                    ${notification.created_at}
                  </span>

                </div>


                <p class="notification-message">
                  ${notification.message}
                </p>


                <div class="notification-item-meta">

                  <span class="notification-type">
                    ${notification.notification_type}
                  </span>


                  ${
                    isUnread

                      ? `
                        <span class="notification-status-dot"></span>

                        <span>
                          Unread
                        </span>
                      `

                      : `
                        <span class="notification-read">
                          Read
                        </span>
                      `
                  }

                </div>

              </div>

            </div>

          `;

        }).join("")

      : `

        <div class="notification-empty">

          <div class="notification-empty-icon">
            🔔
          </div>

          <h3>
            No notifications
          </h3>

          <p>
            You're all caught up.
          </p>

        </div>

      `;


  /*
  * Render modal
  */
  container.innerHTML = `

    <div class="notification-modal">

      <!-- HEADER -->
      <div class="notification-modal-header">

        <div class="notification-modal-title">

          <span class="notification-modal-icon">
            🔔
          </span>

          <div>

            <h2>
              Notifications
            </h2>

            <p>
              Traffic and accident system alerts
            </p>

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

            <span class="notification-summary-number">
              ${unreadNotifications}
            </span>

            <span class="notification-summary-label">
              Unread
            </span>

          </div>


          <div class="notification-summary-divider"></div>


          <div class="notification-summary-item">

            <span class="notification-summary-number">
              ${totalNotifications}
            </span>

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

        ${notificationListHTML}

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


  /*
  * Show modal
  */
  container.classList.remove(
    "notification-modal-hidden"
  );


  /*
  * Exit button
  */
  const exitNotificationModalBtn =
    container.querySelector(
      "#exitNotificationModalBtn"
    );


  exitNotificationModalBtn.addEventListener(
    "click",
    () => {

      container.classList.add(
        "notification-modal-hidden"
      );

    }
  );

}