export function getMeetingStatusClass(status) {

  switch (status) {

    case "Scheduled":
      return "status-scheduled";

    case "Meeting Today":
      return "status-today";

    case "Re-schedule":
      return "status-reschedule";

    case "Rejected":
      return "status-rejected";

    default:
      return "status-scheduled";

  }

}

export function updateMeetingStatusColor(select) {

  select.classList.remove(
    "status-scheduled",
    "status-today",
    "status-reschedule",
    "status-rejected"
  );

  select.classList.add(
    getMeetingStatusClass(select.value)
  );

}