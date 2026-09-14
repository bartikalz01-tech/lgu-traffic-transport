import { getNotifications } from "../data/fetch_notifications.js";
import { openAccidentReport } from "./global_navigation.js";


function formatRelativeTime(createdAt) {

  const createdTime =
    new Date(createdAt.replace(" ", "T")).getTime();

  const seconds =
    Math.max(
      0,
      Math.floor(
        (Date.now() - createdTime) / 1000
      )
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


/*
 * Prevent multiple polling intervals
 * on the same page.
 */
let notificationInterval = null;


/*
 * Possible accidents:
 *
 * Each notification is shown only once.
 */
const shownPossibleAccidents =
  new Set();


/*
 * Undispatched accidents:
 *
 * Stores the last time each notification
 * was displayed.
 */
const lastUndispatchedShown =
  new Map();


/*
 * Check the backend every 5 seconds.
 *
 * This allows newly-created notifications
 * to be detected without refreshing.
 */
const CHECK_INTERVAL =
  5000;


/*
 * Repeat undispatched accident alerts
 * every 30 seconds.
 */
const UNDISPATCHED_INTERVAL =
  30000;


/*
 * SweetAlert duration.
 */
const ALERT_DURATION =
  1500;


export function startGlobalNotifications() {

  if (notificationInterval) {
    return;
  }


  /*
   * Check immediately.
   */
  checkGlobalNotifications();


  /*
   * Keep checking the backend.
   */
  notificationInterval =
    setInterval(
      checkGlobalNotifications,
      CHECK_INTERVAL
    );

}


/*
 * =========================================================
 * CHECK GLOBAL NOTIFICATIONS
 * =========================================================
 */

async function checkGlobalNotifications() {

  try {

    const result =
      await getNotifications();


    if (!result.success) {
      return;
    }


    const notifications =
      Array.isArray(result.notifications)
        ? result.notifications
        : [];


    /*
     * =====================================================
     * POSSIBLE ACCIDENT
     * =====================================================
     *
     * Show ONLY ONCE per notification.
     */

    const possibleAccidents =
      notifications.filter(
        notification =>
          notification.notification_type ===
          "possible_accident"
      );


    possibleAccidents.forEach(notification => {

      const notificationId =
        String(
          notification.notification_id
        );


      /*
       * Already shown?
       */
      if (
        shownPossibleAccidents.has(
          notificationId
        )
      ) {

        return;

      }


      /*
       * Remember that it was shown.
       */
      shownPossibleAccidents.add(
        notificationId
      );


      Swal.fire({

        icon: "warning",

        title:
          notification.title ||
          "Possible Accident Detected",

        text:
          notification.message ||
          "A possible accident has been detected.",

        toast: true,

        position: "top-end",

        showConfirmButton: true,

        confirmButtonText: "View",

        timer:
          ALERT_DURATION,

        timerProgressBar: true

      }).then(result => {

        if (result.isConfirmed) {

          document.dispatchEvent(
            new CustomEvent(
              "openPossibleAccident",
              {
                detail: {

                  accidentDetectionId:
                    notification.source_id

                }
              }
            )
          );

        }

      });

    });


    /*
     * =====================================================
     * UNDISPATCHED ACCIDENT
     * =====================================================
     *
     * This notification is DIFFERENT.
     *
     * It is allowed to appear repeatedly
     * while the accident remains undispatched.
     */

    const now =
      Date.now();


    const undispatchedAccidents =
      notifications.filter(
        notification =>
          notification.notification_type ===
          "undispatched_accident"
      );


    undispatchedAccidents.forEach(notification => {

      const notificationId =
        String(
          notification.notification_id
        );


      const lastShown =
        lastUndispatchedShown.get(
          notificationId
        );


      /*
       * If it has already been shown,
       * check whether 30 seconds have passed.
       */
      if (lastShown !== undefined) {

        const elapsed =
          now - lastShown;


        if (
          elapsed <
          UNDISPATCHED_INTERVAL
        ) {

          return;

        }

      }


      /*
       * IMPORTANT:
       *
       * Record the display time BEFORE
       * opening SweetAlert.
       *
       * This guarantees that the same
       * notification can be shown again
       * after exactly 30 seconds.
       */
      lastUndispatchedShown.set(
        notificationId,
        now
      );


      /*
       * Calculate how old the accident
       * notification actually is.
       */
      const relativeTime =
        formatRelativeTime(
          notification.created_at
        );


      Swal.fire({

        icon: "error",

        title:
          notification.title ||
          "Undispatched Accident",

        text:
          `${notification.message || "An accident is waiting for dispatch."} ` +
          `(${relativeTime})`,

        toast: true,

        position: "top-end",

        showConfirmButton: true,

        confirmButtonText:
          "View Accident",

        timer:
          ALERT_DURATION,

        timerProgressBar: true

      }).then(result => {

        if (result.isConfirmed) {

          openAccidentReport(
            notification.source_public_id
          );

        }

      });

    });


  } catch(error) {

    console.error(
      "Global Notifications:",
      error
    );

  }

}