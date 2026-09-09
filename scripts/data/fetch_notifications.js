export async function getNotifications() {
  const response = await fetch('../api/notifications/get_notifications.php');

  const result = await response.json();

  return result;
}

export async function generateNotifications() {

  const response = await fetch('../api/notifications/generate_notifications.php');

  const result = await response.json();

  return result;

}

export async function markNotificationAsRead(notificationId) {

  const response = await fetch(
    "../api/notifications/mark_notification_read.php",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        notification_id: notificationId
      })
    }
  );

  const result = await response.json();

  return result;

}