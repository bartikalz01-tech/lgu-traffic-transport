import { renderTicketPanel } from "./tickets_panel.js";
import { createTicketModal } from "./create_ticket.js";
import { startGlobalNotifications } from "../navigavtion/global_notifications.js";

document.addEventListener("DOMContentLoaded", () => {

  startGlobalNotifications();

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