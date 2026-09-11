import { getNotifications, markNotificationAsRead } from "../data/fetch_notifications.js";
import { openAccidentReport } from "../navigavtion/global_navigation.js";

function formatRelativeTime(createdAt) {

  const createdTime = new Date(createdAt.replace(" ", "T")).getTime();

  const now =
    Date.now();

  const seconds =
    Math.floor(
      (now - createdTime) / 1000
    );


  if (seconds < 60) {
    return `${seconds} second${seconds === 1 ? "" : "s"} ago`;
  }


  const minutes =
    Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }


  const hours =
    Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }


  const days =
    Math.floor(hours / 24);

  return `${days} day${days === 1 ? "" : "s"} ago`;
}


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

  let unreadNotifications =
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
              data-notification-id="${notification.notification_id}"
              data-notification-type="${notification.notification_type}"
              data-source-id="${notification.source_id}"
              data-source-public-id="${notification.source_public_id || ""}"
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

                  <span class="notification-time ${
                    notification.notification_type === "undispatched_accident"
                    ? "relative-notification-time" : ""
                    }"

                    ${notification.notification_type === "undispatched_accident"
                      ? `data-created-at="${notification.created_at}"` : ""
                    }
                  >
                    ${
                      notification.notification_type === "undispatched_accident"
                      ? formatRelativeTime(notification.created_at)
                      : notification.created_at
                    }
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

            <span class="notification-summary-number" id="unreadNotificationCount">
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

  const notificationTimes = container.querySelectorAll(".relative-notification-time");

  function updateNotificationTimes() {

    notificationTimes.forEach(element => {
      const createdAt = element.dataset.createdAt;

      element.textContent = formatRelativeTime(createdAt);
    });

  }
  updateNotificationTimes();

  const notificationTimeInterval = setInterval(updateNotificationTimes, 1000);


  function updateUnreadNotificationCount() {
    const unreadCountElement = container.querySelector("#unreadNotificationCount");

    if(!unreadCountElement) {
      return;
    }

    unreadCountElement.textContent = unreadNotifications;
  }


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

      clearInterval(notificationTimeInterval);

      container.classList.add(
        "notification-modal-hidden"
      );

    }
  );

  const notificationItems = container.querySelectorAll(".notification-item");

  notificationItems.forEach(item => {

    item.addEventListener("click", async () => {

      const notificationId = item.dataset.notificationId;

      const notificationType = item.dataset.notificationType;

      const sourceId = item.dataset.sourceId;

      const sourcePublicId = item.dataset.sourcePublicId;


      if(item.classList.contains("unread")) {
        try {
          const result = await markNotificationAsRead(notificationId);

          if(!result.success) {
            console.error(
              "Failed to mark notification as read:",
              result.message
            );

            return;
          }

          item.classList.remove("unread");

          unreadNotifications--;

          updateUnreadNotificationCount();
          
          const meta = item.querySelector(".notification-item-meta");

          if(meta) {
            const statusDot = meta.querySelector(".notification-status-dot");

            if(statusDot) {
              statusDot.remove();
            }

            const unreadText = [...meta.children].find(element => element.textContent.trim() === "Unread");
            
            if(unreadText) {
              unreadText.remove();
            }

            const readStatus = document.createElement("span");

            readStatus.className = "notification-read";

            readStatus.textContent = "Read";

            meta.appendChild(readStatus);
          }

          console.log("Notification marked as read: ", notificationId);

        } catch(error) {
          console.error("Unable to mark notification as read:", error);

          return;
        }
      }

      if(notificationType === "possible_accident") {

        console.log("Opening possible accident: ", sourceId);

        container.classList.add("notification-modal-hidden");

        document.dispatchEvent(
          new CustomEvent("openPossibleAccident", {
            detail: {
              accidentDetectionId: sourceId
            }
          })
        );

        return;
      }

      if(notificationType === "undispatched_accident") {
        console.log(
          "Opening possible accident:", 
          sourcePublicId
        );

        container.classList.add("notification-modal-hidden");

        /*document.dispatchEvent(
          new CustomEvent("openAccidentReport", {
            detail: {
              publicAccidentId: sourcePublicId
            }
          })
        );*/

        openAccidentReport(sourcePublicId);

        return;
      }

    });

  });

}