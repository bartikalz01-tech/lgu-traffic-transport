export async function getNotifications() {
  const response = await fetch('../api/notifications/get_notifications.php');

  const result = response.json();

  return result;
}

export async function generateNotifications() {

  const response = await fetch('../api/notifications/generate_notifications.php');

  const result = response.json();

  return result;

}