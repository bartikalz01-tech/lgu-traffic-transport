import { renderDiversionRoutes } from "./render_diversion.js";
import { renderActiveRoutes } from "./render_active.js";
import { renderResolvedRoutes } from "./render_resolved.js";

document.addEventListener("DOMContentLoaded", () => {
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
  renderDiversionRoutes(diversionContainer);

  diversionBtn.addEventListener('click', () => {
    showContainer(diversionContainer);
    setActiveBtn(diversionBtn);
    renderDiversionRoutes(diversionContainer);
  });

  activeBtn.addEventListener('click', () => {
    showContainer(activeContainer);
    setActiveBtn(activeBtn);
    renderActiveRoutes(activeContainer);
  });

  resolvedBtn.addEventListener('click', () => {
    showContainer(resolvedContainer);
    setActiveBtn(resolvedBtn);
    renderResolvedRoutes(resolvedContainer);
  });
});