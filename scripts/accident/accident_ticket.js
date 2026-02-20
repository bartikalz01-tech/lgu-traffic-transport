import { getHeaderAccidentDetails } from "../data/accident_cases.js";
import { peopleInvolved, vehicleAccidentInvolved } from "./accidentUtils/render_accident_people.js";

export async function renderAccidentTicket(accidentId) {
  const accidentDetails = await getHeaderAccidentDetails(accidentId);
  
}