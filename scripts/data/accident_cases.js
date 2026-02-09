export let accidentData = [];
//export let accidentHeaderDetails = [];

export async function getAccidentCases() {
  try {
    const response = await fetch('../api/get_accident_details.php');
    if (!response.ok) {
      throw new Error('Failed to fetch accident details');
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'API returned failure');
    }

    accidentData = result.data;

    return accidentData;

  } catch (error) {
    console.error('Error Loading accident details:', error);
    return [];
  }
}

/*export async function getHeaderAccidentDetails(accidentId) {
  try {
    const response = await fetch(`../api/get_header_accident_details.php?accident_id=${accidentId}`);
    if(!response.ok) {
      throw new Error('Failed to fetch accident details');
    }

    const result = await response.json();

    if(!result.success) {
      throw new Error(result.message || 'API returned failure')
    }

    accidentHeaderDetails = result.data;

    return accidentHeaderDetails;
  } catch(error) {
    console.error('Error Loading accident details', error);
    return [];
  }
}*/

export async function getHeaderAccidentDetails(accidentId) {
  try {
    const response = await fetch(
      `../api/get_header_accident_details.php?accident_id=${accidentId}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch accident details');
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'API returned failure');
    }

    // RETURN ONE OBJECT
    return result.data;

  } catch (error) {
    console.error('Error Loading accident details', error);
    return null;
  }
}

export async function getAccidentPeopleDetails(accidentId) {
  try {
    const response = await fetch(
      `../api/get_accident_people_details.php?accident_id=${accidentId}`
    );

    if(!response.ok) {
      throw new Error('Failed to fetch accident people');
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'API returned failure');
    }

    return result.data;

  } catch(error) {
    console.error('Error loading people involved:', error);
    return[];
  }
}

export async function getAccidentVehicleDetails(accidentId) {
  try {
    const response = await fetch(
      `../api/get_accident_vehicles_details.php?accident_id=${accidentId}`
    );

    if(!response) {
      throw new Error('Failed to fetch accident people');
    }

    const result = await response.json();

    if(!result.success) {
      throw new Error(result.message || 'API returned failure');
    }

    return result.data;

  } catch(error) {
    console.error('Error loading people involved:', error);
    return[];
  } 
}