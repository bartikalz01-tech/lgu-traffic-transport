document.addEventListener('DOMContentLoaded', function () {
  const openSidebarBtn = document.querySelector('.hamburger-menu-btn');
  const closeSidebarBtn = document.querySelector('.sidebar-close-btn');
  const sidebar = document.querySelector('.sidebar-container');
  const sidebarOverlay = document.querySelector('.sidebar-overlay');

  if (openSidebarBtn && sidebar && sidebarOverlay) {
    openSidebarBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      sidebarOverlay.classList.toggle('visible');
    });
  }

  if (closeSidebarBtn && sidebar && sidebarOverlay) {
    closeSidebarBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      sidebarOverlay.classList.toggle('visible');
    });
  }

  // Close sidebar when clicking overlay
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
      if (sidebar) {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('visible');
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {

  const ctx = document.getElementById('trafficVolumeChart');

  const roadData = {
    "Dome": [45, 80, 120, 95, 70, 60, 85],
    "Mt. Natib": [30, 60, 100, 110, 90, 75, 50],
    "Klawit": [20, 40, 75, 90, 65, 55, 45],
    "Kalandang": [15, 35, 60, 70, 50, 40, 30],
    "Mauban": [25, 55, 85, 100, 80, 65, 55],
    "Tagaytay St": [10, 25, 45, 60, 50, 35, 20]
  };

  const colors = {
    "Dome": "#db3d3d",
    "Mt. Natib": "#3d6ddb",
    "Klawit": "#28a745",
    "Kalandang": "#ff9800",
    "Mauban": "#9c27b0",
    "Tagaytay St": "#009688"
  };

  function generateDataset(roadName) {
    return {
      label: roadName,
      data: roadData[roadName],
      borderColor: colors[roadName],
      backgroundColor: colors[roadName] + "33",
      tension: 0.4,
      fill: false
    };
  }

  function generateAllDatasets() {
    return Object.keys(roadData).map(road =>
      generateDataset(road)
    );
  }

  const trafficVolumeChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ["6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM"],
      datasets: generateAllDatasets()
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
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

  // DROPDOWN FILTER
  document.getElementById("roadFilter").addEventListener("change", function () {

    const selected = this.value;

    if (selected === "all") {
      trafficVolumeChart.data.datasets = generateAllDatasets();
    } else {
      trafficVolumeChart.data.datasets = [generateDataset(selected)];
    }

    trafficVolumeChart.update();
  });

  const congestionCtx = document.getElementById("congestionPieChart");

  const congestionData = {
    low: 37,
    medium: 3,
    high: 60
  };

  const congestionPieChart = new Chart(congestionCtx, {
    type: "pie",
    data: {
      labels: ["Low", "Moderate", "High"],
      datasets: [{
        data: [
          congestionData.low,
          congestionData.medium,
          congestionData.high
        ],
        backgroundColor: [
          "#28a745", // green
          "#ffc107", // yellow
          "#dc3545"  // red
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right"
        }
      }
    }
  });

  const speedCtx = document.getElementById("averageSpeedChart");

  const averageSpeedChart = new Chart(speedCtx, {
    type: "bar",
    data: {
      labels: [
        "Dome",
        "Mt. Natib",
        "Klawit",
        "Kalandang",
        "Mauban",
        "Tagaytay St"
      ],
      datasets: [{
        label: "Average Speed (km/h)",
        data: [
          32,
          28,
          35,
          40,
          30,
          25
        ],
        backgroundColor: [
          "#3498db",
          "#ffc107",
          "#3498db",
          "#3498db",
          "#ffc107",
          "#dc3545"
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Speed (km/h)"
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
});