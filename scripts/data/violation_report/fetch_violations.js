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