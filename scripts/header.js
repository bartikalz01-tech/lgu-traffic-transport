import { openNotificationModal } from "./header_components/open_notification_modal.js";

document.addEventListener("DOMContentLoaded", () => {
  const profileWrapper = document.querySelector(".user-profile-wrapper");
  const notificationOverlay = document.getElementById("notificationOverlay");

  const profileButton = document.getElementById("userProfileBtn");
  const notificationBtn = document.getElementById("notificationBtn");
  
  if(!profileWrapper || !profileButton) {
    return;
  }

  profileButton.addEventListener("click", (event) => {
    event.stopPropagation();
    
    profileWrapper.classList.toggle("open");
  });

  document.addEventListener("click", (event) => {

    if(!profileWrapper.contains(event.target)) {
      profileWrapper.classList.remove("open");
    }
  });

  document.addEventListener("keydown", (event) => {
    if(event.key === "Escape") {
      profileWrapper.classList.remove("open");
    }
  });

  notificationBtn.addEventListener("click", () => {
    openNotificationModal(notificationOverlay);
  });

});


document.addEventListener('DOMContentLoaded', function() {
  function updateClock() {
    const now = new Date();
    
    // Convert to Philippines time (UTC+8)
    const philippinesTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Manila' }));
    
    let hours = philippinesTime.getHours();
    const minutes = String(philippinesTime.getMinutes()).padStart(2, '0');
    const seconds = String(philippinesTime.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12 || 12; // Convert to 12-hour format
    const timeString = `${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
    
    document.getElementById('liveClock').textContent = timeString;
  }
  
  // Update immediately
  updateClock();
  
  // Update every second
  setInterval(updateClock, 1000);
});