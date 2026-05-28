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