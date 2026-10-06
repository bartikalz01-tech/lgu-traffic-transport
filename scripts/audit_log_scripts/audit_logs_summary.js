/* =========================================================
   RENDER AUDIT LOG SUMMARY
========================================================= */

export function renderAuditLogsSummary(auditLogs) {

  const totalAuditLogs = document.getElementById("totalAuditLogs");
  const totalCreateLogs = document.getElementById("totalCreateLogs");
  const totalUpdateLogs = document.getElementById("totalUpdateLogs");
  const totalAuthenticationLogs = document.getElementById("totalAuthenticationLogs");


  /* -----------------------------------------
     Validate elements
  ----------------------------------------- */

  if (
    !totalAuditLogs ||
    !totalCreateLogs ||
    !totalUpdateLogs ||
    !totalAuthenticationLogs
  ) {
    console.error("Audit log summary elements were not found.");
    return;
  }


  /* -----------------------------------------
     Validate data
  ----------------------------------------- */

  if (!Array.isArray(auditLogs)) {

    totalAuditLogs.textContent = "0";
    totalCreateLogs.textContent = "0";
    totalUpdateLogs.textContent = "0";
    totalAuthenticationLogs.textContent = "0";

    return;
  }


  /* -----------------------------------------
     Calculate summary
  ----------------------------------------- */

  const totalLogs = auditLogs.length;

  const createLogs = auditLogs.filter(
    log => log.action === "CREATE"
  ).length;

  const updateLogs = auditLogs.filter(
    log => log.action === "UPDATE"
  ).length;

  const authenticationLogs = auditLogs.filter(
    log =>
      log.action === "LOGIN" ||
      log.action === "LOGOUT"
  ).length;


  /* -----------------------------------------
     Render summary
  ----------------------------------------- */

  totalAuditLogs.textContent = totalLogs;

  totalCreateLogs.textContent = createLogs;

  totalUpdateLogs.textContent = updateLogs;

  totalAuthenticationLogs.textContent = authenticationLogs;

}