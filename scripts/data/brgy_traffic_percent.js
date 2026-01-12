import { renderTrafficPercentage } from "../road_condition/traffic_flow.js";

export let trafficPercent = [];

export async function fetchTrafficPercent() {
  try {
    const response = await fetch('../api/get_brgy_traffic_status.php');
    if(!response) throw new Error('Failed to fetch traffic percent');

    trafficPercent = await response.json();
    renderTrafficPercentage();
  } catch (error) {
    console.error('Error loading roads:', error);
  }
}