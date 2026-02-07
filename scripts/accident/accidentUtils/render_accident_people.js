export let peopleInvolved = [];

export function renderPeople() {
  const peopleTableBody = document.getElementById('peopleTableBody');
  const peopleEmptyState = document.getElementById('peopleEmptyState');
  const peopleCount = document.getElementById('peopleCount');
  const peopleCountBadge = document.getElementById('peopleCountBadge');

  if(!peopleTableBody) return;

  peopleTableBody.innerHTML = '';

  if(peopleInvolved.length === 0) {
    peopleEmptyState.style.display = 'block';
    peopleCount.textContent = 0;
    peopleCountBadge.textContent = 0;
    return;
  }

  peopleEmptyState.style.display = 'none';

  peopleInvolved.forEach(person => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${person.full_name}</td>
      <td>${capitalize(person.role)}</td>
      <td>${capitalize(person.status_level)}</td>
      <td>${person.contact_num || '-'}</td>
      <td>${person.address || '-'}</td>
      <td>
        <button class="btn btn-danger btn-sm delete-person" data-id="${person.accident_ppl_id}">
          <i class="fas fa-trash"></i>
          Delete
        </button>
      </td>
    `;

    peopleTableBody.appendChild(tr);
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}