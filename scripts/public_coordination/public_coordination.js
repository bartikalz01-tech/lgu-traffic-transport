import { renderPuvManagement } from "./render_puv_management.js";

document.addEventListener("DOMContentLoaded", async () => {

  const ptcContainer = document.getElementById("ptcContainers");

  await renderPuvManagement(ptcContainer);

});