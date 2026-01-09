import { renderCctvFeed } from '../road_condition/road_condition.js';

export let roads = [];

export async function fetchRoads() {
  try {
    const response = await fetch('../api/get_roads.php');
    if(!response.ok) throw new Error('Failed to fetch roads');

    roads = await response.json();
    renderCctvFeed();
  } catch (error) {
    console.error('Error loading roads:', error);
  }
}