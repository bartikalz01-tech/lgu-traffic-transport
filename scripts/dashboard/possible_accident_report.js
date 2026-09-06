let initialized = false;

let knownAccidentDetectionIds = new Set();


function getLatestAccidentPerRoad(possibleAccidents) {

  const latestByRoad = new Map();

  possibleAccidents.forEach(accident => {

    const roadName =
      String(
        accident.road_name || "Unknown Road"
      ).trim();

    if (!latestByRoad.has(roadName)) {

      latestByRoad.set(
        roadName,
        accident
      );

      return;
    }

    const existing =
      latestByRoad.get(roadName);

    const existingDate =
      new Date(
        String(existing.detected_at || "")
          .replace(" ", "T")
      );

    const currentDate =
      new Date(
        String(accident.detected_at || "")
          .replace(" ", "T")
      );

    if (
      !isNaN(currentDate.getTime()) &&
      (
        isNaN(existingDate.getTime()) ||
        currentDate > existingDate
      )
    ) {

      latestByRoad.set(
        roadName,
        accident
      );

    }

  });

  return Array.from(
    latestByRoad.values()
  );

}

function formatDetectedTime(detectedAt) {

  if (!detectedAt) {
    return "-";
  }

  const date = new Date(
    detectedAt.replace(" ", "T")
  );

  if (isNaN(date.getTime())) {
    return detectedAt;
  }

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
}


function getTimeAgo(detectedAt) {

  if (!detectedAt) {
    return "-";
  }

  const date = new Date(
    detectedAt.replace(" ", "T")
  );

  if (isNaN(date.getTime())) {
    return detectedAt;
  }

  const now = new Date();

  const difference =
    Math.floor(
      (now.getTime() - date.getTime()) / 1000
    );


  if (difference < 10) {
    return "Just now";
  }

  if (difference < 60) {
    return `${difference} sec ago`;
  }

  const minutes =
    Math.floor(difference / 60);

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours =
    Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hr ago`;
  }

  const days =
    Math.floor(hours / 24);

  return `${days} day${days === 1 ? "" : "s"} ago`;
}


function escapeHtml(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


function showNewAccidentNotification(accident) {

  if (typeof Swal === "undefined") {
    return;
  }

  Swal.fire({

    toast: true,

    position: "top-end",

    icon: "warning",

    title: "Possible Accident Detected",

    html: `
      <div style="text-align:left;">
        <strong>
          ${escapeHtml(
            accident.road_name || "Unknown Road"
          )}
        </strong>

        <br>

        <small>
          Camera:
          ${escapeHtml(
            accident.camera_name || "Unknown Camera"
          )}
        </small>
      </div>
    `,

    showConfirmButton: false,

    timer: 5000,

    timerProgressBar: true

  });

}


export function possibleAccidentDashboard(
  container,
  possibleAccidents = []
) {

  if (!container) {
    console.error(
      "Possible Accident Dashboard: container not found."
    );

    return;
  }


  if (
    !Array.isArray(possibleAccidents) ||
    possibleAccidents.length === 0
  ) {

    container.innerHTML = `
      <div class="possible-incident-empty">

        <div class="possible-incident-empty-icon">
          <i class="fas fa-shield-check"></i>
        </div>

        <h4>
          No Possible Accidents
        </h4>

        <p>
          No possible accident detections have been reported.
        </p>

      </div>
    `;

    return;
  }


  /*
   * Detect newly arrived accident detections.
   *
   * The first data load is intentionally NOT
   * treated as a notification.
   */
  if (!initialized) {

    possibleAccidents.forEach(accident => {

      knownAccidentDetectionIds.add(
        String(
          accident.accident_detection_id
        )
      );

    });

    initialized = true;

  } else {

    possibleAccidents.forEach(accident => {

      const detectionId =
        String(
          accident.accident_detection_id
        );


      if (
        !knownAccidentDetectionIds.has(
          detectionId
        )
      ) {

        knownAccidentDetectionIds.add(
          detectionId
        );

        showNewAccidentNotification(
          accident
        );

      }

    });

  }

  const latestAccidents = getLatestAccidentPerRoad(possibleAccidents);


  container.innerHTML = `

    ${latestAccidents.map(accident => {

      const detectionId =
        escapeHtml(
          accident.accident_detection_id
        );

      const roadName =
        escapeHtml(
          accident.road_name ||
          "Unknown Road"
        );

      const cameraName =
        escapeHtml(
          accident.camera_name ||
          "Unknown Camera"
        );

      const detectedTime =
        formatDetectedTime(
          accident.detected_at
        );

      const timeAgo =
        getTimeAgo(
          accident.detected_at
        );


      return `

        <div
          class="possible-incident-card"
          data-detection-id="${detectionId}"
        >

          <div class="possible-incident-icon">

            <i class="fas fa-car-crash"></i>

          </div>


          <div class="possible-incident-details">

            <div class="possible-incident-road">

              ${roadName}

            </div>


            <div class="possible-incident-description">

              Possible accident detected by
              ${cameraName}

            </div>


            <div class="possible-incident-detection">

              <i class="fas fa-clock"></i>

              Detected at ${detectedTime}

            </div>

          </div>


          <div class="possible-incident-meta">

            <span class="possible-incident-status">

              <span class="live-dot"></span>

              Detection

            </span>


            <span class="possible-incident-time">

              ${timeAgo}

            </span>

          </div>

        </div>

      `;

    }).join("")}

  `;

}