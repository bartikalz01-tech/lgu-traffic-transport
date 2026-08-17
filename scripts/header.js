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