export let vehicleAccidentInvolved = [];

export function renderAccidentVehicles() {
  const vehicleTableBody = document.getElementById('vehiclesTableBody');
  const vehiclesEmptyState = document.getElementById('vehiclesEmptyState');

  if(!vehicleTableBody) return;

  vehicleTableBody.innerHTML = '';

  if(vehicleAccidentInvolved.length === 0) {
    vehiclesEmptyState.style.display = 'block';
    return;
  }

  vehiclesEmptyState.style.display = 'none';

  vehicleAccidentInvolved.forEach(vehicle => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${vehicle.full_name}</td>
      <td>${vehicle.plate_number}</td>
      <td>${vehicle.vehicle_type}</td>
      <td>${vehicle.vehicle_name}</td>
      <td>${vehicle.damage_level}</td>
      <td>
        <button class="btn btn-danger btn-sm delete-vehicle" data-id="${vehicle.accident_vehicle_id}">
          <i class="fas fa-trash"></i>
          Delete
        </button>
      </td>
    `;

    vehicleTableBody.appendChild(tr);
  });
}
