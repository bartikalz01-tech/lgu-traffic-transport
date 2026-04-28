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

export async function getRespondersByType(type) {
  try {
    const response = await fetch(`../api/emergencies/get_responders.php?type=${type}`);
    const data = response.json();

    return data;
  } catch(error) {
    console.error('Responders fetch error:', error);
    return [];
  }
}