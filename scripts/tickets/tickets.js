import { renderTicketPanel } from "./tickets_panel.js";
import { createTicketModal } from "./create_ticket.js";

document.addEventListener("DOMContentLoaded", () => {

  const ticketPanel = document.getElementById("ticketPanelContainer");

  const createTicketBtn =
    document.getElementById("createTicketBtn");

  const createTicketOverlay =
    document.querySelector(".create-ticket-overlay");

  renderTicketPanel(ticketPanel);

  createTicketBtn.addEventListener("click", () => {

    createTicketModal(createTicketOverlay);

  });
});