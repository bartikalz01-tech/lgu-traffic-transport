export function getTrafficColor(level) {
  switch (level) {
    case "high":
      return "#e74c3c";
    case "moderate":
      return "#f39c12";
    case "low":
      return "#4df091";
    case "close":
      return "#2c3e50";
  }
}

export function getEventMarker(type, description) {
  let iconClass = "fa-circle";
  let bgColor = "#7f8c8d"

  /*if(type === "church") iconClass = "fa-church";
  else if(type === "maintenance") iconClass = "fa-hammer";
  else if(type === "accident") iconClass = "fa-car-crash";
  else if(type === "closure") iconClass = "fa-ban";*/

  if (type === "church") {
    iconClass = "fa-church";
    bgColor = "#8e44ad";
  } else if (type === "maintenance") {
    iconClass = "fa-hammer";
    bgColor = "#f39c12";
  } else if (type === "accident") {
    iconClass = "fa-car-crash";
    bgColor = "#e74c3c";
  } else if (type === "closure") {
    iconClass = "fa-ban";
    bgColor = "#2c3e50";
  } else if (type === "restaurant") {
    iconClass = "fa-utensils";
    bgColor = "#27ae60"
  } else if (type === "business") {
    iconClass = "fa-city";
  } else if (type === "hospital") {
    iconClass = "fa-h-square";
    bgColor = "#e07367";
  }

  return L.divIcon({
    className: "custom-label-marker",
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: ${bgColor};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
      ">
        <i class="fas ${iconClass}"></i>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
}