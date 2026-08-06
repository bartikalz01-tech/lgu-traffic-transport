let congestionPieChart = null;

export function initializeCongestionPieChart() {

  const ctx = document
    .getElementById("congestionPieChart")
    .getContext("2d");

  congestionPieChart = new Chart(ctx, {

    type: "pie",

    data: {
      labels: ["Low", "Moderate", "High"],
      datasets: [{
        data: [0, 0, 0],
        backgroundColor: [
          "#28a745",
          "#f39c12",
          "#db3d3d"
        ]
      }]
    },

    options: {

      responsive: true,
      maintainAspectRatio: false,

      animation: {
        duration: 800,
        easing: "easeInOutQuart"
      },

      plugins: {
        legend: {
          position: "right"
        }
      }

    }

  });

}

export function updateCongestionPieChart(trafficData) {

  let low = 0;
  let moderate = 0;
  let high = 0;

  trafficData.forEach(road => {

    switch ((road.traffic_level || "").toLowerCase()) {

      case "low":
        low++;
        break;

      case "moderate":
        moderate++;
        break;

      case "high":
        high++;
        break;

    }

  });

  const total = low + moderate + high;

  if (total === 0) return;

  congestionPieChart.data.datasets[0].data = [

    ((low / total) * 100).toFixed(1),

    ((moderate / total) * 100).toFixed(1),

    ((high / total) * 100).toFixed(1)

  ];

  congestionPieChart.update();

}