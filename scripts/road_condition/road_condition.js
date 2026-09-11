import { renderCctvAi } from "./render_cctv.js";
import { startTrafficStore } from "../data/road_condition/trafficStore.js";
import { startGlobalNotifications } from "../navigavtion/global_notifications.js";

document.addEventListener("DOMContentLoaded", async () => {
  const cctvContainer = document.getElementById("cctvManagementContainer");

  startTrafficStore();

  renderCctvAi(cctvContainer);

  startGlobalNotifications();
});