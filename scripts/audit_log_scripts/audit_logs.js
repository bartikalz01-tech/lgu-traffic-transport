import { getAuditLogs } from "../data/audit_logs_data/fetch_audit_logs.js";

/* =========================================================
   HELPERS
========================================================= */

function escapeHTML(value) {

  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


/* =========================================================
   ACTION CONFIGURATION
========================================================= */

function getActionConfig(action) {

  const configs = {

    CREATE: {
      className: "create",
      icon: "fas fa-plus"
    },

    UPDATE: {
      className: "update",
      icon: "fas fa-pen"
    },

    LOGIN: {
      className: "login",
      icon: "fas fa-right-to-bracket"
    },

    LOGOUT: {
      className: "logout",
      icon: "fas fa-right-from-bracket"
    },

    DELETE: {
      className: "delete",
      icon: "fas fa-trash"
    }

  };

  return configs[action] || {
    className: "default",
    icon: "fas fa-circle-info"
  };

}


/* =========================================================
   MODULE CONFIGURATION
========================================================= */

function getModuleConfig(module) {

  const configs = {

    "Violation Reports": {
      className: "violation",
      icon: "fas fa-triangle-exclamation"
    },

    "Accident Reports": {
      className: "accident",
      icon: "fas fa-car-burst"
    },

    "Authentication": {
      className: "authentication",
      icon: "fas fa-lock"
    }

  };

  return configs[module] || {
    className: "default",
    icon: "fas fa-folder"
  };

}


/* =========================================================
   DATE FORMATTER
========================================================= */

function formatAuditDate(dateTime) {

  if (!dateTime) {
    return {
      date: "—",
      time: "—"
    };
  }

  const [datePart, timePart] = dateTime.split(" ");

  const [year, month, day] = datePart.split("-").map(Number);

  const [hour, minute] = timePart.split(":").map(Number);

  const date = new Date(year, month - 1, day);

  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const formattedTime = new Date(
    2000,
    0,
    1,
    hour,
    minute
  ).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });

  return {
    date: formattedDate,
    time: formattedTime
  };

}


/* =========================================================
   ACTIVITY TITLE
========================================================= */

function getActivityTitle(log) {

  if (log.action === "LOGIN") {
    return "User Login";
  }

  if (log.action === "LOGOUT") {
    return "User Logout";
  }

  return log.entity_type || "System Activity";

}


/* =========================================================
   RENDER AUDIT LOGS
========================================================= */

function renderAuditLogs(auditLogs) {

  const tableBody = document.getElementById("auditLogsTableBody");

  if (!tableBody) {
    console.error("auditLogsTableBody was not found.");
    return;
  }


  /* -----------------------------------------
     Empty / invalid data
  ----------------------------------------- */

  if (!Array.isArray(auditLogs) || auditLogs.length === 0) {

    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="audit-empty-state">
          <div>
            <i class="fas fa-clipboard-list"></i>
            <strong>No audit logs found</strong>
            <span>There are currently no recorded system activities.</span>
          </div>
        </td>
      </tr>
    `;

    return;
  }


  /* -----------------------------------------
     Render rows
  ----------------------------------------- */

  tableBody.innerHTML = auditLogs.map(log => {

    const actionConfig = getActionConfig(log.action);

    const moduleConfig = getModuleConfig(log.module);

    const { date, time } = formatAuditDate(log.created_at);

    const activityTitle = getActivityTitle(log);

    const entityText = log.entity_id
      ? `Entity #${escapeHTML(log.entity_id)}`
      : "No entity";


    const reference = log.public_reference
      ? `
        <span class="audit-reference">
          ${escapeHTML(log.public_reference)}
        </span>
      `
      : `
        <span class="audit-reference empty">
          —
        </span>
      `;


    return `
      <tr>

        <!-- ACTIVITY -->
        <td>

          <div class="audit-activity">

            <div class="audit-activity-icon ${actionConfig.className}">
              <i class="${actionConfig.icon}"></i>
            </div>

            <div>

              <strong>
                ${escapeHTML(activityTitle)}
              </strong>

              <span>
                ${entityText}
              </span>

            </div>

          </div>

        </td>


        <!-- USER -->
        <td>

          <div class="audit-user">

            <div class="audit-user-avatar">
              ${escapeHTML(getInitials(log.full_name))}
            </div>

            <div>

              <strong>
                ${escapeHTML(log.full_name || "Unknown User")}
              </strong>

              <span>
                <i class="fas fa-user-shield"></i>
                ${escapeHTML(log.role || "Unknown Role")}
              </span>

            </div>

          </div>

        </td>


        <!-- MODULE -->
        <td>

          <span class="audit-module-badge ${moduleConfig.className}">

            <i class="${moduleConfig.icon}"></i>

            ${escapeHTML(log.module || "Unknown Module")}

          </span>

        </td>


        <!-- REFERENCE -->
        <td>

          ${reference}

        </td>


        <!-- DESCRIPTION -->
        <td>

          <div class="audit-description">

            ${escapeHTML(log.description || "No description available.")}

          </div>

        </td>


        <!-- DATE & TIME -->
        <td>

          <div class="audit-date">

            <strong>
              ${escapeHTML(date)}
            </strong>

            <span>
              ${escapeHTML(time)}
            </span>

          </div>

        </td>


        <!-- ACTION -->
        <td>

          <span class="audit-action-badge ${actionConfig.className}">

            <i class="${actionConfig.icon}"></i>

            ${escapeHTML(log.action)}

          </span>

        </td>

      </tr>
    `;

  }).join("");

}


/* =========================================================
   FILTER AUDIT LOGS
========================================================= */

function filterAuditLogs(auditLogs) {

  const searchInput = document.getElementById("auditLogSearch");
  const actionFilter = document.getElementById("auditActionFilter");
  const moduleFilter = document.getElementById("auditModuleFilter");

  if (!searchInput || !actionFilter || !moduleFilter) {
    console.error("Audit log filter elements were not found.");
    return;
  }


  const searchValue = searchInput.value
    .trim()
    .toLowerCase();

  const selectedAction = actionFilter.value;

  const selectedModule = moduleFilter.value;


  const filteredLogs = auditLogs.filter(log => {

    /* -----------------------------------------
       SEARCH
    ----------------------------------------- */

    const matchesSearch =
      !searchValue ||
      String(log.full_name || "").toLowerCase().includes(searchValue) ||
      String(log.action || "").toLowerCase().includes(searchValue) ||
      String(log.module || "").toLowerCase().includes(searchValue) ||
      String(log.entity_type || "").toLowerCase().includes(searchValue) ||
      String(log.entity_id || "").toLowerCase().includes(searchValue) ||
      String(log.public_reference || "").toLowerCase().includes(searchValue) ||
      String(log.description || "").toLowerCase().includes(searchValue);


    /* -----------------------------------------
       ACTION FILTER
    ----------------------------------------- */

    const matchesAction =
      selectedAction === "all" ||
      log.action === selectedAction;


    /* -----------------------------------------
       MODULE FILTER
    ----------------------------------------- */

    const matchesModule =
      selectedModule === "all" ||
      log.module === selectedModule;


    return (
      matchesSearch &&
      matchesAction &&
      matchesModule
    );

  });


  renderAuditLogs(filteredLogs);

}


/* =========================================================
   INITIALIZE AUDIT LOG FILTERS
========================================================= */

function initializeAuditLogFilters(auditLogs) {

  const searchInput = document.getElementById("auditLogSearch");
  const actionFilter = document.getElementById("auditActionFilter");
  const moduleFilter = document.getElementById("auditModuleFilter");
  const resetButton = document.getElementById("resetAuditFilters");


  if (
    !searchInput ||
    !actionFilter ||
    !moduleFilter ||
    !resetButton
  ) {
    console.error("Audit log filter controls were not found.");
    return;
  }


  /* -----------------------------------------
     SEARCH
  ----------------------------------------- */

  searchInput.addEventListener("input", () => {

    filterAuditLogs(auditLogs);

  });


  /* -----------------------------------------
     ACTION
  ----------------------------------------- */

  actionFilter.addEventListener("change", () => {

    filterAuditLogs(auditLogs);

  });


  /* -----------------------------------------
     MODULE
  ----------------------------------------- */

  moduleFilter.addEventListener("change", () => {

    filterAuditLogs(auditLogs);

  });


  /* -----------------------------------------
     RESET
  ----------------------------------------- */

  resetButton.addEventListener("click", () => {

    searchInput.value = "";

    actionFilter.value = "all";

    moduleFilter.value = "all";

    renderAuditLogs(auditLogs);

  });

}


/* =========================================================
   USER INITIALS
========================================================= */

function getInitials(fullName) {

  if (!fullName) {
    return "U";
  }

  const parts = fullName
    .trim()
    .split(/\s+/);

  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }

  return (
    parts[0][0] +
    parts[parts.length - 1][0]
  ).toUpperCase();

}


/* =========================================================
   INITIALIZE PAGE
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

  const auditLogsData = await getAuditLogs();

  renderAuditLogs(auditLogsData);
  initializeAuditLogFilters(auditLogsData);
});