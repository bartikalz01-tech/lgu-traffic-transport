export let accidentData = [];

export async function getAccidentCases() {
  try {
    const response = await fetch('../api/get_accident_details.php');
    if(!response.ok) {
      throw new Error('Failed to fetch accident details');
    }

    const result = await response.json();

    if(!result.success) {
      throw new Error(result.message || 'API returned failure');
    }

    accidentData = result.data;

    return accidentData;

  } catch(error) {
    console.error('Error Loading accident details:', error);
    return [];
  }
}