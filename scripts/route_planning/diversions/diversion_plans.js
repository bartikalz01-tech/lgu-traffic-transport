import { renderDiversionRoutes } from "./render_diversion.js";
import { renderActiveRoutes } from "../diversions/render_active.js";
import { renderResolvedRoutes } from "../render_resolved.js";

document.addEventListener("DOMContentLoaded", async () => {
  const diversionBtn = document.getElementById("navDiversion");
  const activeBtn = document.getElementById("navActive");
  const resolvedBtn = document.getElementById("navResolved");

  const diversionContainer = document.getElementById("diversionContainer");
  const activeContainer = document.getElementById("activeContainer");
  const resolvedContainer = document.getElementById("resolvedContainer");

  function setActiveBtn(activeBtnClicked) {
    [diversionBtn, activeBtn, resolvedBtn].forEach(btn => {
      btn.classList.remove("active");
    });

    activeBtnClicked.classList.add("active");
  }

  function showContainer(target) {
    diversionContainer.classList.add("hidden");
    activeContainer.classList.add("hidden");
    resolvedContainer.classList.add("hidden");

    target.classList.remove("hidden");
  }

  showContainer(diversionContainer);
  setActiveBtn(diversionBtn);
  await renderDiversionRoutes(diversionContainer);

  diversionBtn.addEventListener('click', async () => {
    showContainer(diversionContainer);
    setActiveBtn(diversionBtn);
    await renderDiversionRoutes(diversionContainer);
  });

  activeBtn.addEventListener('click', async () => {
    showContainer(activeContainer);
    setActiveBtn(activeBtn);
    renderActiveRoutes(activeContainer);
  });

  resolvedBtn.addEventListener('click', async () => {
    showContainer(resolvedContainer);
    setActiveBtn(resolvedBtn);
    renderResolvedRoutes(resolvedContainer);
  });
});