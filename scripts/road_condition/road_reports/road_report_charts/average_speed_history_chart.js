let averageSpeedHistoryChart = null;

export function renderAverageSpeedHistoryChart(
  canvas,
  roadStats
) {

  // Destroy previous chart before creating a new one
  if (averageSpeedHistoryChart) {
    averageSpeedHistoryChart.destroy();
  }

  const roads = Object.values(roadStats);

  if (roads.length === 0) {
    return;
  }

  const labels = roads.map(road =>
    road.road_name
  );

  const averageData = roads.map(road => {

    const speeds = road.speeds;

    return speeds.reduce(
      (sum, speed) => sum + speed,
      0
    ) / speeds.length;

  });

  const peakData = roads.map(road =>
    Math.max(...road.speeds)
  );

  const lowestData = roads.map(road =>
    Math.min(...road.speeds)
  );

  averageSpeedHistoryChart = new Chart(canvas, {

    type: "bar",

    data: {

      labels: labels,

      datasets: [

        {
          label: "Average Speed",
          data: averageData,

          borderWidth: 1
        },

        {
          label: "Peak Speed",
          data: peakData,

          borderWidth: 1
        },

        {
          label: "Lowest Speed",
          data: lowestData,

          borderWidth: 1
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

              return `${context.dataset.label}: ${context.parsed.y.toFixed(2)} km/h`;

            }

          }

        }

      },

      scales: {

        x: {

          title: {
            display: true,
            text: "Road"
          }

        },

        y: {

          beginAtZero: true,

          title: {
            display: true,
            text: "Speed (km/h)"
          }

        }

      }

    }

  });

}