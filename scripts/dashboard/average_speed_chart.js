let averageSpeedChart = null;

export function initializeAverageSpeedChart() {

  const ctx = document.getElementById("averageSpeedChart").getContext("2d");

  averageSpeedChart = new Chart(ctx, {

    type: "bar",

    data: {

      labels: [],

      datasets: [
        {
          label: "Average Speed (km/h)",
          data: [],
          borderRadius: 8,
          borderWidth: 1
        }
      ]

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
          display: false
        }

      },

      scales: {

        y: {

          beginAtZero: true,

          title: {
            display: true,
            text: "km/h"
          }

        }

      }

    }

  });

}

export function updateAverageSpeedChart(trafficData) {

  const sortedRoads = [...trafficData].sort(
    (a, b) => b.avg_speed - a.avg_speed
  );

  averageSpeedChart.data.labels =
    sortedRoads.map(road => road.road_name);

  averageSpeedChart.data.datasets[0].data =
    sortedRoads.map(road => Number(road.avg_speed));

  averageSpeedChart.data.datasets[0].backgroundColor =
    sortedRoads.map(road =>
      getSpeedColor(Number(road.avg_speed))
    );

  averageSpeedChart.update();

}

function getSpeedColor(speed) {

  if(speed >= 40)
    return "#3498db";

  if(speed >= 25)
    return "#f39c12";

  return "#db3d3d";

}