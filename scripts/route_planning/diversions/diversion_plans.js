import { renderDiversionRoutes } from "./render_diversion.js";
import { renderActiveRoutes } from "../diversions/render_active.js";
import { renderResolvedRoutes } from "./render_resolved.js";
import { startActiveRoutesRefresh } from "../../utils/diversions.js";
import { fetchAllDiversionStatus } from "../../data/fetch_road_map.js";

document.addEventListener("DOMContentLoaded", async () => {
  const diversionBtn = document.getElementById("navDiversion");
  const activeBtn = document.getElementById("navActive");
  const resolvedBtn = document.getElementById("navResolved");

  const diversionContainer = document.getElementById("diversionContainer");
  const activeContainer = document.getElementById("activeContainer");
  const resolvedContainer = document.getElementById("resolvedContainer");

  let cachedActiveRoutes = [];

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

  cachedActiveRoutes = await fetchAllDiversionStatus();

  showContainer(diversionContainer);
  setActiveBtn(diversionBtn);
  await renderDiversionRoutes(diversionContainer);

  diversionBtn.addEventListener('click', async () => {
    showContainer(diversionContainer);
    setActiveBtn(diversionBtn);
    await renderDiversionRoutes(diversionContainer);
  });

  let activeIntervalStarted = false;
  activeBtn.addEventListener('click', async () => {
    showContainer(activeContainer);
    setActiveBtn(activeBtn);
    await renderActiveRoutes(activeContainer, cachedActiveRoutes);

    if(!activeIntervalStarted) {
      startActiveRoutesRefresh(activeContainer);
      activeIntervalStarted = true;
    }
  });

  resolvedBtn.addEventListener('click', async () => {
    showContainer(resolvedContainer);
    setActiveBtn(resolvedBtn);

    setTimeout(async () => {
      renderResolvedRoutes(resolvedContainer);
    }, 100);
  });
});