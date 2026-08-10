import { getAccidentDetails } from "./fetch_accidents.js";


let accidentData = [];

let accidentSubscribers = [];

let accidentStoreStarted = false;

let accidentRefreshInterval = null;


async function refreshAccidentData() {

  try {

    const data = await getAccidentDetails();

    accidentData =
      Array.isArray(data)
        ? data
        : [];


    accidentSubscribers.forEach(callback => {
      callback(accidentData);
    });


  } catch(error) {

    console.error(
      "Accident Store:",
      error
    );

  }

}


export function startAccidentStore() {

  if(accidentStoreStarted) {
    return;
  }


  accidentStoreStarted = true;


  // Initial fetch
  refreshAccidentData();


  // Real-time polling
  accidentRefreshInterval =
    setInterval(
      refreshAccidentData,
      5000
    );

}


export function subscribeAccidents(callback) {

  accidentSubscribers.push(callback);


  // Immediately provide current data
  callback(accidentData);

}


export function getCurrentAccidents() {

  return accidentData;

}