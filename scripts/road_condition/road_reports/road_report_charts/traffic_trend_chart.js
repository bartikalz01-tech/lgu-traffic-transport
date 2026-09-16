export function renderTrafficTrendChart(container, logs) {

  if (!logs || logs.length === 0) {
    container.innerHTML = `
      <div class="chart-empty">
        No traffic trend data available.
      </div>
    `;
    return;
  }

  // Clear previous chart
  container.innerHTML = "";

  // ==========================================================
  // SCROLL CONTAINER
  // ==========================================================

  const scrollContainer = document.createElement("div");
  scrollContainer.className = "traffic-chart-scroll";

  const chartInner = document.createElement("div");
  chartInner.className = "traffic-chart-inner";

  const canvas = document.createElement("canvas");
  canvas.id = "trafficTrendAreaChart";

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
  // DATA
  // ==========================================================

  const vehicleFlow = logs.map(log =>
    Number(log.vehicle_flow)
  );


  // ==========================================================
  // CHART WIDTH
  // ==========================================================

  /*
     The visible chart should show approximately 10 records.

     Each record gets a fixed amount of horizontal space.
     When there are more than 10 records, the chart becomes
     wider and the chart container scrolls horizontally.
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
  // AREA CHART
  // ==========================================================

  new Chart(ctx, {

    type: "line",

    data: {

      labels,

      datasets: [
        {
          label: "Vehicle Flow",

          data: vehicleFlow,

          fill: true,

          borderWidth: 2,

          tension: 0.3,

          pointRadius: 3,

          pointHoverRadius: 5
        }
      ]

    },


    // ========================================================
    // OPTIONS
    // ========================================================

    options: {

      /*
         IMPORTANT:
         Chart.js must NOT resize the canvas to the
         visible container width.

         The canvas width is controlled above.
      */

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
                `Traffic Level: ${log.traffic_level}`
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