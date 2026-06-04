import { getPuvGroup, getPuvMembers, getPuvRetiredMembers } from "../data/fetch_public_group_trans.js";
import { renderAddGroup } from "./puv_management/puv_group/add_group.js";
import { renderAddMember } from "./puv_management/puv_members/add_member.js";
import { renderSidebarPuvGroups, renderPuvGroupDetails } from "./puv_management/puv_group/puv_groups.js";
import { renderPuvMembersTable } from "./puv_management/puv_members/puv_members.js";
import { getCodingDay } from "../utils/traffic_and_events.js";


export async function renderPuvManagement(container) {

  console.log("renderPuvManagement started");

  let currentSelectedGroup = null;

  container.innerHTML = `
    <div class="top-btns-container">
      <!--<button class="btn btn-outline-primary puv-toggle-btn" id="togglePuvSidebar">
        <i class="fas fa-chevron-left"></i>
      </button>-->
      <button class="btn btn-primary" id="addGroupBtn">
        <i class="fas fa-plus"></i>
        Add Group
      </button>
    </div>
    <div class="group-overview-container">
      <h1 class="group-overview-title">Group Overview</h1>
    </div>
    
    <div class="group-details" id="groupDetailsContainer"></div>
    
    <div class="members-container">
      <h1 id="membersTitle">PUV Group Members</h1>
      <div class="indicator-button dropdown-container">
        <button class="btn btn-outline-primary" id="actionDropdownBtn">
          Select Action
          <i class="fas fa-chevron-down"></i>
        </button>

        <div class="action-dropdown hidden" id="actionDropdownMenu">
          <button class="dropdown-item" id="addMemberOption">
            <i class="fas fa-user-plus"></i>
            Add Group Member
          </button>
          <button class="dropdown-item" id="searchDriverOption">
            <i class="fas fa-magnifying-glass"></i>
            Search Driver
          </button>
          <button class="dropdown-item" id="retiredMembersOption">
            <i class="fas fa-user-clock"></i>
            Retired Personnel
          </button>
        </div>
      </div>

      <div class="members-table-container">
        <table class="members-table">
          <thead>
            <tr>
              <th>Driver</th>
              <th>Position</th>
              <th>PUV #</th>
              <th>Status</th>
              <th style="width: 80px;">Action</th>
            </tr>
          </thead>

          <tbody id="memberBody"></tbody>
        </table>

        <div class="table-pagination">
          <div class="pagination-info" id="paginationInfo"></div>
          <div class="pagination-controls" id="paginationControls"></div>
        </div>
      </div>
    </div>
  `;

  // Toggle for left-part and right-part grid
  /*const toggleBtn = document.getElementById('togglePuvSidebar');
  const layout = document.getElementById('puvLayout');

  toggleBtn.addEventListener('click', () => {
    layout.classList.toggle('collapsed');
  });*/


  const addGroupContainer = document.getElementById("addGroupOverlay");
  const addGroupBtn = document.getElementById("addGroupBtn");

  addGroupBtn.addEventListener("click", () => {
    addGroupContainer.classList.remove("add-puv-group-hidden");

    renderAddGroup(
      addGroupContainer,
      async () => {
        await renderPuvManagement(container);
      }
    );
  });



  const memberBody = document.getElementById("memberBody");

  async function refreshMembers() {

    if(!currentSelectedGroup) return;

    const membersResult = await getPuvMembers(
      currentSelectedGroup.puv_group_id
    );

    if(membersResult.status === "success") {

      const activePuvs = countActivePuvs(membersResult.data);
      const activePuvElement = document.getElementById("activePuv");

      if(activePuvElement) {
        activePuvElement.textContent = activePuvs;
      }

      renderPuvMembersTable(
        memberBody,
        membersResult.data,
        refreshMembers
      );

    }
  }

  const puvGroups = await getPuvGroup();

  if(puvGroups.status === "success") {

    const groupsData = puvGroups.data

    const componentLinks = document.querySelector(".component-links");
    const groupDetailsContainer = document.getElementById("groupDetailsContainer");

    renderSidebarPuvGroups(
      componentLinks,
      groupsData,

      async (selectedGroup) => {
        console.log("Selected Group:", selectedGroup.puv_group_name);

        renderPuvGroupDetails(groupDetailsContainer, selectedGroup);

        currentSelectedGroup = selectedGroup;

        const membersResult = await getPuvMembers(selectedGroup.puv_group_id);

        if(membersResult.status === "success") {
          await refreshMembers();
        }
      }
    );

    if(groupsData.length > 0) {
      currentSelectedGroup = groupsData[0];

      renderPuvGroupDetails(groupDetailsContainer, groupsData[0]);

      await refreshMembers();
    }
  }




  // For dropdown on PUV Members Component
  const dropdownBtn = document.getElementById("actionDropdownBtn");

  const dropdownMenu = document.getElementById("actionDropdownMenu");

  const membersTitle = document.getElementById("membersTitle");
  const addMemberBtn = document.getElementById("addMemberOption");
  const searchMemberBtn = document.getElementById("searchDriverOption");
  const retiredMembersBtn = document.getElementById("retiredMembersOption");
  const addMemberContainer = document.getElementById("addGroupMemberOverlay");

  dropdownBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    
    dropdownMenu.classList.toggle("hidden");
  });

  document.addEventListener("click", (e) => {
    if(!dropdownMenu.contains(e.target) && !dropdownBtn.contains(e.target)) {
      dropdownMenu.classList.add("hidden");
    }
  });

  addMemberBtn.addEventListener("click", () => {
    dropdownMenu.classList.add("hidden");

    addMemberContainer.classList.remove("add-member-hidden");

    renderAddMember(
      addMemberContainer, 
      currentSelectedGroup.puv_group_id,
      refreshMembers
    );
  });

  searchMemberBtn.addEventListener("click", () => {
    dropdownMenu.classList.add("hidden");
  });

  retiredMembersBtn.addEventListener("click", async () => {
    dropdownMenu.classList.add("hidden");

    console.log("Retired button clicked");

    const result = await getPuvRetiredMembers(currentSelectedGroup.puv_group_id);

    if(result.status === "success") {

      membersTitle.textContent = "PUV Retired Members";

      renderPuvMembersTable(memberBody, result.data, refreshMembers);

    }

  });

  if(currentSelectedGroup) {
    await refreshMembers();
  }

  // End of dropdown logic for PUV members components
}


function countActivePuvs(members) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long"
  });

  const uniqueVehicles = new Set();

  members.forEach(member => {

    if(!member.plate_number) return;

    const codingDay = getCodingDay(member.plate_number);

    if(codingDay !== today) {
      uniqueVehicles.add(member.vehicle_id);
    }

  });

  return uniqueVehicles.size;
}