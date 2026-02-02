import { dateFilter, toggleBtn, fromInput, toInput, applyBtn, clearBtn, getQuickReportOverlay, accidentItems, getDetailedReports, accidentList } from '../global_variables.js';
import { renderQuickReport } from './quick_reports.js';
import { detailedAccidentReport } from './detailed_accident.js';
import { getAccidentCases } from '../data/accident_cases.js'; 

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

//const accidentItems = document.querySelectorAll('.accident-item');

/* -----------------------------
  TOGGLE DATE FILTER
----------------------------- */
toggleBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  dateFilter.classList.toggle('open');
  console.log(e.target); 
});

document.addEventListener('click', (e) => {
  if (!dateFilter.contains(e.target) && e.target !== toggleBtn) {
    dateFilter.classList.remove('open');
  }
});

/* -----------------------------
  APPLY FILTER
----------------------------- */
applyBtn.addEventListener('click', () => {
  const fromDate = fromInput.value ? new Date(fromInput.value) : null;
  const toDate = toInput.value ? new Date(toInput.value) : null;

  // normalize "to" date to end of day
  if (toDate) {
    toDate.setHours(23, 59, 59, 999);
  }

  accidentItems.forEach(item => {
    const timeText = item.querySelector('.accident-time').textContent;
    const itemDate = parseAccidentDate(timeText);

    if (!itemDate) {
      item.style.display = 'none';
      return;
    }

    let visible = true;

    if (fromDate && itemDate < fromDate) visible = false;
    if (toDate && itemDate > toDate) visible = false;

    item.style.display = visible ? '' : 'none';
  });

  dateFilter.classList.remove('open');
});

/* -----------------------------
  CLEAR FILTER
----------------------------- */
clearBtn.addEventListener('click', () => {
  fromInput.value = '';
  toInput.value = '';

  accidentItems.forEach(item => {
    item.style.display = '';
  });

  dateFilter.classList.remove('open');
});

/* -----------------------------
  DATE PARSER (REAL DATES)
----------------------------- */
function parseAccidentDate(text) {
  // Example: "Jan 6, 10:15 AM"
  const parsed = new Date(text);

  return isNaN(parsed) ? null : parsed;
}

// quick reports logic
const quickReportOverlay = getQuickReportOverlay() ;

quickReportOverlay.addEventListener('click', (e) => {
  const closeQuickReportBtn = e.target.closest('.js-exit-quick-reports');

  if(!closeQuickReportBtn) return;

  quickReportOverlay.classList.add('hidden');
  quickReportOverlay.innerHTML = '';
});

document.getElementById('quickReportsBtn').addEventListener('click', () => {
  renderQuickReport();
});


// detailed reports detail logic
const detailedReports = getDetailedReports();

detailedReports.addEventListener('click', (e) => {
  const closeDetailReport = e.target.closest('.js-exit-accident-details');

  if(!closeDetailReport) return;

  detailedReports.classList.add('detailed-reports-hidden');
  detailedReports.innerHTML = '';
});

accidentList.addEventListener('click', (e) => {
  const modifyBtn = e.target.closest('.js-modify-report');
  if(!modifyBtn) return;

  const accidentItem = modifyBtn.closest('.accident-item');
  const accidentId = accidentItem.querySelector('.accident-id')?.textContent;

  console.log('Opening report for:', accidentId);

  detailedAccidentReport();
});

getAccidentCases().then(data => {
  console.log(data);
});