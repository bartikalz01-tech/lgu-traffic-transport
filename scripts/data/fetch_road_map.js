export async function fetchRoadMap() {
  try {
    const response = await fetch ('../api/get_road_map.php');
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching road map:", error);
    return [];
  }
}

export async function fetchRoadEvents() {
  try {
    const response = await fetch('../api/get_road_events.php');
    const data = await response.json();

    return data;
  } catch(error) {
    console.error("Error fetching road events", error);
    return [];
  }
}