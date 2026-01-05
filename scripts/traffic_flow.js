//import { openSidebarBtn, closeSidebarBtn, sidebar, sidebarOverlay } from "./road_variables.js";
//import { initSidebar } from "./road_condition.js";  

/*window.initMap = function () {
  //const location = { lat: 14.5995, lng: 120.9842 };
  const location = { lat: 14.641401, lng: 120.990927 };

  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 18.1,
    center: location
  });

  new google.maps.Marker({
    position: location,
    map,
    title: "Brgy 127, Caloocan, Philippines"
  });
};*/

window.initMap = function () {
  //const location = { lat: 14.5995, lng: 120.9842 };
  const location = { lat: 14.641401, lng: 120.990927 };

  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 18.1,
    center: location
  });

  new google.maps.Marker({
    position: location,
    map,
    title: "Brgy 127, Caloocan, Philippines"
  });
  // Define road paths as polylines to highlight the streets
  // RED polylines - High traffic streets
    // Define road paths as polylines to highlight the streets
  // RED polylines - High traffic streets
  const domeStreetPath = [
    { lat: 14.6410, lng: 120.9905 },
    { lat: 14.6408, lng: 120.9902 },
    { lat: 14.6406, lng: 120.9899 },
    { lat: 14.6404, lng: 120.9896 },
    { lat: 14.6402, lng: 120.9893 },
    { lat: 14.6400, lng: 120.9890 },
    { lat: 14.6398, lng: 120.9887 }
  ];

  const tagatayStreetPath = [
    { lat: 14.641401, lng: 120.990927 },
    { lat: 14.6415, lng: 120.9912 },
    { lat: 14.6416, lng: 120.9915 },
    { lat: 14.6417, lng: 120.9918 },
    { lat: 14.6418, lng: 120.9921 },
    { lat: 14.6419, lng: 120.9924 },
    { lat: 14.6420, lng: 120.9927 },
    { lat: 14.6421, lng: 120.9930 }
  ];

  const klawitStreetPath = [
    { lat: 14.6412, lng: 120.9910 },
    { lat: 14.6410, lng: 120.9913 },
    { lat: 14.6408, lng: 120.9916 },
    { lat: 14.6406, lng: 120.9919 },
    { lat: 14.6404, lng: 120.9922 },
    { lat: 14.6402, lng: 120.9925 },
    { lat: 14.6400, lng: 120.9928 }
  ];

  // YELLOW polylines - Moderate traffic streets
  const kalandangStreetPath = [
    { lat: 14.6414, lng: 120.9900 },
    { lat: 14.6416, lng: 120.9897 },
    { lat: 14.6418, lng: 120.9894 },
    { lat: 14.6420, lng: 120.9891 },
    { lat: 14.6422, lng: 120.9888 },
    { lat: 14.6424, lng: 120.9885 },
    { lat: 14.6426, lng: 120.9882 }
  ];

  // GREEN polylines - Low traffic streets (#2ecc71)
  const mtNatibStreetPath = [
    { lat: 14.6422, lng: 120.9900 },
    { lat: 14.6424, lng: 120.9897 },
    { lat: 14.6426, lng: 120.9894 },
    { lat: 14.6428, lng: 120.9891 },
    { lat: 14.6430, lng: 120.9888 },
    { lat: 14.6432, lng: 120.9885 },
    { lat: 14.6434, lng: 120.9882 }
  ];

  const maubanStreetPath = [
    { lat: 14.6405, lng: 120.9908 },
    { lat: 14.6403, lng: 120.9905 },
    { lat: 14.6401, lng: 120.9902 },
    { lat: 14.6399, lng: 120.9899 },
    { lat: 14.6397, lng: 120.9896 },
    { lat: 14.6395, lng: 120.9893 },
    { lat: 14.6393, lng: 120.9890 }
  ];

  // Create RED polylines (High traffic)
  // Dome Street - RED
  new google.maps.Polyline({
    path: domeStreetPath,
    geodesic: true,
    strokeColor: '#FF0000',  // Red
    strokeOpacity: 0.8,
    strokeWeight: 5,
    map: map
  });

  // Klawit Street - RED (example)
  new google.maps.Polyline({
    path: klawitStreetPath,
    geodesic: true,
    strokeColor: '#FF0000',  // Red
    strokeOpacity: 0.8,
    strokeWeight: 5,
    map: map
  });

  // Create YELLOW polylines (Moderate traffic)
  // Tagatay Street - YELLOW
  new google.maps.Polyline({
    path: tagatayStreetPath,
    geodesic: true,
    strokeColor: '#FFFF00',  // Yellow
    strokeOpacity: 0.8,
    strokeWeight: 5,
    map: map
  });

  // Kalandang Street - YELLOW (example)
  new google.maps.Polyline({
    path: kalandangStreetPath,
    geodesic: true,
    strokeColor: '#FFFF00',  // Yellow
    strokeOpacity: 0.8,
    strokeWeight: 5,
    map: map
  });

  // Create GREEN polylines (Low traffic)
  new google.maps.Polyline({
    path: mtNatibStreetPath,
    geodesic: true,
    strokeColor: '#2ecc71',  // Green
    strokeOpacity: 0.8,
    strokeWeight: 5,
    map: map
  });

  new google.maps.Polyline({
    path: maubanStreetPath,
    geodesic: true,
    strokeColor: '#2ecc71',  // Green
    strokeOpacity: 0.8,
    strokeWeight: 5,
    map: map
  });
};

document.addEventListener('DOMContentLoaded', function() {
  const openSidebarBtn = document.querySelector('.hamburger-menu-btn');
  const closeSidebarBtn = document.querySelector('.sidebar-close-btn');
  const sidebar = document.querySelector('.sidebar-container');
  const sidebarOverlay = document.querySelector('.sidebar-overlay');

  if (openSidebarBtn && sidebar && sidebarOverlay) {
    openSidebarBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      sidebarOverlay.classList.toggle('visible');
    });
  }

  if (closeSidebarBtn && sidebar && sidebarOverlay) {
    closeSidebarBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      sidebarOverlay.classList.toggle('visible');
    });
  }

  // Close sidebar when clicking overlay
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
      if (sidebar) {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('visible');
      }
    });
  }
});




/*async function initTrafficMap() {
    // 1. Properly import the libraries
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    // 2. Define the center (Caloocan)
    const centerPosition = { lat: 14.6416, lng: 120.9762 };

    // 3. Initialize the map
    const map = new Map(document.getElementById("google-map"), {
        zoom: 15,
        center: centerPosition,
        mapId: "DEMO_MAP_ID", 
        disableDefaultUI: false,
    });

    // 4. Hide the loading text
    const loader = document.getElementById('map-loader');
    if (loader) loader.style.display = 'none';

    // 5. Add a test marker
    new AdvancedMarkerElement({
        map: map,
        position: centerPosition,
        title: "Center Point",
    });
}

// Run the function
initTrafficMap().catch(e => {
    console.error("Map failed to load: ", e);
});*/

/*const map = new google.maps.Map(document.getElementById("google-map"), {
  center: { lat: 14.6416, lng: 120.9762 },
  zoom: 15,
});*/
