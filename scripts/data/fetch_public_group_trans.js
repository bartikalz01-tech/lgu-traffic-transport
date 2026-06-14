export async function insertPuvGroup(payload) {
  try {
    const response = await fetch(`../api/puv_api/insert_puv_group.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    return result;
  } catch(error) {
    console.error("Error in sending data", error);
    return {
      status: "error",
      message: "Request Failed"
    }
  }
}

export async function insertPuvMember(payload) {
  try {
    const response = await fetch('../api/puv_api/insert_puv_member.php', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    return result;
  } catch(error) {
    console.error("Error in sending data", error);
    return {
      status: "error",
      message: "Request Failed"
    }
  }
}

export async function assignVehicle(payload) {
  try {
    const response = await fetch("../api/puv_api/insert_puv_vehicle.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    return await response.json();
  } catch(error) {
    return {
      status: "error",
      message: "Request Failed"
    }
  }
}

export async function insertPuvRoute(payload) {
  try {
    const response = await fetch("../api/puv_api/insert_puv_route.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    return await response.json();
  } catch(error) {

    return {
      status: "error",
      messsage: error
    };

  }
}

export async function updateMemberDetails(payload) {
  try {
    const response = await fetch("../api/puv_api/update_member_details.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    
    return await response.json();
  } catch(error) {
    return {
      status: "error",
      message: `Request Failed: ${error}`
    }
  }
}

export async function retirePuvMember(payload) {
  try {
    const response = await fetch("../api/puv_api/update_retire_member.php", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(payload)
    });

    return await response.json();
  } catch(error) {
    console.error("retired personnel error:", error);
  }
}

export async function getPuvGroup() {
  try {
    const response = await fetch("../api/puv_api/get_puv_groups.php");

    const result = await response.json();

    return result;
  } catch(error) {
    console.error("Failed to get puv groups data");
    return [];
  }
}

export async function getPuvMembers(puvGroupId) {
  try {
    const response = await fetch(`../api/puv_api/get_puv_members.php?puv_group_id=${puvGroupId}`);

    const result = await response.json();

    return result;

  } catch(error) {
    console.error("Faile to fetch PUV members", error);

    return {
      status: "error",
      message: "Request Failed"
    }
  }
}

export async function getPuvRetiredMembers(puvGroupId) {
  try {
    const response = await fetch(`../api/puv_api/get_puv_retired_members.php?puv_group_id=${puvGroupId}`);

    const result = await response.json();

    return result;
  } catch(error) {
    console.error("Failed to fetch PUV retired members:", error);

    return {
      status: "error",
      message: "Request Failed"
    }
  }
}

export async function getVehiclesByGroup(groupId) {
  try {
    const response = await fetch(
      `../api/puv_api/get_group_vehicles.php?group_id=${groupId}`
    );

    return await response.json();

  } catch(error) {
    return {
      status: "error",
      message: "Failed to fetch vehicles"
    };
  }
}

export async function getRouteSuggestions(payload) {
  try {
    const response = await fetch("../api/puv_api/get_puv_route_suggestions.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    return await response.json();
  } catch(error) {
    return {
      status: "error",
      message: "Request Failed"
    };
  }
}

export async function getCurrentRoute(puvGroupId) {
  try {
    const response = await fetch(`../api/puv_api/get_puv_route.php?puv_group_id=${puvGroupId}`);

    return await response.json();

  } catch(error) {
    
    return {
      status: "error",
      message: "Request Failed"
    };

  }
}

export async function getDiversionRoutes(lat, lng, destination) {
  try {
    const response = await fetch(`../api/puv_api/get_puv_diversion_routes.php?lat=${lat}&lng=${lng}&destination=${destination}`);

    return await response.json();

  } catch(error) {

    return {
      status: "error",
      message: `Request Failed: ${error}`
    };

  }
}