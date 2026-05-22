import { getPuvGroup } from "../data/fetch_public_group_trans.js";
import { renderAddGroup } from "./add_group.js";
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

});