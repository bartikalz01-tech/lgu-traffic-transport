export let trafficData = [];

export async function fetchTrafficData() {
  try {
    const response = await fetch('../api/get_traffic_flow.php');
    if (!response.ok) {
      throw new Error('Failed to fetch traffic data');
    }


    trafficData = await response.json();
    renderTrafficFlowTable();
  } catch(error) {
    console.error('Error loading roads:', error);
  }
}