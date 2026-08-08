let congestionFrequencyChart = null;

export function renderCongestionFrequencyChart(canvas, roadStats) {

  // Destroy previous chart before creating a new one
  if (congestionFrequencyChart) {
      congestionFrequencyChart.destroy();
  }

  const roads = Object.values(roadStats);

  const labels = roads.map(road => road.road_name);

  const lowData = roads.map(road => road.low);
  const moderateData = roads.map(road => road.moderate);
  const highData = roads.map(road => road.high);

  congestionFrequencyChart = new Chart(canvas, {
    type: "bar",

    data: {
      labels: labels,
      datasets: [
        {
          label: "Low",
          data: lowData,
          stack: "congestion"
        },
        {
          label: "Moderate",
          data: moderateData,
          stack: "congestion"
        },
        {
          label: "High",
          data: highData,
          stack: "congestion"
        }
      ]
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
            position: "top"
        },

        tooltip: {
            mode: "index",
            intersect: false
        }
      },

      scales: {
        x: {
          stacked: true,

          title: {
              display: true,
              text: "Road"
          }
        },

        y: {
          stacked: true,

          beginAtZero: true,

          title: {
            display: true,
            text: "Number of Records"
          },

          ticks: {
            precision: 0
          }
        }
      }
    }
  });
}