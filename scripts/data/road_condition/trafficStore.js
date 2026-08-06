import { getCctvAiDetails, getRoadMapTrafficlevel } from "./fetch_road_condition.js";

let trafficData = [];
let roadMapData = [];
//let subscribers = [];
let trafficSubscribers = [];
let roadMapSubscribers = [];

async function refreshTrafficData() {
  try {
    trafficData = await getCctvAiDetails();
    roadMapData = await getRoadMapTrafficlevel();

    trafficSubscribers.forEach(callback => callback(trafficData));

    roadMapSubscribers.forEach(callback => callback(roadMapData));
  } catch(err) {
    console.error("Traffic Store:", err);
  }

}

export function startTrafficStore() {
  refreshTrafficData();

  setInterval(refreshTrafficData, 15000);
}

export function subscribeTraffic(callback) {
  trafficSubscribers.push(callback);

  callback(trafficData);
}

export function subscribeRoadMap(callback) {
  roadMapSubscribers.push(callback);

  callback(roadMapData);
}

export function getCurrentTraffic() {
  return trafficData;
}

export function getCurrentRoadMap() {
  return roadMapData;
}