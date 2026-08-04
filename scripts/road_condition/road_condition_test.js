import { renderCctvAi } from "./render_cctv.js";
import { startTrafficStore } from "../data/road_condition/trafficStore.js";

document.addEventListener("DOMContentLoaded", async () => {
  const cctvContainer = document.getElementById("cctvManagementContainer");

  startTrafficStore();

  renderCctvAi(cctvContainer);
});