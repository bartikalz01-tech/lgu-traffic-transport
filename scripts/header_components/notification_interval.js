import { generateNotifications } from "../data/fetch_notifications.js";

let notificationGenerationInterval = null;

export function startNotificationGeneration() {

  if(notificationGenerationInterval) {
    return;
  }

  generateNotifications();

  notificationGenerationInterval = setInterval(async () => {
    try {
      const result = await generateNotifications();

      console.log("Notification generation: ", result);
    } catch(error) {
      console.error("Unable to generate notification:", error);
    }
  }, 5000);

}