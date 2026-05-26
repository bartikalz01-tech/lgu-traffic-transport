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
    const resposne = await fetch("../api/diversions/get_diversion_start_end.php");
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
    const response = await fetch(`../api/diversions/get_diversion_routes.php?diversion_id=${diversionId}`);
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

export async function fetchAllDiversionStatus(diversionId) {
  try {
    const response = await fetch(`../api/get_all_diversion_status.php?diversion_id=${diversionId}`);
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

export async function fetchGeneratedDiversion(startNode, endNode) {
  try {
    const response = await fetch(`../api/diversions/insert_diversion_route.php?start=${startNode}&end=${endNode}`);
    const result = await response.json();

    if(result.status !== "success") {
      console.error(result.message);
      return null;
    }

    return result.data;
  } catch(error) {
    console.error("Fetch diversion error", error);
    return null;
  }
}

export async function fetchRoadNodes() {
  const response = await fetch("../api/diversions/get_road_nodes.php");

  const result = await response.json();
  
  return result.data || [];
}

export async function activateDiversionRoute(payload) {
  try {
    const response = await fetch("../api/diversions/save_diversion.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    return result;
  } catch(error) {
    console.error("Activate Diversion error:", error);

    return {
      status: "error",
      message: "Request Failed"
    }
  }
}

export async function updateDiversionRoute(payload) {
  try {
    const response = await fetch("../api/diversions/update_diversion.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    return result;
  } catch(error) {
    console.error("Update Diversions Error:", error);

    return {
      status: "error",
      message: "Request Failed"
    }
  }
}

/*export async function fetchDiversionSummary() {
  try {
    const response = await fetch("../api/get_diversion_summary.php");
    const result = await response.json();

    return result;
  } catch(error) {
    console.error("Fetch details error:", error);
    return [];
  }
}*/