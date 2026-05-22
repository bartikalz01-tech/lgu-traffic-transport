import { renderAddGroup } from "./add_group.js";

document.addEventListener("DOMContentLoaded", () => {
  //const map = L.map('map').setView([14.6414, 120.9909], 18);

  const toggleBtn = document.getElementById('togglePuvSidebar');
  const layout = document.getElementById('puvLayout');

  toggleBtn.addEventListener('click', () => {
    layout.classList.toggle('collapsed');

    /*setTimeout(() => {
      map.invalidateSize({ animate: true });
    }, 350);*/
  });

  const addGroupContainer = document.getElementById("addGroupOverlay");
  const addGroupBtn = document.getElementById("addGroupBtn");

  addGroupBtn.addEventListener("click", () => {
    addGroupContainer.classList.remove("add-puv-group-hidden");

    renderAddGroup(addGroupContainer);
  });

 /* L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributers'
  }).addTo(map);*/
});