import { getCctvAiDetails } from "./fetch_road_condition.js";

let trafficData = [];
let subscribers = [];

async function refreshTrafficData() {
  try {
    trafficData = await getCctvAiDetails();

    subscribers.forEach(callback => callback(trafficData));
  } catch(err) {
    console.error("Traffic Store:", err);
  }

}

export function startTrafficStore() {
  refreshTrafficData();

  setInterval(refreshTrafficData, 15000);
}

export function subscribeTraffic(callback) {
  subscribers.push(callback);

  callback(trafficData);
}

export function getCurrentTraffic() {
  return trafficData;
}