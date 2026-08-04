export async function getCctvAiDetails() {
  try {
    const response = await fetch("../api/road_condition/get_cctv_ai.php");

    const result = await response.json();

    return result

  } catch(error) {
    console.log(error);
  }
}