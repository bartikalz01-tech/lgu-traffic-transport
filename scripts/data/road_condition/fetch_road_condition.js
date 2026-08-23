export async function insertCctvHistoricalRecord(data) {

  try {

    const response = await fetch(
      "../api/road_condition/insert_cctv_historical_record.php",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(data)
      }
    );


    const result = await response.json();


    if (!response.ok || !result.success) {

      throw new Error(
        result.message ||
        "Failed to save historical CCTV recording."
      );

    }


    return result;

  } catch (error) {

    console.error(
      "Failed to save CCTV historical record:",
      error
    );

    throw error;

  }

}

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

export async function getAverageSpeedHistoryLogs(filters = {}) {
  try {
    const params = new URLSearchParams(filters);

    const response = await fetch(`../api/road_condition/get_average_speed_history.php?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error("Failed to fetch average speed history:", error);
    return [];
  }
}

export async function getPeakHourAnalyticsLogs(filters = {}) {
  try {

    const params = new URLSearchParams(filters);

    const response = await fetch(
      `../api/road_condition/get_peak_hour_analytics.php?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    return await response.json();

  } catch (error) {

    console.error("Failed to fetch peak hour analytics:", error);

    return [];
  }
}