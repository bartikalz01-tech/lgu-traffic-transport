export function formatMeetingDate(value) {

  if (!value) {
    return "Pending";
  }

  const date = new Date(value + "T00:00:00");

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}


export function formatMeetingTime(value) {

  if (!value) {
    return "Pending";
  }

  const [hours, minutes] = value.split(":");

  const date = new Date();

  date.setHours(
    Number(hours),
    Number(minutes),
    0,
    0
  );

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });
}