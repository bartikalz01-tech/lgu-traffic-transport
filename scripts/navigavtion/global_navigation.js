export function openAccidentReport(publicAccidentId) {

  if (!publicAccidentId) {
    console.error("No public accident ID provided.");
    return;
  }

  sessionStorage.setItem(
    "openAccidentReportId",
    String(publicAccidentId).trim()
  );

  const url = new URL(
    "/lgu-traffic-transport/accident_reports/accident.php",
    window.location.href
  );

  window.location.href = url.href;
}