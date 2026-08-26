export async function insertViolationReport(violationData) {
  try {
    const response = await fetch('../api/violations/insert_violation_reports.php', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(violationData)
    });

    const result = await response.json();

    if(!response.ok || !result.success) {
      throw new Error(result.message || "Failed to submit violation report");
    }

    return result;
  } catch (error) {
    console.error("Violation report submission error", error);

    throw error;
  }
}

export async function getViolationDetails() {
  try {

    const response = await fetch('../api/violations/get_violation_details.php');

     if(!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const result = await response.json();

    return Array.isArray(result) ? result : [];

  } catch(error) {

    console.error("Failed to fetch violation details:", error);

    return [];

  }
}

export async function updateVerificationStatus(
  violationId,
  status
) {

  try {

    const response = await fetch(
      "../api/violations/update_violation_status.php",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          violation_id:
            violationId,

          status:
            status

        })
      }
    );


    const result =
      await response.json();


    if(!response.ok || !result.success) {

      throw new Error(
        result.message ||
        "Failed to update violation status."
      );

    }


    return result;

  } catch(error) {

    console.error(
      "Violation status update error:",
      error
    );

    throw error;

  }

}