import { getAccidentCases, accidentData } from "../data/accident_cases.js";
import { accidentList } from "../global_variables.js";

export async function renderAccidentItem() {
  await getAccidentCases();

  accidentList.innerHTML = ``;

  const accident_type_labels = {
    collision: 'Vehicle Collision',
    single: 'Single Vehicle',
    pedestrian: 'Pedestrian Accident',
    property: 'Property Damage',
    other: 'Other'
  };

  const statusClassMap = {
    'Open Case': 'status-open',
    'Under Investigation': 'status-investigation',
    'Resolved': 'status-resolved'
  };

  accidentData.forEach(data => {
    const statusClass = statusClassMap[data.status_of_investigation] || 'status-open';

    accidentList.innerHTML += `
      <div class="accident-item">
        <div class="accident-header">
          <span class="accident-id">${data.public_accident_id}</span>
          <span class="accident-time">${formatDateTime(data.date_of_accident, data.time_of_accident)}</span>
        </div>
        <div class="accident-details">
          <h4>${accident_type_labels[data.accident_type]} at ${data.road_name}</h4>
          <div class="accident-meta">
            <span><i class="fas fa-road"></i> ${data.road_name}</span>
            <span><i class="fas fa-users"></i> ${data.total_people} People</span>
            <span><i class="fas fa-car"></i> ${data.total_vehicles} Vehicles</span>
          </div>
          <div class="status-and-action">
            <span class="status-badge ${statusClass}">${data.status_of_investigation}</span>
            <div class="all-about-ticket-buttons">
              <button class="btn btn-info js-modify-report" data-accident-id="${data.accident_id}">Modfiy Report</button>
            </div>
          </div>
        </div>
      </div>
    `;

    console.log(data);
    console.log('accident_id:', data.accident_id);
  });
}

function formatDateTime(date, time) {
  if (!date || !time) return '—';

  // Trim seconds if present (14:30:00 → 14:30)
  const safeTime = time.length > 5 ? time.slice(0, 5) : time;

  const d = new Date(`${date}T${safeTime}`);

  if (isNaN(d.getTime())) return '—';

  return (
    d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    }) +
    ', ' +
    d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    })
  );
}
