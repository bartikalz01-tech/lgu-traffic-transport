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

  // Traffic heatmap data for specific streets
  // Weight values: 0-0.3 = low traffic (green #2ecc71), 0.3-0.7 = moderate (yellow), 0.7-1.0 = high (red)
  const trafficData = [
    // Tagatay Street - HIGH TRAFFIC (Red) - weight 0.8-1.0
    { location: new google.maps.LatLng(14.641401, 120.990927), weight: 0.95 }, // Start
    { location: new google.maps.LatLng(14.6415, 120.9912), weight: 0.92 },
    { location: new google.maps.LatLng(14.6416, 120.9915), weight: 0.90 },
    { location: new google.maps.LatLng(14.6417, 120.9918), weight: 0.88 },
    { location: new google.maps.LatLng(14.6418, 120.9921), weight: 0.85 },
    { location: new google.maps.LatLng(14.6419, 120.9924), weight: 0.90 },
    { location: new google.maps.LatLng(14.6420, 120.9927), weight: 0.93 },
    { location: new google.maps.LatLng(14.6421, 120.9930), weight: 0.95 },
    
    // Dome Street - MODERATE TRAFFIC (Yellow) - weight 0.4-0.6
    { location: new google.maps.LatLng(14.6410, 120.9905), weight: 0.50 },
    { location: new google.maps.LatLng(14.6408, 120.9902), weight: 0.55 },
    { location: new google.maps.LatLng(14.6406, 120.9899), weight: 0.50 },
    { location: new google.maps.LatLng(14.6404, 120.9896), weight: 0.45 },
    { location: new google.maps.LatLng(14.6402, 120.9893), weight: 0.50 },
    { location: new google.maps.LatLng(14.6400, 120.9890), weight: 0.55 },
    { location: new google.maps.LatLng(14.6398, 120.9887), weight: 0.50 },
    
    // Mt.Natib Street - LOW TRAFFIC (Green #2ecc71) - weight 0.1-0.3
    { location: new google.maps.LatLng(14.6422, 120.9900), weight: 0.20 },
    { location: new google.maps.LatLng(14.6424, 120.9897), weight: 0.25 },
    { location: new google.maps.LatLng(14.6426, 120.9894), weight: 0.20 },
    { location: new google.maps.LatLng(14.6428, 120.9891), weight: 0.15 },
    { location: new google.maps.LatLng(14.6430, 120.9888), weight: 0.20 },
    { location: new google.maps.LatLng(14.6432, 120.9885), weight: 0.25 },
    { location: new google.maps.LatLng(14.6434, 120.9882), weight: 0.20 },
    
    // Klawit Street - HIGH TRAFFIC (Red) - weight 0.85-1.0
    { location: new google.maps.LatLng(14.6412, 120.9910), weight: 0.90 },
    { location: new google.maps.LatLng(14.6410, 120.9913), weight: 0.92 },
    { location: new google.maps.LatLng(14.6408, 120.9916), weight: 0.88 },
    { location: new google.maps.LatLng(14.6406, 120.9919), weight: 0.90 },
    { location: new google.maps.LatLng(14.6404, 120.9922), weight: 0.95 },
    { location: new google.maps.LatLng(14.6402, 120.9925), weight: 0.93 },
    { location: new google.maps.LatLng(14.6400, 120.9928), weight: 0.90 },
    
    // Kalandang Street - MODERATE TRAFFIC (Yellow) - weight 0.4-0.65
    { location: new google.maps.LatLng(14.6414, 120.9900), weight: 0.55 },
    { location: new google.maps.LatLng(14.6416, 120.9897), weight: 0.50 },
    { location: new google.maps.LatLng(14.6418, 120.9894), weight: 0.60 },
    { location: new google.maps.LatLng(14.6420, 120.9891), weight: 0.55 },
    { location: new google.maps.LatLng(14.6422, 120.9888), weight: 0.50 },
    { location: new google.maps.LatLng(14.6424, 120.9885), weight: 0.60 },
    { location: new google.maps.LatLng(14.6426, 120.9882), weight: 0.55 },
    
    // Mauban Street - LOW TRAFFIC (Green #2ecc71) - weight 0.1-0.25
    { location: new google.maps.LatLng(14.6405, 120.9908), weight: 0.15 },
    { location: new google.maps.LatLng(14.6403, 120.9905), weight: 0.20 },
    { location: new google.maps.LatLng(14.6401, 120.9902), weight: 0.15 },
    { location: new google.maps.LatLng(14.6399, 120.9899), weight: 0.10 },
    { location: new google.maps.LatLng(14.6397, 120.9896), weight: 0.15 },
    { location: new google.maps.LatLng(14.6395, 120.9893), weight: 0.20 },
    { location: new google.maps.LatLng(14.6393, 120.9890), weight: 0.15 },
  ];

  // Create heatmap with custom gradient
  const heatmap = new google.maps.visualization.HeatmapLayer({
    data: trafficData,
    map: map,
    gradient: [
      'rgba(46, 204, 113, 0)',      // Transparent green at 0 (low traffic)
      'rgba(46, 204, 113, 0.6)',     // Green #2ecc71 at low traffic
      'rgba(255, 255, 0, 0.6)',      // Yellow at moderate traffic
      'rgba(255, 255, 0, 0.8)',      // Brighter yellow
      'rgba(255, 0, 0, 0.8)',        // Red at high traffic
      'rgba(255, 0, 0, 1)'           // Bright red at very high traffic
    ],
    radius: 50,                       // Size of heat points
    opacity: 0.8,                     // Overall opacity
    maxIntensity: 1.0                 // Maximum intensity
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
