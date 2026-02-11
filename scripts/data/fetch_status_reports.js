export async function loadReportStatus(selectedStatusId = null) { 
  const response = await fetch('../api/get_accident_status.php');
  const status = await response.json();
  const selectedId = Number(selectedStatusId);

  const selectStatus = document.getElementById('statusSelect');

  selectStatus.innerHTML = '';

  status.forEach(s => {
    const options = document.createElement("option");
    options.value = s.status_id;
    options.textContent = s.status_definition;
    
    if(Number(s.status_id) === selectedId) {
      options.selected = true;
    }

    selectStatus.appendChild(options);
  });

  selectStatus.value = selectedStatusId;

  const badge = document.getElementById('statusBadge');

  if(badge && selectStatus.selectedIndex >= 0) {
    const selectedOption = selectStatus.options[selectStatus.selectedIndex];
    badge.textContent = selectedOption.textContent;
  }

  console.log("SELECTED STATUS ID RECEIVED:", selectedStatusId);
}