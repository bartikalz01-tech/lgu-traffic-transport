export async function loadOfficers(selectedOfficerId = null) {
  const response =  await fetch("../api/get_accident_officers.php");
  const officers = await response.json();

  const select = document.getElementById("dispatchedOfficerSelect");

  select.innerHTML = '<option value=""></option>';

  officers.forEach(officer => {
    const option = document.createElement("option");
    option.value = officer.officer_id;
    option.textContent = officer.officer_name;

    if(officer.officer_id === selectedOfficerId) {
      option.selected = true;
    }

    select.appendChild(option);
  });
}