import { openPublicTransportCoordination } from "./public_groups.js";

document.addEventListener("DOMContentLoaded", () => {
  openPublicTransportCoordination(document.getElementById("publicTransportCoordinationContainer"));
});