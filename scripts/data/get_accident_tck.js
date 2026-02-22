export async function accidentTckDetails(accidentId) {
  try {
    const response = await fetch('../api/get_accident_ticket_details.php');

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