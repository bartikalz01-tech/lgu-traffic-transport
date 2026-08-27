import { renderTicketPanel } from "./tickets_panel.js";


document.addEventListener("DOMContentLoaded", () => {

  const ticketPanel = document.getElementById("ticketPanelContainer");

  renderTicketPanel(ticketPanel);
});