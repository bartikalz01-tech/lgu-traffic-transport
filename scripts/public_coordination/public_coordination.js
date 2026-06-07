import { renderPuvDiversion } from "./render_puv_diversion.js";
import { renderPuvManagement } from "./render_puv_management.js";

document.addEventListener("DOMContentLoaded", async () => {

  const puvManagementBtn = document.getElementById("puvManagementBtn");
  const puvDiversionBtn = document.getElementById("puvDiversionBtn");

  const ptcContainers = document.getElementById("ptcContainers");

  function setActiveBtn(activeBtnClicked) {
    [puvManagementBtn, puvDiversionBtn].forEach(btn => {
      btn.classList.remove("active");
    });

    activeBtnClicked.classList.add("active");
  }

  /*function showContainer(target) {
    puvManagementContainer.classList.add("hidden-container");
    puvDiversionContainer.classList.add("hidden-container");

    target.classList.remove("hidden-container");
  }*/

  setActiveBtn(puvManagementBtn);
  puvManagementBtn.classList.add("expanded");
  await renderPuvManagement(ptcContainers);

  puvManagementBtn.addEventListener("click", async () => {

    if(!puvManagementBtn.classList.contains("active")) {
      setActiveBtn(puvManagementBtn);
      await renderPuvManagement(ptcContainers);

      puvManagementBtn.classList.add("expanded");
      return;
    }

    puvManagementBtn.classList.toggle("expanded");
  });

  puvDiversionBtn.addEventListener("click", async () => {
    setActiveBtn(puvDiversionBtn);
    await renderPuvDiversion(ptcContainers);

    puvManagementBtn.classList.remove("expanded");
  });

});