export async function insertAccidentReport(accidentData) {
  
  const response = await fetch("../api/accidents/insert_accident_report.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(accidentData)
  });

  const data = await response.json();

  if(!response.ok || !data.success) {
    throw new Error(
      data.message || "Failed to insert accident report"
    );
  }

  return data;

}