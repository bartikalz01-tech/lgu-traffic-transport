export async function fetchVerifiedViolations() {

  try {

    const response = await fetch(
      "../api/tickets_api/get_verified_violations.php"
    );

    if(!response.ok) {

      throw new Error(
        `HTTP error: ${response.status}`
      );

    }

    const result =
      await response.json();

    if(!result.success) {

      throw new Error(
        result.message ||
        "Failed to fetch verified violations."
      );

    }

    return Array.isArray(result.violations)
      ? result.violations
      : [];

  } catch(error) {

    console.error(
      "Failed to fetch verified violations:",
      error
    );

    throw error;

  }

}

export async function fetchAvailableOfficers() {

  try {

    const response = await fetch(
      "../api/tickets_api/get_available_officers.php"
    );

    if (!response.ok) {

      throw new Error(
        `HTTP error: ${response.status}`
      );

    }

    const result =
      await response.json();

    if (!result.success) {

      throw new Error(
        result.message ||
        "Failed to fetch available officers."
      );

    }

    return Array.isArray(result.officers)
      ? result.officers
      : [];

  } catch(error) {

    console.error(
      "Failed to fetch available officers:",
      error
    );

    throw error;

  }

}

/*export async function fetchCreateTicket(ticketData) {

  try {

    const response = await fetch(
      "../api/tickets_api/create_ticket.php",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(ticketData)
      }
    );


    if (!response.ok) {

      throw new Error(
        `HTTP error: ${response.status}`
      );

    }


    const result =
      await response.json();


    if (!result.success) {

      throw new Error(
        result.message ||
        "Failed to create ticket."
      );

    }


    return result;


  } catch(error) {

    console.error(
      "Failed to create ticket:",
      error
    );

    throw error;

  }

}*/

export async function fetchCreateTicket(ticketData) {

  try {

    const response = await fetch(
      "../api/tickets_api/create_ticket.php",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(ticketData)
      }
    );


    const responseText =
      await response.text();


    console.log(
      "Create ticket raw response:",
      responseText
    );


    let result;

    try {

      result =
        JSON.parse(responseText);

    } catch (jsonError) {

      console.error(
        "Server returned invalid JSON:",
        responseText
      );

      throw new Error(
        "Server returned an invalid response. Check the PHP error/log."
      );

    }


    if (!response.ok) {

      throw new Error(
        result.message ||
        `HTTP error: ${response.status}`
      );

    }


    if (!result.success) {

      throw new Error(
        result.message ||
        "Failed to create ticket."
      );

    }


    return result;


  } catch(error) {

    console.error(
      "Failed to create ticket:",
      error
    );

    throw error;

  }

}

export async function fetchTickets() {

  try {

    const response =
      await fetch(
        "../api/tickets_api/get_tickets.php"
      );


    const responseText =
      await response.text();


    console.log(
      "Get tickets raw response:",
      responseText
    );


    let result;

    try {

      result =
        JSON.parse(responseText);

    } catch (jsonError) {

      console.error(
        "Server returned invalid JSON:",
        responseText
      );

      throw new Error(
        "Server returned an invalid response while loading tickets."
      );

    }


    if (!response.ok) {

      throw new Error(
        result.message ||
        `HTTP error: ${response.status}`
      );

    }


    if (!result.success) {

      throw new Error(
        result.message ||
        "Failed to fetch tickets."
      );

    }


    return Array.isArray(result.tickets)
      ? result.tickets
      : [];


  } catch(error) {

    console.error(
      "Failed to fetch tickets:",
      error
    );

    throw error;

  }

}