export function formatAccidentDateTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return '—';

  // Combine date + time into one Date object
  const dateTime = new Date(`${dateStr}T${timeStr}`);

  if (isNaN(dateTime)) return '—';

  const datePart = dateTime.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  });

  const timePart = dateTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return `${datePart} · ${timePart}`;
}
