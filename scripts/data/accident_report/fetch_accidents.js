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

export async function getAccidentDetails() {

  try {

    const response = await fetch(
      "../api/accidents/get_accident_details.php"
    );

    if(!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const result = await response.json();

    return Array.isArray(result) ? result : [];

  } catch(error) {

    console.error("Failed to fetch accident details:", error);

    return [];

  }

}