function initMap() {
  // Location (example: Manila)
  const location = {
    lat: 14.5995,
    lng: 120.9842
  };

  // Create the map
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: location
  });

  // Marker
  const marker = new google.maps.Marker({
    position: location,
    map: map,
    title: "Manila, Philippines"
  });
}
