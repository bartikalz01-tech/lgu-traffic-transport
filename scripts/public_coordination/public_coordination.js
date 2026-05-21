const map = L.map('map').setView([14.6414, 120.9909], 18);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributers'
}).addTo(map);

const toggleBtn = document.getElementById('togglePuvSidebar');
const layout = document.getElementById('puvLayout');

toggleBtn.addEventListener('click', () => {
  layout.classList.toggle('collapsed');

  setTimeout(() => {
    map.invalidateSize({ animate: true });
  }, 350);
});