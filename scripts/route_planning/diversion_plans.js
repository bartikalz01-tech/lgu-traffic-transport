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

  diversionBtn.addEventListener('click', () => {
    showContainer(diversionContainer);
    setActiveBtn(diversionBtn);
  });

  activeBtn.addEventListener('click', () => {
    showContainer(activeContainer);
    setActiveBtn(activeBtn);
  });

  resolvedBtn.addEventListener('click', () => {
    showContainer(resolvedContainer);
    setActiveBtn(resolvedBtn);
  });
});