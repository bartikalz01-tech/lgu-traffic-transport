import { getCctvAiDetails, getRoadMapTrafficlevel, getPossibleAccidents } from "./fetch_road_condition.js";

let trafficData = [];
let roadMapData = [];
let possibleAccidentData = [];
//let subscribers = [];
let trafficSubscribers = [];
let roadMapSubscribers = [];
let possibleAccidentSubscribers = [];

async function refreshTrafficData() {
  try {
    trafficData = await getCctvAiDetails();
    roadMapData = await getRoadMapTrafficlevel();
    possibleAccidentData = await getPossibleAccidents();

    trafficSubscribers.forEach(callback => callback(trafficData));

    roadMapSubscribers.forEach(callback => callback(roadMapData));

    possibleAccidentSubscribers.forEach(callback => callback(possibleAccidentData));
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

export function subscribePossibleAccident(callback) {
  possibleAccidentSubscribers.push(callback);

  callback(possibleAccidentData);
}

export function getCurrentTraffic() {
  return trafficData;
}

export function getCurrentRoadMap() {
  return roadMapData;
}

export function getLatestPossibleAccidents() {
  return possibleAccidentData;
}