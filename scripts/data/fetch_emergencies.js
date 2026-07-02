export async function insertEmergencyRoutes(emergencyId, responders) {
  try {
    const response = await fetch("../api/emergencies/save_emergency_routes.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        emergency_id: emergencyId,
        responders: responders
      })
    });

    const data = await response.json();

    return data
  } catch(error) {
    console.error("Save Emergency Routes error:", error);
    
    return {
      status: "error",
      message: "Unable to save emergency routes"
    }
  }
}

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

export async function getPendingEmergenciesLocation() {
  try {
    const response = await fetch("../api/emergencies/get_pending_emergencies.php");
    const data = await response.json();

    return data;
  } catch(error) {
    console.error('Emergencies Location did not fetched:', error);
    return[];
  }
}

export async function getAssignedEmergenciesLocation() {
  try {
    const response = await fetch("../api/emergencies/get_assigned_emergencies.php");
    const data = await response.json();

    return data;
  } catch(error) {
    console.error('Assigend Emergencies did not fetched:', error);
    return[];
  }
}

export async function getRespondersByType(type) {
  try {
    const response = await fetch(`../api/emergencies/get_responders.php?type=${type}`);
    const data = await response.json();

    return data;
  } catch(error) {
    console.error('Responders fetch error:', error);
    return [];
  }
}

export async function getEmergencyRoute(emergencyId, responderId) {
  try {
    const response = await fetch(`../api/emergencies/get_emergency_route.php?emergency_id=${emergencyId}&responder_id=${responderId}`);

    const data = await response.json();

    return data;
  } catch(error) {
    console.error('Emergency Route fetch error:', error);
    return null;
  }
}

export async function getAssignedRoutes() {
  try {
    const response = await fetch('../api/emergencies/get_assigned_routes.php');

    const data = await response.json();

    return data;
  } catch(error) {
    console.error('Assigend Emergency Route error:', error);
    return [];
  }
}

export async function getEmergencyCounts() {
  try {
    const response = await fetch("../api/emergencies/get_emergency_counts.php");

    return await response.json();
  } catch(error) {
    console.error(error);

    return {
      pending: 0,
      assigned: 0
    }
  }
}