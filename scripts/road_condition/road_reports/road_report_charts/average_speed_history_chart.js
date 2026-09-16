let averageSpeedHistoryChart = null;


export function renderAverageSpeedHistoryChart(
  canvas,
  logs
) {

  // ==========================================================
  // DESTROY PREVIOUS CHART
  // ==========================================================

  if (averageSpeedHistoryChart) {

    averageSpeedHistoryChart.destroy();

    averageSpeedHistoryChart = null;

  }


  // ==========================================================
  // NO DATA
  // ==========================================================

  if (!logs || logs.length === 0) {

    return;

  }


  // ==========================================================
  // GET UNIQUE ROADS
  // ==========================================================

  const roads = [];

  logs.forEach(log => {

    const existingRoad =
      roads.find(
        road => road.road_id === log.road_id
      );


    if (!existingRoad) {

      roads.push({

        road_id: log.road_id,

        road_name: log.road_name

      });

    }

  });


  // ==========================================================
  // TIME LABELS
  // ==========================================================

  const labels = logs.map(log => {

    const date =
      new Date(
        log.recorded_at.replace(" ", "T")
      );


    return date.toLocaleString([], {

      month: "short",

      day: "numeric",

      hour: "numeric",

      minute: "2-digit"

    });

  });


  // ==========================================================
  // CHART WIDTH
  // ==========================================================

  /*
     Approximately 10 records are visible at once.

     If there are more records, the chart becomes wider
     and .traffic-chart-scroll provides horizontal scrolling.
  */

  const visibleRecords = 30;


  const scrollContainer =
    canvas.parentElement.parentElement;


  const containerWidth =
    scrollContainer.clientWidth;


  const pointWidth =
    containerWidth / visibleRecords;


  const chartWidth =
    Math.max(

      containerWidth,

      logs.length * pointWidth

    );


  const chartInner =
    canvas.parentElement;


  chartInner.style.width =
    `${chartWidth}px`;


  // ==========================================================
  // CANVAS SIZE
  // ==========================================================

  canvas.width = chartWidth;

  canvas.height = 360;

  canvas.style.width =
    `${chartWidth}px`;

  canvas.style.height =
    "360px";


  // ==========================================================
  // DATASETS
  // ==========================================================

  const datasets = roads.map(road => {

    return {

      label: road.road_name,

      data: logs.map(log => {

        if (
          Number(log.road_id)
          ===
          Number(road.road_id)
        ) {

          return Number(log.avg_speed);

        }


        return null;

      }),

      fill: false,

      borderWidth: 2,

      tension: 0.3,

      pointRadius: 3,

      pointHoverRadius: 5,

      spanGaps: false

    };

  });


  // ==========================================================
  // CREATE CHART
  // ==========================================================

  averageSpeedHistoryChart =
    new Chart(canvas, {

      type: "line",


      data: {

        labels,

        datasets

      },


      options: {

        responsive: false,

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

              title: function(context) {

                return context[0].label;

              },


              label: function(context) {

                if (
                  context.parsed.y === null
                ) {

                  return null;

                }


                return `${context.dataset.label}: `
                  + `${context.parsed.y.toFixed(2)} km/h`;

              }

            }

          }

        },


        // ======================================================
        // AXES
        // ======================================================

        scales: {

          x: {

            title: {

              display: true,

              text: "Time"

            },


            ticks: {

              autoSkip: false,

              maxRotation: 45,

              minRotation: 45

            }

          },


          y: {

            beginAtZero: true,


            suggestedMax: 80,


            title: {

              display: true,

              text: "Average Speed (km/h)"

            }

          }

        }

      }

    });

}