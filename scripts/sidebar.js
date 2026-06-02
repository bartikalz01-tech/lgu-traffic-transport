window.addEventListener('load', function () {
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

  const currentPage = window.location.pathname.split('/').pop();
  const sidebarLinks = document.querySelectorAll('.sidebar-link, .dropdown-menu a');

  sidebarLinks.forEach(link => {

    const href = link.getAttribute('href');

    if(!href || href === "#") return;

    const linkPage = href.split('/').pop();

    if(currentPage === linkPage) {
      link.classList.add('active');

      const dropdownParent = link.closest('.sidebar-item.has-dropdown');

      if(dropdownParent) {
        dropdownParent.classList.add('open');
      }
    }

  });


  document.querySelectorAll('.sidebar-item.has-dropdown').forEach(item => {
    const toggleBtn = item.querySelector('.dropdown-toggle');

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      item.classList.toggle('open');
    });
  });
});