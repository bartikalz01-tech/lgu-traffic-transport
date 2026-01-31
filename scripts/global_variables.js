export const openSidebarBtn = document.querySelector('.hamburger-menu-btn');
export const closeSidebarBtn = document.querySelector('.sidebar-close-btn');
export const sidebar = document.querySelector('.sidebar-container');
export const sidebarOverlay = document.querySelector('.sidebar-overlay');
export const cctvHTML = document.querySelector('.cctv-feed');
export const cctvGrid = document.querySelector('.js-cctv-grid');
export const roadOverlay = document.querySelector('.road-condition-overlay');
export const dateFilter = document.querySelector('.date-filter');
export const toggleBtn = document.querySelector('.date-filter-btn');
export const fromInput = document.getElementById('dateFrom');
export const toInput = document.getElementById('dateTo');
export const applyBtn = document.querySelector('.date-filter-actions .btn-primary');
export const clearBtn = document.querySelector('.date-filter-actions .btn-secondary');
export const accidentItems = document.querySelectorAll('.accident-item');
export const trafficTbody = document.querySelector('#traffic-table-body');
export const brgyTrafficStatus = document.querySelector('.js-traffic-status-indicator');

export function getQuickReportOverlay() {
  return document.querySelector('.quick-report-overlay');
}

export function getDetailedReports() {
  return document.querySelector('.detailed-reports-overlay');
}

export function getReportTicket() {
  return document.querySelector();
}