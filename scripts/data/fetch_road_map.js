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

export async function fetchDiversions() {
  try {
    const resposne = await fetch("../api/get_diversion_start_end.php");
    const result = await resposne.json();

    if(result.status === "success") {
      return result.data;
    } else {
      console.error(result.message);
      return[];
    }
  } catch(error) {
    console.error("Fetch error:", error);
    return [];
  }
}

export async function fetchDiversionDetails(diversionId) {
  try {
    const response = await fetch(`../api/get_diversion_routes.php?diversion_id=${diversionId}`);
    const result = await response.json();

    if(result.status === "success") {
      return result.data;
    } else {
      console.error(result.message);
      return[];
    }
  } catch(error) {
    console.error("Fetch details error:", error);
    return [];
  }
}

export async function fetchAllDiversionStatus() {
  try {
    const response = await fetch("../api/get_all_diversion_status.php");
    const result = await response.json();

    if(result.status === "success") {
      return result.data;
    } else {
      console.error(result.message);
      return[];
    }
  } catch(error) {
    console.error("Fetch details error:", error);
    return [];
  }
}