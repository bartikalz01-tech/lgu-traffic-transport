document.addEventListener("DOMContentLoaded", () => {
  const profileWrapper = document.querySelector(".user-profile-wrapper");

  const profileButton = document.getElementById("userProfileBtn");
  
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