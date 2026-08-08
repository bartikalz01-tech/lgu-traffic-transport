export async function getCctvAiDetails() {
  try {
    const response = await fetch("../api/road_condition/get_cctv_ai.php");

    const result = await response.json();

    return result

  } catch(error) {
    console.log(error);
  }
}

export async function getRoadMapTrafficlevel() {
  try {
    const response = await fetch("../api/get_road_map.php");

    return await response.json();
  } catch(error) {
    console.error(error);
    return [];
  }
}

export async function getTrafficTrendAndCongestionLogs(filters = {}) {
  try {

    const params = new URLSearchParams(filters);

    const response = await fetch(
      `../api/road_condition/get_traffic_trend.php?${params.toString()}`
    );

    return await response.json();

  } catch (error) {
    console.error(error);
    return [];
  }
}