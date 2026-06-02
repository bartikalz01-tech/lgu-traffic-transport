import { initMap } from "../../../utils/traffic_and_events.js";

let groupMap = null;

export function renderSidebarPuvGroups(container, groupsData, onGroupClick) {

  let html = '';
  
  groupsData.forEach(group => {
    html += `
      <div class="group" data-group-id="${group.puv_group_id}">
        <i class="fas fa-circle"></i>
        <p>${group.puv_group_name}</p>
      </div>
    `;
  });

  container.innerHTML = html;

  const groupElements = container.querySelectorAll(".group");

  groupElements.forEach(groupElement => {

    groupElement.addEventListener("click", () => {
      groupElements.forEach(el => {
        el.classList.remove("active");
      });

      groupElement.classList.add("active");

      const groupId = Number(groupElement.dataset.groupId);

      const selectedGroup = groupsData.find(group => {
        return group.puv_group_id == groupId
      });

      onGroupClick(selectedGroup);
    });
  });
}

export function renderPuvGroupDetails(container, group, activePuvs = 0) {

  /*if(groupMap) {
    groupMap.remove();
    groupMap = null;
  }*/

  container.innerHTML = `
    <div class="first-part">
      <h1>Group:</h1>
      <p id="puvGroupName">${group.puv_group_name}</p>
    </div>
    <div class="statistics-container">
      <div class="stat-card">
        <div class="stat-icon users">
          <i class="fas fa-users"></i>
        </div>
        <h2 id="puvTotalMembers">${group.total_members}</h2>
        <p>Total Members</p>
      </div>

      <div class="stat-card">
        <div class="stat-icon vehicle-types">
          <i class="fas fa-truck-moving"></i>
        </div>
        <h2 id="vehicleTypeDescription">${group.puv_vehicle_type}</h2>
        <p>Vehicle Type</p>
      </div>

      <div class="stat-card">
        <div class="stat-icon active-puv">
          <i class="fas fa-circle-check"></i>
        </div>
        <h2 id="activePuv">${activePuvs}</h2>
        <p>Active PUVs</p>
      </div>
    </div>

    <div class="map-container full-width-map">
      <h1 style="text-align: center; margin-bottom: 20px;">Group Map</h1>
      <div id="map"></div>
    </div>
  `;

  groupMap = initMap("map");

  const lat = parseFloat(group.latitude);
  const lng = parseFloat(group.longitude);

  groupMap.setView([lat, lng], 16);

  L.marker([lat, lng])
    .addTo(groupMap)
    .bindPopup(`
      <b>${group.puv_group_name}</b><br>
      ${group.puv_group_address}
    `)
    .openPopup();

  console.log("Rendering map");
}