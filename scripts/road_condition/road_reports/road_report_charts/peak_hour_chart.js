let peakHourChart = null;

export function renderPeakHourChart(
  container,
  peakHour,
  lowestHour,
  formatHour
) {

  // Destroy previous chart
  if (peakHourChart) {
    peakHourChart.destroy();
    peakHourChart = null;
  }

  container.innerHTML = "";

  if (!peakHour && !lowestHour) {
    container.innerHTML = `
      <div class="chart-empty">
        No traffic records found.
      </div>
    `;

    return;
  }

  const labels = [];
  const vehicleFlowData = [];
  const averageSpeedData = [];

  if (peakHour) {

    labels.push(
      `Peak\n${formatHour(peakHour.traffic_hour)}`
    );

    vehicleFlowData.push(
      Number(peakHour.avg_vehicle_flow)
    );

    averageSpeedData.push(
      Number(peakHour.avg_speed)
    );
  }

  if (lowestHour) {

    labels.push(
      `Lowest\n${formatHour(lowestHour.traffic_hour)}`
    );

    vehicleFlowData.push(
      Number(lowestHour.avg_vehicle_flow)
    );

    averageSpeedData.push(
      Number(lowestHour.avg_speed)
    );
  }

  const canvas = document.createElement("canvas");

  canvas.id = "peakHourAnalyticsChart";

  container.appendChild(canvas);

  const ctx = canvas.getContext("2d");

  peakHourChart = new Chart(ctx, {

    type: "bar",

    data: {

      labels: labels,

      datasets: [

        {
          label: "Vehicle Flow",
          data: vehicleFlowData,

          borderWidth: 1,

          yAxisID: "y"
        },

        {
          label: "Average Speed",
          data: averageSpeedData,

          borderWidth: 1,

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

                return `${context.dataset.label}: ${context.parsed.y.toFixed(0)} vehicles/min`;

              }

              return `${context.dataset.label}: ${context.parsed.y.toFixed(0)} km/h`;

            }

          }

        }

      },

      scales: {

        x: {

          title: {
            display: true,
            text: "Traffic Period"
          }

        },

        y: {

          beginAtZero: true,

          title: {
            display: true,
            text: "Vehicle Flow (vehicles/min)"
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