/*import { openSidebarBtn, closeSidebarBtn, sidebar, sidebarOverlay } from "./road_variables.js";
import { initSidebar } from "./road_condition.js";  

initSidebar(openSidebarBtn, closeSidebarBtn, sidebar, sidebarOverlay);*/

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
};




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
