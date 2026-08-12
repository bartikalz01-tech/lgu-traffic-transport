import { getViolationDetails } from "./fetch_violations.js";

let violationData = [];

let violationSubscribers = [];

let violationStoreStarted = false;

let violationRefreshInterval = null;

let violationRefreshInProgress = false;


async function refreshViolationData() {

    // Prevent overlapping requests
    if (violationRefreshInProgress) {
        return;
    }

    violationRefreshInProgress = true;

    try {

        const data = await getViolationDetails();

        violationData =
            Array.isArray(data)
                ? data
                : [];


        violationSubscribers.forEach(callback => {
            callback(violationData);
        });


    } catch (error) {

        console.error(
            "Violation Store:",
            error
        );

    } finally {

        violationRefreshInProgress = false;

    }

}


export function startViolationStore() {

  // Prevent multiple polling intervals
  if (violationStoreStarted) {
      return;
  }

  violationStoreStarted = true;


  // Initial fetch
  refreshViolationData();


  // Real-time polling
  violationRefreshInterval =
    setInterval(
      refreshViolationData,
      5000
    );

}


export function subscribeViolations(callback) {

  violationSubscribers.push(callback);


  // Immediately provide current data
  callback(violationData);


  // Return unsubscribe function
  return () => {

    violationSubscribers =
      violationSubscribers.filter(
        subscriber => subscriber !== callback
      );
  };

}


export function getCurrentViolations() {

  return violationData;

}