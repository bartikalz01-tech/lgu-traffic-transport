document.addEventListener('DOMContentLoaded', function () {
  const openSidebarBtn = document.querySelector('.hamburger-menu-btn');
  const closeSidebarBtn = document.querySelector('.sidebar-close-btn');
  const sidebar = document.querySelector('.sidebar-container');
  const sidebarOverlay = document.querySelector('.sidebar-overlay');

  if (openSidebarBtn && sidebar && sidebarOverlay) {
    openSidebarBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      sidebarOverlay.classList.toggle('visible');
    });
  }

  if (closeSidebarBtn && sidebar && sidebarOverlay) {
    closeSidebarBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      sidebarOverlay.classList.toggle('visible');
    });
  }

  // Close sidebar when clicking overlay
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
      if (sidebar) {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('visible');
      }
    });
  }
});

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