import { assignVehicleMember } from "./assign_vehicle.js";

const ROWS_PER_PAGE = 5;

let currentPage = 1;
let membersData = []; 

export function renderPuvMembersTable(table, members, refreshMembers, page = 1) {

  membersData = members;
  currentPage = page;

  const start = (page - 1) * ROWS_PER_PAGE;
  const end = start + ROWS_PER_PAGE;

  const paginatedMembers = members.slice(start, end);

  if(paginatedMembers.length === 0) {
    table.innerHTML = `
      <tr>
        <td style="text-align-center;">
          No members found
        </td>
      </tr>
    `;

    return;
  }

  const memberInfoOverlay = document.getElementById("memberInfoOverlay")

  table.innerHTML = paginatedMembers.map(member => {
    return `
      <tr>
        <td>${member.full_name}</td>
        <td>${member.personnel_type}</td>
        <td><code class="puv-code">${member.vehicle_number ?? "N/A"}</code></td>
        <td><span class="status ${member.verification_status}">${member.verification_status}</span></td>
        <td>
          <button class="btn btn-sm btn-outline-info js-view-member" data-member-id="${member.personnel_id}">
            <i class="fas fa-eye"></i>  
          </button>
        </td>
      </tr>
    `;
  }).join('');

  const viewButtons = table.querySelectorAll(".js-view-member");

  viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const personnelId = Number(button.dataset.memberId);

      const selectMember = membersData.find(member => {
        return member.personnel_id === personnelId
      });

      assignVehicleMember(memberInfoOverlay, selectMember, refreshMembers);
    });
  });
}