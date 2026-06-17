import { renderAddMember } from "./add_member.js";
import { renderPuvMembersTable } from "./puv_members.js";
import { getPuvMembers, getPuvRetiredMembers } from "../../../data/fetch_public_group_trans.js";


export function showActionDropdown(dropdownContainer) {
  dropdownContainer.innerHTML = `
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
  `;
}


export function showSearchBar({
  dropdownContainer,
  getCurrentSelectedGroup,
  memberBody,
  refreshMembers
}) {
  dropdownContainer.innerHTML = `
    <div class="driver-search-container">
      <button class="search-back-btn" id="searchBackBtn">
        <i class="fas fa-arrow-left"></i>
      </button>

      <input
        type="text"
        id="memberSearchInput"
        class="member-search-input"
        placeholder="Search Member..."
      >
    </div>
  `;

  const searchInput = document.getElementById("memberSearchInput");

  searchInput.focus();

  /*const searchBackBtn =
    document.getElementById("searchBackBtn");

  searchBackBtn.addEventListener("click", () => {
    onBack();
  });*/

  searchInput.addEventListener("input", async () => {
    const keyword = searchInput.value.toLowerCase();

    const currentSelectedGroup = getCurrentSelectedGroup()

    if(!currentSelectedGroup) return;

    const result = await getPuvMembers(currentSelectedGroup.puv_group_id);

    if(result.status === "success") {
      const filterMembers = result.data.filter(member => member.full_name.toLowerCase().includes(keyword));

      renderPuvMembersTable(memberBody, filterMembers, refreshMembers);
    }
  });
}


export function initializeDropdownEvents({
  dropdownContainer,
  getCurrentSelectedGroup,
  refreshMembers,
  memberBody,
  membersTitle,
  addMemberContainer,
  membersData
}) {

  const dropdownBtn = document.getElementById("actionDropdownBtn");
  const dropdownMenu = document.getElementById("actionDropdownMenu");

  const addMemberBtn = document.getElementById("addMemberOption");
  const searchMemberBtn = document.getElementById("searchDriverOption");
  const retiredMembersBtn = document.getElementById("retiredMembersOption");

  dropdownBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle("hidden");
  });

  document.addEventListener("click", (e) => {
    if (
      !dropdownMenu.contains(e.target) &&
      !dropdownBtn.contains(e.target)
    ) {
      dropdownMenu.classList.add("hidden");
    }
  });

  addMemberBtn.addEventListener("click", () => {

    const currentSelectedGroup = getCurrentSelectedGroup();

    if(!currentSelectedGroup) return;

    renderAddMember(
      addMemberContainer,
      currentSelectedGroup.puv_group_id,
      refreshMembers
    );

    addMemberContainer.classList.remove("add-member-hidden");
  });

  searchMemberBtn.addEventListener("click", () => {

    showSearchBar({dropdownContainer, getCurrentSelectedGroup, memberBody, refreshMembers});

    const searchInput =
      document.getElementById("memberSearchInput");

    searchInput.focus();

    const searchBackBtn =
      document.getElementById("searchBackBtn");

    searchBackBtn.addEventListener("click", () => {

      showActionDropdown(dropdownContainer);

      initializeDropdownEvents({
        dropdownContainer,
        getCurrentSelectedGroup,
        refreshMembers,
        memberBody,
        membersTitle,
        addMemberContainer,
        membersData
      });

    });

  });

  retiredMembersBtn.addEventListener("click", async () => {

    const currentSelectedGroup = getCurrentSelectedGroup();

    if(!currentSelectedGroup) return;

    const result =
      await getPuvRetiredMembers(
        currentSelectedGroup.puv_group_id
      );

    if(result.status === "success") {

      membersTitle.textContent =
        "PUV Retired Members";

      renderPuvMembersTable(
        memberBody,
        result.data,
        refreshMembers
      );
    }

  });

}