const openSidebarBtn = document.querySelector('.hamburger-menu-btn');
const closeSidebarBtn = document.querySelector('.sidebar-close-btn');
const sidebar = document.querySelector('.sidebar-container');
const sidebarOverlay = document.querySelector('.sidebar-overlay');

let overlay = false;

openSidebarBtn.addEventListener('click', () => {
  sidebar.classList.toggle('open');
  sidebarOverlay.classList.toggle('visible');
});

closeSidebarBtn.addEventListener('click', () => {
  sidebar.classList.toggle('open');
  sidebarOverlay.classList.toggle('visible');
});