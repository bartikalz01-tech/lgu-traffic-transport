export function getTrafficColor(level) {
  switch(level) {
    case "high":
      return "#e74c3c";
    case "moderate":
      return "#f39c12";
    case "low":
      return "#3498db";
  }
}

export function getEventMarker(type, description) {
  let iconClass = "fa-circle";

  if(type === "church") iconClass = "fa-church";
  else if(type === "maintenance") iconClass = "fa-hammer";
  else if(type === "accident") iconClass = "fa-car-crash";
  else if(type === "closure") iconClass = "fa-ban";

  return L.divIcon({
    className: "custom-label-marker",
    html: `
      <div class="marker-container">
        <div class="marker-icon">
          <i class="fas ${iconClass}"></i>
        </div>
        <div class="marker-label">
          ${description}
        </div>
      </div>
    `,
    iconSize: [150, 150],
    iconAnchor: [20, 20]
  });
}