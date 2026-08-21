let puvGroupMap = null;
let selectionMarker = null;
let selectionCallback = null;

export function renderPuvGroupMap(container) {
  if(!container) {
    console.error("PUV map container not found");
    return;
  }

  if(puvGroupMap) {
    puvGroupMap.remove();
    puvGroupMap = null;
  }

  puvGroupMap = L.map(container).setView(
    [14.733263, 121.033641],
    16
  );

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution: "&copy; OpenStreetMap contributors"
    }
  ).addTo(puvGroupMap);

  puvGroupMap.on("click", async (event) => {
    if(!selectionCallback) {
      return;
    }

    const latitude = event.latlng.lat;
    const longitude = event.latlng.lng;

    await handleMapSelection(
      latitude,
      longitude
    );
    
  });

}

export function enablePuvLocationSelection(callback) {
  selectionCallback = callback;

  if(!puvGroupMap){
    console.error(
      "PUV group map has not been initialized."
    );

    return;

  }

  puvGroupMap.getContainer().classList.add(
    "puv-map-selecting"
  );

}

export function disablePuvLocationSelection(){

  selectionCallback = null;

  if(puvGroupMap) {

    puvGroupMap.getContainer().classList.remove(
      "puv-map-selecting"
    );

  }

}

async function handleMapSelection(
  latitude,
  longitude
) {
  
  if(!selectionCallback) {
    return;
  }

  try{

    showSelectionMarker(
      latitude,
      longitude
    );

    const locationData =
      await reverseGeocode(
        latitude,
        longitude
      );

      selectionCallback({
        latitude,
        longitude,
        roadName: locationData.roadName,
        locationName: locationData.locationName,
        displayName: locationData.displayName
      });

  } catch(error) {
    console.error(
      "Reverse geocoding failed:",
      error
    );

    selectionCallback({
      latitude,
      longitude,
      roadName: "",
      locationName: "",
      displayName: ""
    });

  }

}

async function reverseGeocode(
  latitude, longitude
) {

  const url =
  `https://nominatim.openstreetmap.org/reverse` +
  `?format=jsonv2` +
  `&lat=${encodeURIComponent(latitude)}` +
  `&lon=${encodeURIComponent(longitude)}` +
  `&zoom=18` +
  `&addressdetails=1`;

  const response =
    await fetch(url, {
      headers: {
        "Accept": "application/json"
      }
    });

    if(!response.ok) {

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
    buildLocationName(address);

  return {
    roadName,
    locationName,
    displayName: data.display_name || ""
  };

}

function buildLocationName(address) {

  const parts = [];

  if(address.house_number) {
    parts.push(address.house_number);
  }

  if(address.building) {
    parts.push(address.building);
  }

  if(address.amenity) {
    parts.push(address.amenity);
  }

  if(address.shop) {
    parts.push(address.shop);
  }

  if(address.neighbourhood) {
    parts.push(address.neighbourhood);
  }

  if(address.quarter) {
    parts.push(address.quarter);
  }

  if(address.suburb) {
    parts.push(address.suburb);
  }

  if(address.village) {
    parts.push(address.village);
  }

  if(address.city_district) {
    parts.push(address.city_district);
  }

  if(address.town) {
    parts.push(address.town);
  }

  if(address.city) {
    parts.push(address.city);
  }

  if(address.municipality) {
    parts.push(address.municipality);
  }

  if(address.postcode) {
    parts.push(address.postcode);
  }

  if(address.country) {
    parts.push(address.country);
  }

  if(parts.length > 0) {
    return parts.join(", ");
  }
  return "Selected map location";
}

function showSelectionMarker(
  latitude,
  longitude
) {

  if (!puvGroupMap) {
    return;
  }

  if (selectionMarker) {

    selectionMarker.remove();

  }

  selectionMarker =
    L.marker([
      latitude,
      longitude
    ]).addTo(puvGroupMap);

}