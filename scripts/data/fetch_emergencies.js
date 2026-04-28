export async function getEmergenciesLocation() {
  try {
    const response = await fetch("../api/emergencies/get_emergencies.php");
    const data = await response.json();

    return data;
  } catch(error) {
    console.error('Emergencies Location did not fetched:', error);
    return [];
  }
}