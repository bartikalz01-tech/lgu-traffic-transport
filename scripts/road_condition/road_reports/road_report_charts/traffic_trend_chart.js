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

  const canvas = document.createElement("canvas");
  canvas.id = "trafficTrendLineChart";

  container.appendChild(canvas);

  const ctx = canvas.getContext("2d");

  const labels = logs.map(log => {
    return new Date(log.recorded_at).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  });

  const vehicleFlow = logs.map(log =>
    Number(log.vehicle_flow)
  );

  const averageSpeed = logs.map(log =>
    Number(log.avg_speed)
  );

  new Chart(ctx, {
    type: "line",

    data: {
      labels,

      datasets: [
        {
          label: "Vehicle Flow",
          data: vehicleFlow,

          borderWidth: 2,
          tension: 0.3,

          pointRadius: 3,
          pointHoverRadius: 5,

          yAxisID: "y"
        },

        {
          label: "Average Speed",
          data: averageSpeed,

          borderWidth: 2,
          tension: 0.3,

          pointRadius: 3,
          pointHoverRadius: 5,

          yAxisID: "y1"
        }
      ]
    },

    options: {

      responsive: true,

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

              if (context.dataset.label === "Vehicle Flow") {
                return `${context.dataset.label}: ${context.parsed.y} veh/min`;
              }

              return `${context.dataset.label}: ${context.parsed.y} km/h`;
            }
          }
        }
      },

      scales: {

        x: {
          title: {
            display: true,
            text: "Time"
          }
        },

        y: {
          beginAtZero: true,

          title: {
            display: true,
            text: "Vehicle Flow (veh/min)"
          }
        },

        y1: {
          beginAtZero: true,

          position: "right",

          title: {
            display: true,
            text: "Average Speed (km/h)"
          },

          grid: {
            drawOnChartArea: false
          }
        }
      }
    }
  });
}