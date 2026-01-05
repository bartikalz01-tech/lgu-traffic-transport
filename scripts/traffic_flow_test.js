console.log("traffic_flow_test.js loaded");

let map;
let directionsService;

/* ================================
   GOOGLE MAP INITIALIZATION
================================ */
window.initMap = function () {
  const mapElement = document.getElementById("map");
  
  if (!mapElement) {
    console.error("Map element not found!");
    return;
  }

  if (typeof google === 'undefined' || !google.maps) {
    console.error("Google Maps API not loaded!");
    return;
  }

  try {
    map = new google.maps.Map(mapElement, {
      center: { lat: 14.6414, lng: 120.9909 },
      zoom: 18,
      mapTypeId: "roadmap",
    });

    directionsService = new google.maps.DirectionsService();

    drawTrafficRoutes();
  } catch (error) {
    console.error("Error initializing map:", error);
  }
};

/* ================================
   ROAD DEFINITIONS (START → END)
================================ */
const roads = [
  {
    name: "Dome Street",
    traffic: "moderate",
    origin: { lat: 14.64105, lng: 120.99065 },
    destination: { lat: 14.64125, lng: 120.99155 }
  },
  {
    name: "Tagaytay Street",
    traffic: "high",
    origin: { lat: 14.64130, lng: 120.99080 },
    destination: { lat: 14.64170, lng: 120.99190 }
  },
  {
    name: "Kalandang Street",
    traffic: "low",
    origin: { lat: 14.64085, lng: 120.99030 },
    destination: { lat: 14.64110, lng: 120.99110 }
  },
  {
    name: "Mauban Street",
    traffic: "moderate",
    origin: { lat: 14.64060, lng: 120.99010 },
    destination: { lat: 14.64095, lng: 120.99100 }
  },
  {
    name: "Mt. Natib Street",
    traffic: "high",
    origin: { lat: 14.64120, lng: 120.99110 },
    destination: { lat: 14.64160, lng: 120.99180 }
  }
];

/* ================================
   TRAFFIC COLOR LOGIC
================================ */
function getTrafficColor(level) {
  if (level === "high") return "#e74c3c";     // Red
  if (level === "moderate") return "#f1c40f"; // Yellow
  if (level === "low") return "#2ecc71";      // Green
  return "#95a5a6";                           // Gray
}

/* ================================
   DRAW REAL ROADS (WAZE LOGIC)
================================ */
function drawTrafficRoutes() {
  roads.forEach(road => {
    const renderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      preserveViewport: true,
      polylineOptions: {
        strokeColor: getTrafficColor(road.traffic),
        strokeOpacity: 0.9,
        strokeWeight: 8
      }
    });

    renderer.setMap(map);

    directionsService.route(
      {
        origin: road.origin,
        destination: road.destination,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === "OK") {
          renderer.setDirections(result);
        } else {
          console.error(`Failed to load route for ${road.name}`, status);
        }
      }
    );
  });
}


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