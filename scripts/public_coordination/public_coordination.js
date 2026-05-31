import { getPuvGroup, getPuvMembers } from "../data/fetch_public_group_trans.js";
import { renderAddGroup } from "./add_group.js";
import { renderAddMember } from "./add_member.js";
import { renderSidebarPuvGroups, renderPuvGroupDetails } from "./puv_groups.js";
import { renderPuvMembersTable } from "./puv_members/puv_members.js";
import { getCodingDay } from "../utils/traffic_and_events.js";

let currentSelectedGroup = null;
let memberBody = null;

document.addEventListener("DOMContentLoaded", async () => {

  async function refreshMembers() {

    if(!currentSelectedGroup) return;

    const membersResult = await getPuvMembers(
      currentSelectedGroup.puv_group_id
    );

    if(membersResult.status === "success") {

      const activePuvs = countActivePuvs(membersResult.data);

      const groupsDetailsContainer = document.getElementById("groupDetailsContainer");

      renderPuvGroupDetails(groupsDetailsContainer, currentSelectedGroup, activePuvs);

      renderPuvMembersTable(
        memberBody,
        membersResult.data,
        refreshMembers
      );

    }
  }

  const toggleBtn = document.getElementById('togglePuvSidebar');
  const layout = document.getElementById('puvLayout');

  toggleBtn.addEventListener('click', () => {
    layout.classList.toggle('collapsed');
  });

  const addGroupContainer = document.getElementById("addGroupOverlay");
  const addGroupBtn = document.getElementById("addGroupBtn");

  addGroupBtn.addEventListener("click", () => {
    addGroupContainer.classList.remove("add-puv-group-hidden");

    renderAddGroup(addGroupContainer);
  });

  const puvGroups = await getPuvGroup();

  if(puvGroups.status === "success") {

    const groupsData = puvGroups.data

    const componentLinks = document.querySelector(".component-links");
    const groupDetailsContainer = document.getElementById("groupDetailsContainer");

    renderSidebarPuvGroups(
      componentLinks, 
      groupsData,

      async (selectedGroup) => {
        renderPuvGroupDetails(groupDetailsContainer, selectedGroup);

        currentSelectedGroup = selectedGroup;

        const membersResult = await getPuvMembers(selectedGroup.puv_group_id);

        if(membersResult.status === "success") {
          //renderPuvMembersTable(memberBody, membersResult.data);
          await refreshMembers();
        }
      }
    );

    if(groupsData.length > 0) {
      renderPuvGroupDetails(groupDetailsContainer, groupsData[0]);

      currentSelectedGroup = groupsData[0];
    }
  }

  // For dropdown on PUV Members Component
  const dropdownBtn = document.getElementById("actionDropdownBtn");

  const dropdownMenu = document.getElementById("actionDropdownMenu");

  const addMemberBtn = document.getElementById("addMemberOption");
  const searchMemberBtn = document.getElementById("searchDriverOption");

  const addMemberContainer = document.getElementById("addGroupMemberOverlay");
  memberBody = document.getElementById("memberBody");

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

      /*async () => {
        const membersResult = await getPuvMembers(currentSelectedGroup.puv_group_id);

        if(membersResult.status === "success") {
          renderPuvMembersTable(
            memberBody,
            membersResult.data
          );
        }
      }*/

      refreshMembers
    );
  });

  searchMemberBtn.addEventListener("click", () => {
    dropdownMenu.classList.add("hidden");
  });

  if(currentSelectedGroup) {
    /*const membersResult = await getPuvMembers(
      currentSelectedGroup.puv_group_id
    );

    if(membersResult.status === "success") {
      renderPuvMembersTable(memberBody, membersResult.data);
    }*/
    await refreshMembers();
  }

  // End of dropdown logic for PUV members components

});

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