export async function getNotifications() {
  const endpoint = new URL(
    '../../api/notifications/get_notifications.php',
    import.meta.url
  );

  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(`Notifications request failed: HTTP ${response.status}`);
  }

  const result = await response.json();

  return result;
}