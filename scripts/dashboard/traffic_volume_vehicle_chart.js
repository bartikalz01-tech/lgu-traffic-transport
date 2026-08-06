let trafficChart = null;

const trafficHistory = {};
const historyLabels = [];

const MAX_HISTORY = 20;

export function initializedTrafficChart() {
  const ctx = document.getElementById("trafficVolumeChart").getContext("2d");

  trafficChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: []
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1500,
        easing: "easeInOutQuart" 
      },
      plugins: {
        legend: {
          position: "bottom"
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Vehicles Per Minute"
          }
        }
      }
    }
  });
}

export function updateTrafficChart(trafficData) {
  const now = new Date().toLocaleTimeString();

  historyLabels.push(now);

  if(historyLabels.length > MAX_HISTORY) {
    historyLabels.shift();
  }

  trafficData.forEach(road => {
    if(!trafficHistory[road.road_name]) {
      trafficHistory[road.road_name] = [];
    }

    trafficHistory[road.road_name].push(
      Number(road.vehicle_flow)
    );

    if(trafficHistory[road.road_name].length > MAX_HISTORY) {
      trafficHistory[road.road_name].shift();
    }
  });

  renderChart();
}

function renderChart() {
  trafficChart.data.labels = [...historyLabels];

  trafficChart.data.datasets = Object.keys(trafficHistory).map(
    (roadName, index) => ({
      label: roadName,
      data: trafficHistory[roadName],
      tension: 0.4,
      fill: false,
      borderColor: getRoadColor(index)
    })
  );

  trafficChart.update();
}

function getRoadColor(index){

  const colors = [

    "#db3d3d",

    "#3498db",

    "#28a745",

    "#ffc107",

    "#9c27b0",

    "#009688"

  ];

  return colors[index % colors.length];

}