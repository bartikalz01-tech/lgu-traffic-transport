import { getQuickReportOverlay } from "../global_variables.js";
import { renderViolationQuickReport } from "./quick_violation_report.js";

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

const quickReportOverlay = getQuickReportOverlay() ;

quickReportOverlay.addEventListener('click', (e) => {
  const closeQuickReportBtn = e.target.closest('.js-exit-quick-reports');

  if(!closeQuickReportBtn) return;

  quickReportOverlay.classList.add('hidden');
  quickReportOverlay.innerHTML = '';
});

document.getElementById('quickIssueBtn').addEventListener('click', () => {
  renderViolationQuickReport();
});