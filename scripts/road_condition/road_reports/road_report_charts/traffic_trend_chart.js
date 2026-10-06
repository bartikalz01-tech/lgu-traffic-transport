export function renderTrafficTrendChart(container, logs) {

  if (!logs || logs.length === 0) {
    container.innerHTML = `
      <div class="chart-empty">
        No traffic trend data available.
      </div>
    `;
    return;
  }


  // ==========================================================
  // CLEAR PREVIOUS CHART
  // ==========================================================

  container.innerHTML = "";


  // ==========================================================
  // SCROLL CONTAINER
  // ==========================================================

  const scrollContainer = document.createElement("div");
  scrollContainer.className = "traffic-chart-scroll";

  const chartInner = document.createElement("div");
  chartInner.className = "traffic-chart-inner";

  const canvas = document.createElement("canvas");
  canvas.id = "trafficTrendBarChart";

  chartInner.appendChild(canvas);
  scrollContainer.appendChild(chartInner);
  container.appendChild(scrollContainer);

  const ctx = canvas.getContext("2d");


  // ==========================================================
  // LABELS
  // ==========================================================

  const labels = logs.map(log => {

    return new Date(log.recorded_at).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });

  });


  // ==========================================================
  // VEHICLE FLOW
  // ==========================================================

  const vehicleFlow = logs.map(log =>
    Number(log.vehicle_flow)
  );


  // ==========================================================
  // TRAFFIC LEVEL NORMALIZATION
  // ==========================================================

  /*
     Normalize every traffic level first.

     Example:

     "HIGH"       -> "high"
     "High "      -> "high"
     " moderate " -> "moderate"
     "LOW"        -> "low"
  */

  const trafficLevels = logs.map(log => {

    return String(log.traffic_level || "")
      .trim()
      .toLowerCase();

  });


  // ==========================================================
  // BAR COLORS
  // ==========================================================

  const backgroundColors = trafficLevels.map(trafficLevel => {

    switch (trafficLevel) {

      case "high":
        return "#dc2626";       // RED

      case "moderate":
        return "#facc15";       // YELLOW

      case "low":
        return "#16a34a";       // GREEN

      default:
        return "#94a3b8";       // UNKNOWN / INVALID
    }

  });


  // ==========================================================
  // BORDER COLORS
  // ==========================================================

  const borderColors = trafficLevels.map(trafficLevel => {

    switch (trafficLevel) {

      case "high":
        return "#b91c1c";       // DARK RED

      case "moderate":
        return "#ca8a04";       // DARK YELLOW

      case "low":
        return "#15803d";       // DARK GREEN

      default:
        return "#64748b";       // UNKNOWN / INVALID
    }

  });


  // ==========================================================
  // CHART WIDTH
  // ==========================================================

  /*
     Approximately 15 records are visible at once.

     If there are more records, the chart becomes
     horizontally scrollable.
  */

  const visibleRecords = 15;

  const containerWidth = container.clientWidth;

  const pointWidth = containerWidth / visibleRecords;

  const chartWidth = Math.max(
    containerWidth,
    logs.length * pointWidth
  );

  chartInner.style.width = `${chartWidth}px`;


  // ==========================================================
  // CANVAS SIZE
  // ==========================================================

  canvas.width = chartWidth;
  canvas.height = 360;

  canvas.style.width = `${chartWidth}px`;
  canvas.style.height = "360px";


  // ==========================================================
  // BAR CHART
  // ==========================================================

  new Chart(ctx, {

    type: "bar",

    data: {

      labels,

      datasets: [

        {
          label: "Vehicle Flow",

          data: vehicleFlow,

          backgroundColor: backgroundColors,

          borderColor: borderColors,

          borderWidth: 1,

          borderRadius: 4,

          barPercentage: 0.7,

          categoryPercentage: 0.8
        }

      ]

    },


    // ========================================================
    // OPTIONS
    // ========================================================

    options: {

      responsive: false,

      maintainAspectRatio: false,


      interaction: {
        mode: "index",
        intersect: false
      },


      plugins: {

        legend: {
          display: true
        },


        tooltip: {

          callbacks: {

            label: function(context) {

              const log = logs[context.dataIndex];

              return [
                `Vehicle Flow: ${Number(log.vehicle_flow).toFixed(0)} veh/min`,
                `Average Speed: ${Number(log.avg_speed).toFixed(2)} km/h`,
                `Traffic Level: ${String(log.traffic_level).trim()}`
              ];

            }

          }

        }

      },


      // ======================================================
      // AXES
      // ======================================================

      scales: {

        x: {

          title: {
            display: true,
            text: "Time"
          },

          ticks: {

            autoSkip: false,

            maxRotation: 45,

            minRotation: 45

          }

        },


        y: {

          beginAtZero: true,

          title: {
            display: true,
            text: "Vehicle Flow (veh/min)"
          }

        }

      }

    }

  });

}