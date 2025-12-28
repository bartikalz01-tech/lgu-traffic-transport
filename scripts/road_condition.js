const openSidebarBtn = document.querySelector('.hamburger-menu-btn');
const closeSidebarBtn = document.querySelector('.sidebar-close-btn');
const sidebar = document.querySelector('.sidebar-container');
const sidebarOverlay = document.querySelector('.sidebar-overlay');

let overlay = false;

openSidebarBtn.addEventListener('click', () => {
  
});

/*function createOverlay() {
  let overlay = document.querySelector('.sidebar-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
  }
  return overlay;
}

function openSidebar() {
  if (!sidebar) return;
  sidebar.classList.add('open');
  const overlay = createOverlay();
  // close when clicking the overlay
  overlay.addEventListener('click', closeSidebar);
}

function closeSidebar() {
  if (!sidebar) return;
  sidebar.classList.remove('open');
  const overlay = document.querySelector('.sidebar-overlay');
  if (overlay) overlay.remove();
}

if (openSidebarBtn) openSidebarBtn.addEventListener('click', openSidebar);
if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeSidebar);*/

