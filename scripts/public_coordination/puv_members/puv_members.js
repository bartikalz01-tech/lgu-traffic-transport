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

  const paginationInfo = document.getElementById("paginationInfo");
  const paginationControls = document.getElementById("paginationControls");

  const totalPages = Math.ceil(members.length / ROWS_PER_PAGE);

  paginationInfo.textContent = `Showing ${start + 1} to ${Math.min(end, members.length)} of ${members.length} members`;

  paginationControls.innerHTML = "";

  const prevBtn = document.createElement("button");

  prevBtn.className = "page-btn";
  prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';

  prevBtn.disabled = page === 1;

  prevBtn.addEventListener('click', () => {
    renderPuvMembersTable(table, members, refreshMembers, page - 1);
  });

  paginationControls.appendChild(prevBtn);

  for(let i = 1; i <= totalPages; i++) {

    const pageBtn = document.createElement("button");

    pageBtn.className =
      i === page
        ? "page-btn active"
        : "page-btn";

    pageBtn.textContent = i;

    pageBtn.addEventListener("click", () => {
      renderPuvMembersTable(
        table,
        members,
        refreshMembers,
        i
      );
    });

    paginationControls.appendChild(pageBtn);
  }

  const nextBtn = document.createElement("button");

  nextBtn.className = "page-btn";
  nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';

  nextBtn.disabled = page === totalPages;

  nextBtn.addEventListener("click", () => {
    renderPuvMembersTable(
      table,
      members,
      refreshMembers,
      page + 1
    );
  });

  paginationControls.appendChild(nextBtn);


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