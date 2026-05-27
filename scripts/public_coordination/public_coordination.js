import { getPuvGroup } from "../data/fetch_public_group_trans.js";
import { renderAddGroup } from "./add_group.js";
import { renderAddMember } from "./add_member.js";
import { renderSidebarPuvGroups, renderPuvGroupDetails } from "./puv_groups.js";

document.addEventListener("DOMContentLoaded", async () => {

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

      (selectedGroup) => {
        renderPuvGroupDetails(groupDetailsContainer, selectedGroup);

        console.log("Selected Group:", selectedGroup)
      }
    );

    if(groupsData.length > 0) {
      renderPuvGroupDetails(groupDetailsContainer, groupsData[0]);
    }
  }

  // For dropdown on PUV Members Component
  const dropdownBtn = document.getElementById("actionDropdownBtn");

  const dropdownMenu = document.getElementById("actionDropdownMenu");

  const addMemberBtn = document.getElementById("addMemberOption");
  const searchMemberBtn = document.getElementById("searchDriverOption");

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

    renderAddMember(addMemberContainer);
  });

  searchMemberBtn.addEventListener("click", () => {
    dropdownMenu.classList.add("hidden");
  });

  // End of dropdown logic for PUV members components

});