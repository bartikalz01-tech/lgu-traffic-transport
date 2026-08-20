export function renderPuvGroupMap(container) {
  if(!container) {
    console.error("PUV map container mnot found");
    return;
  }

  const map = L.map(container).setView([14.733263, 121.033641], 16);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);
}