export function renderTrafficConditionChart(trafficPercent) {
  const ctx = document.getElementById('trafficConditionChart');

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: trafficPercent.map(d => d.traffic_condition),
      datasets: [{
        data: trafficPercent.map(d => d.percentage),
        backgroundColor: [
          '#e74c3c',
          '#2ecc71',
          '#f1c40f'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {position: 'bottom'}
      }
    }
  });
}

export function renderTopRoadsChart(trafficData) {
  const roadCounts = {};

  trafficData.forEach(r => {
    if(r.traffic_condition === 'High Traffic') {
      roadCounts[r.road_name] = (roadCounts[r.road_name] || 0) + 1;
    }
  });

  const labels = Object.keys(roadCounts);
  const values = Object.values(roadCounts);

  new Chart(document.getElementById('topRoadsChart'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'High Traffic Reports',
        data: values,
        backgroundColor: '#e74c3c'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {beginAtZero: true}
      }
    }
  });
}

export function renderTrafficTrendChart(trafficData) {
  const grouped = {};

  trafficData.forEach(item => {
    grouped[item.traffic_date] = (grouped[item.traffic_date] || 0) + 1;
  });

  const labels = Object.keys(grouped);
  const values = Object.values(grouped);

  new Chart(document.getElementById('trafficTrendChart'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Traffic Reports',
        data: values,
        borderColor: '#3498db',
        fill: 'false',
        tension: 0.3
      }]
    },
    options: {
      responsive: true
    }
  });
}