export async function getAuditLogs() {

  try {
    const response = await fetch('../api/audit_logs/audit_logs_api.php');

    const result = await response.json();

    return result

  } catch(error) {
    console.log(error);
  }
}