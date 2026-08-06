export let roads = [];

export async function fetchRoads() {
  try {
    const response = await fetch('../api/get_roads.php');
    if(!response.ok) throw new Error('Failed to fetch roads');

    roads = await response.json();
  } catch (error) {
    console.error('Error loading roads:', error);
  }
}