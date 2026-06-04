import { renderPuvDiversion } from "./render_puv_diversion.js";
import { renderPuvManagement } from "./render_puv_management.js";

document.addEventListener("DOMContentLoaded", async () => {

  const puvManagementBtn = document.getElementById("puvManagementBtn");
  const puvDiversionBtn = document.getElementById("puvDiversionBtn");

  const puvManagementContainer = document.getElementById("puvManagementContainer");
  const puvDiversionContainer = document.getElementById("puvDiversionContainer");

  function setActiveBtn(activeBtnClicked) {
    [puvManagementBtn, puvDiversionBtn].forEach(btn => {
      btn.classList.remove("active");
    });

    activeBtnClicked.classList.add("active");
  }

  function showContainer(target) {
    puvManagementContainer.classList.add("hidden-container");
    puvDiversionContainer.classList.add("hidden-container");

    target.classList.remove("hidden-container");
  }

  showContainer(puvManagementContainer);
  setActiveBtn(puvManagementBtn);
  await renderPuvManagement(puvManagementContainer);

  puvManagementBtn.addEventListener("click", async () => {
    showContainer(puvManagementContainer);
    setActiveBtn(puvManagementBtn);
    await renderPuvManagement(puvManagementContainer);
  });

  puvDiversionBtn.addEventListener("click", async () => {
    showContainer(puvDiversionContainer);
    setActiveBtn(puvDiversionBtn);
    await renderPuvDiversion(puvDiversionContainer);
  });

});