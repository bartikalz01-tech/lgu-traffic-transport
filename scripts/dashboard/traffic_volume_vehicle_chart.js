let trafficChart = null;
let latestTrafficData = [];

export function initializedTrafficChart() {

  const ctx = document.getElementById("trafficVolumeChart").getContext("2d");

  trafficChart = new Chart(ctx, {

    type: "bar",

    data: {

      labels: [],

      datasets: [
        {
          label: "Vehicles / Minute",
          data: [],
          borderWidth: 1,
          borderRadius: 8
        }
      ]

    },

    options: {

      responsive: true,
      maintainAspectRatio: false,

      indexAxis: "y",

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

        x: {

          beginAtZero: true,

          title: {
            display: true,
            text: "Vehicles / Minute"
          }

        }

      }

    }

  });

  const roadFilter = document.getElementById("roadFilter");

  roadFilter.addEventListener("change", () => {
    renderChart();
  });

}

export function updateTrafficChart(trafficData) {

  latestTrafficData = [...trafficData];

  populateRoadFilter(latestTrafficData);

  renderChart();
}

function renderChart() {

  const selectedRoad = document.getElementById("roadFilter").value || "all";

  let roads = [...latestTrafficData];

  if (selectedRoad !== "all") {
    roads = roads.filter(
      road => road.road_name === selectedRoad
    );
  }

  roads.sort(
    (a, b) => b.vehicle_flow - a.vehicle_flow
  );

  trafficChart.data.labels = roads.map(road => road.road_name);

  trafficChart.data.datasets[0].data = roads.map(road => Number(road.vehicle_flow));

  trafficChart.data.datasets[0].backgroundColor = roads.map(road =>
    getTrafficColor(road.traffic_level)
  );

  trafficChart.update();

}

function populateRoadFilter(roads) {

  const roadFilter = document.getElementById("roadFilter");

  let selected = roadFilter.value;
  if (!selected || selected === "") {
    selected = "all";
  }

  roadFilter.innerHTML = `
    <option value="all">All Roads</option>
  `;

  roads.forEach(road => {
    roadFilter.innerHTML += `
      <option value="${road.road_name}">
        ${road.road_name}
      </option>
    `;
  });

  roadFilter.value = roads.some(road => road.road_name === selected)
    ? selected
    : "all";

}


function getTrafficColor(level) {

  switch ((level || "").toLowerCase()) {

    case "high":
      return "#db3d3d";

    case "moderate":
      return "#f39c12";

    case "low":
      return "#28a745";

    default:
      return "#6c757d";

  }

}