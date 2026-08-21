let puvGroupMap = null;

let selectionCallback = null;
let selectionMarkerId = null;
let selectionMarkerColor = "blue";

const locationMarkers = new Map();
const markerPopupData = new Map();

let markerClickCallback = null;


export function setPuvLocationMarkerClickCallback(callback) {

  markerClickCallback =
    callback;

}

// ============================================================
// RENDER MAP
// ============================================================

export function renderPuvGroupMap(container) {

  if (!container) {

    console.error(
      "PUV map container not found"
    );

    return;
  }


  /*
   * Remove previous map instance
   */

  if (puvGroupMap) {

    puvGroupMap.remove();

    puvGroupMap = null;
  }


  /*
   * Clear marker references
   */

  locationMarkers.clear();


  /*
   * Create map
   */

  puvGroupMap = L.map(container).setView(
    [14.733263, 121.033641],
    16
  );


  /*
   * OpenStreetMap tiles
   */

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        "&copy; OpenStreetMap contributors"
    }
  ).addTo(puvGroupMap);


  /*
   * Map click
   */

  puvGroupMap.on(
    "click",
    async (event) => {

      if (!selectionCallback) {
        return;
      }


      const latitude =
        event.latlng.lat;


      const longitude =
        event.latlng.lng;


      await handleMapSelection(
        latitude,
        longitude
      );

    }
  );

}


// ============================================================
// ENABLE LOCATION SELECTION
// ============================================================

export function enablePuvLocationSelection(
  callback,
  options = {}
) {

  if (!puvGroupMap) {

    console.error(
      "PUV group map has not been initialized."
    );

    return;
  }


  selectionCallback =
    callback;


  selectionMarkerId =
    options.markerId || null;


  selectionMarkerColor =
    options.markerColor || "blue";


  /*
   * Store popup information.
   */

  if (options.markerPopup) {

    markerPopupData.set(
      selectionMarkerId,
      options.markerPopup
    );

  }


  puvGroupMap
    .getContainer()
    .classList.add(
      "puv-map-selecting"
    );

}


// ============================================================
// DISABLE LOCATION SELECTION
// ============================================================

export function disablePuvLocationSelection() {

  selectionCallback = null;

  selectionMarkerId = null;

  selectionMarkerColor = "blue";


  if (puvGroupMap) {

    puvGroupMap
      .getContainer()
      .classList.remove(
        "puv-map-selecting"
      );

  }

}


// ============================================================
// HANDLE MAP SELECTION
// ============================================================

async function handleMapSelection(
  latitude,
  longitude
) {

  if (!selectionCallback) {
    return;
  }


  /*
   * Capture current selection information.
   *
   * This is important because the callback
   * may be disabled after selection.
   */

  const callback =
    selectionCallback;


  const markerId =
    selectionMarkerId;


  const markerColor =
    selectionMarkerColor;


  /*
   * Immediately show marker.
   *
   * This means the marker appears even while
   * reverse geocoding is happening.
   */

  if (markerId) {

    showLocationMarker(
      markerId,
      latitude,
      longitude,
      markerColor
    );

  }


  try {

    const locationData =
      await reverseGeocode(
        latitude,
        longitude
      );


    callback({

      latitude,

      longitude,

      roadName:
        locationData.roadName,

      locationName:
        locationData.locationName,

      displayName:
        locationData.displayName

    });


  } catch (error) {

    console.error(
      "Reverse geocoding failed:",
      error
    );


    /*
     * Still return the coordinates
     * even if Nominatim fails.
     */

    callback({

      latitude,

      longitude,

      roadName: "",

      locationName: "",

      displayName: ""

    });

  }

}


// ============================================================
// SHOW / UPDATE LOCATION MARKER
// ============================================================

function showLocationMarker(
  markerId,
  latitude,
  longitude,
  color
) {

  if (!puvGroupMap) {
    return;
  }

  if (locationMarkers.has(markerId)) {

    const existingMarker =
      locationMarkers.get(markerId);


    existingMarker.remove();


    locationMarkers.delete(
      markerId
    );

  }

  let marker;

  if(markerId === "vehicle-staging") {
    marker = L.marker(
      [latitude, longitude],
      {
        icon: L.divIcon({
          className: "puv-vehicle-marker",
          html: `
            <div class="puv-vehicle-marker-inner">
              <i class="fas fa-bus"></i>
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        })
      }
    );
  } else {
    marker = L.circleMarker(
      [latitude, longitude],
      {
        radius: 9,
        color: "#ffffff",
        weight: 2,
        fillColor: color,
        fillOpacity: 1
      }
    );
  }

  marker.addTo(
    puvGroupMap
  );


  /*
   * Store marker
   */

  locationMarkers.set(
    markerId,
    marker
  );

  const popupData = markerPopupData.get(markerId);

  if(popupData) {
    marker.bindPopup(`
      <div class="puv-loading-marker-popup">

        <strong>
          ${popupData.title}
        </strong>

        <div>
          <small>
            ${popupData.roadName || "Unnamed Road"}
          </small>
        </div>

        <div>
          <small>
            ${
              popupData.locationName ||
              "Selected map location"
            }
          </small>
        </div>

      </div>
    `);
  }

  marker.on("click", () => {
    if (typeof markerClickCallback === "function") {
      markerClickCallback(markerId);
    }
  });

}


// ============================================================
// REMOVE ONE LOCATION MARKER
// ============================================================

export function removePuvLocationMarker(
  markerId
) {

  if (
    locationMarkers.has(
      markerId
    )
  ) {

    const marker =
      locationMarkers.get(
        markerId
      );

    marker.remove();

    locationMarkers.delete(
      markerId
    );

  }


  /*
   * Remove popup information too.
   */

  markerPopupData.delete(
    markerId
  );

}


// ============================================================
// CLEAR ALL LOCATION MARKERS
// ============================================================

export function clearPuvLocationMarkers() {

  locationMarkers.forEach(
    marker => {

      marker.remove();

    }
  );


  locationMarkers.clear();

}


// ============================================================
// REVERSE GEOCODING
// ============================================================

async function reverseGeocode(
  latitude,
  longitude
) {

  const url =
    `https://nominatim.openstreetmap.org/reverse` +
    `?format=jsonv2` +
    `&lat=${encodeURIComponent(latitude)}` +
    `&lon=${encodeURIComponent(longitude)}` +
    `&zoom=18` +
    `&addressdetails=1`;


  const response =
    await fetch(
      url,
      {
        headers: {
          "Accept":
            "application/json"
        }
      }
    );


  if (!response.ok) {

    throw new Error(
      `Reverse geocoding failed: ${response.status}`
    );

  }


  const data =
    await response.json();


  const address =
    data.address || {};


  const roadName =
    address.road ||
    address.pedestrian ||
    address.footway ||
    address.path ||
    "";


  const locationName =
    buildLocationName(
      address
    );


  return {

    roadName,

    locationName,

    displayName:
      data.display_name || ""

  };

}


// ============================================================
// BUILD LOCATION NAME
// ============================================================

function buildLocationName(
  address
) {

  const parts = [];


  if (address.house_number)
    parts.push(
      address.house_number
    );


  if (address.building)
    parts.push(
      address.building
    );


  if (address.amenity)
    parts.push(
      address.amenity
    );


  if (address.shop)
    parts.push(
      address.shop
    );


  if (address.neighbourhood)
    parts.push(
      address.neighbourhood
    );


  if (address.quarter)
    parts.push(
      address.quarter
    );


  if (address.suburb)
    parts.push(
      address.suburb
    );


  if (address.village)
    parts.push(
      address.village
    );


  if (address.city_district)
    parts.push(
      address.city_district
    );


  if (address.town)
    parts.push(
      address.town
    );


  if (address.city)
    parts.push(
      address.city
    );


  if (address.municipality)
    parts.push(
      address.municipality
    );


  if (address.postcode)
    parts.push(
      address.postcode
    );


  if (address.country)
    parts.push(
      address.country
    );


  if (parts.length > 0) {

    return parts.join(
      ", "
    );

  }


  return "Selected map location";

}

// ============================================================
// UPDATE MARKER POPUP
// ============================================================

export function updatePuvLocationMarkerPopup(
  markerId,
  popupData
) {

  if (!markerId) {
    return;
  }


  markerPopupData.set(
    markerId,
    popupData
  );


  const marker =
    locationMarkers.get(
      markerId
    );


  if (!marker) {
    return;
  }


  marker.bindPopup(`
    <div class="puv-loading-marker-popup">

      <strong>
        ${popupData.title}
      </strong>

      <div>
        <small>
          ${
            popupData.roadName ||
            "Unnamed Road"
          }
        </small>
      </div>

      <div>
        <small>
          ${
            popupData.locationName ||
            popupData.displayName ||
            "Selected map location"
          }
        </small>
      </div>

    </div>
  `);

}