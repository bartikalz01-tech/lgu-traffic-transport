import { renderCctvAi } from "./render_cctv.js";

document.addEventListener("DOMContentLoaded", async () => {
  const cctvContainer = document.getElementById("cctvManagementContainer");

  renderCctvAi(cctvContainer);
});