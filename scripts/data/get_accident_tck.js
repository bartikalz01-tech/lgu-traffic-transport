export async function accidentTckDetails(accidentId) {
  try {
    const response = await fetch(`../api/get_full_ticket_data.php?accident_id=${accidentId}`);

    if(!response.ok) {
      throw new Error('Accident ticket did not fetch in JS');
    }

    const result = await response.json();

    if(!result.success) {
      throw new Error('Accident ticket did not success');
    }

    return result.data;

  } catch(error) {
    console.error('Error loading accident ticket details');
    return null;
  }
}

export async function getTicketAccidentHeaderTck(accidentId) {
  try {
    const response = await fetch(`../api/get_accident_ticket_details.php?accident_id=${accidentId}`);

    if(!response.ok) {
      throw new Error('Accident ticket did not fetch in JS');
    }

    const result = await response.json();

    return result.data;

  } catch(error) {
    console.error('Error loading accident ticket details');
    return null;
  }
}