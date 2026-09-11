import { getNotifications } from "../data/fetch_notifications.js";
import { openAccidentReport } from "./global_navigation.js";

function formatRelativeTime(createdAt) {

  const createdTime =
    new Date(createdAt.replace(" ", "T")).getTime();

  const seconds =
    Math.floor((Date.now() - createdTime) / 1000);

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

  return `${hours} hour${hours === 1 ? "" : "s"} ago`;
}


let notificationInterval = null;

let shownNotifications =
  new Set();


export function startGlobalNotifications() {

  if (notificationInterval) {
    return;
  }

  checkGlobalNotifications();

  notificationInterval =
    setInterval(
      checkGlobalNotifications,
      30000
    );
}


async function checkGlobalNotifications() {

  try {

    const result =
      await getNotifications();

    if (!result.success) {
      return;
    }

    const notifications =
      result.notifications || [];


    notifications.forEach(notification => {

      const notificationId =
        String(notification.notification_id);

      /*
       * POSSIBLE ACCIDENT
       */
      if (
        notification.notification_type ===
        "possible_accident"
      ) {

        if (shownNotifications.has(notificationId)) {
          return;
        }

        shownNotifications.add(notificationId);

        Swal.fire({
          icon: "warning",
          title: notification.title || "Possible Accident Detected",
          text: notification.message || "A possible accident has been detected.",
          toast: true,
          position: "top-end",
          showConfirmButton: true,
          confirmButtonText: "View",
          timer: 10000,
          timerProgressBar: true
        }).then(result => {

          if (result.isConfirmed) {

            document.dispatchEvent(
              new CustomEvent("openPossibleAccident", {
                detail: {
                  accidentDetectionId:
                    notification.source_id
                }
              })
            );

          }

        });

        return;
      }


      /*
       * UNDISPATCHED ACCIDENT
       *
       * This is intentionally shown again
       * every 30 seconds.
       */
      if (
        notification.notification_type ===
        "undispatched_accident"
      ) {

        Swal.fire({
          icon: "error",
          title:
            notification.title ||
            "Undispatched Accident",

          text:
            `${notification.message || "An accident is waiting for dispatch."} ` +
            `(${formatRelativeTime(notification.created_at)})`,

          toast: true,
          position: "top-end",
          showConfirmButton: true,
          confirmButtonText: "View Accident",
          timer: 10000,
          timerProgressBar: true

        }).then(result => {

          if (result.isConfirmed) {

            openAccidentReport(
              notification.source_public_id
            );

          }

        });

      }

    });

  } catch(error) {

    console.error(
      "Global Notifications:",
      error
    );

  }

}