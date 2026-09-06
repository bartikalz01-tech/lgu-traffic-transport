export function renderPossibleAccidents(container, possibleAccidents = []) {

  if(!possibleAccidents || possibleAccidents.length === 0) {
    container.innerHTML = `
      <div class="possible-accident-empty">
        <i class="fas fa-circle-check"></i>
        <p>No possible accidents detected.</p>
      </div>
    `;

    return;
  }

  container.innerHTML = `
    <div class="possible-accident-grid">
    
      ${possibleAccidents.map(accident => {
        
        const detectedDate = new Date(
          accident.detected_at.replace(" ", "T")
        );

        const date = detectedDate.toLocaleDateString("en-us", {
          year: "numeric",
          month: "long",
          day: "numeric"
        });

        const time = detectedDate.toLocaleTimeString("en-us", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true
        });

        return `
          <div class="possible-accident-card" data-possible-accident-id="${accident.accident_detection_id}">
            <div class="possible-accident-snapshot">
              ${
                accident.snapshot_filename ? `
                  <img 
                    src="http://127.0.0.1:5001/accident_evidence/snapshots/file/${encodeURIComponent(accident.snapshot_filename)}"
                    alt="Possible accident snapshot"
                  >
                `
                : `<i class="fas fa-camera-retro"></i>`
              }
            </div>

            <div class="possible-accident-details">
              <div class="road-details">
                <p><i class="fas fa-road"></i></p>
                <p class="road-name">${accident.road_name || "Unknown Road"}</p>
              </div>

              <div class="detection-details">
                <p>${date}</p>
                <p>${time}</p>
              </div>
            </div>
          </div>
        `;
      }).join("")}

    </div>
  `;

}