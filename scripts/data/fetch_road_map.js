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

export async function fetchRoadsDiversion() {
  try {
    const response = await fetch('../api/get_roads.php');
    const data = await response.json();

    return data;
  } catch(error) {
    console.error("Error fetching roads", error);
    return [];
  }
}

export async function fetchRoadDiversionCoord(road_id) {
  try {
    const response = await fetch(`../api/get_diversion.php?road_id=${road_id}`);
    const data = await response.json();

    return data;
  } catch(error) {
    console.error("Error fetching coordinates:", error);
    return [];
  }
}

/*export async function fetchRoadConnection() {
  try {
    const response = await fetch('../api/get_road_connections.php');
    const data = await response.json();

    return data;
  } catch(error) {
    console.error("Error fetching road connections:", error);
    return[];
  }
}*/

export async function fetchSmartRoute(start, end) {
  try {
    const response = await fetch(`../api/get_smart_route.php?start=${start}&end=${end}`);
    const data = await response.json();

    return data;
  } catch(error) {
    console.error("Error fetching smart route", error);
    return [];
  }
}