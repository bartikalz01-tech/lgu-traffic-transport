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