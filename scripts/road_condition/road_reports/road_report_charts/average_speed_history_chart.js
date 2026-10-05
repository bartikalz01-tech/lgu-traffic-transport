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
  // AVERAGE SPEED STATUS
  // ==========================================================

  let slowCount = 0;
  let moderateCount = 0;
  let fastCount = 0;


  logs.forEach(log => {

    const averageSpeed =
      Number(log.avg_speed);


    if (Number.isNaN(averageSpeed)) {
      return;
    }


    /*
    * Average speed status:
    *
    * Below 30 km/h
    * = Slow
    *
    * 30 - 49.99 km/h
    * = Moderate
    *
    * 50 km/h and above
    * = Fast
    */

    if (averageSpeed >= 50) {

      fastCount++;

    } else if (averageSpeed >= 30) {

      moderateCount++;

    } else {

      slowCount++;

    }

  });


  // ==========================================================
  // CREATE PIE CHART
  // ==========================================================

  averageSpeedHistoryChart =
    new Chart(canvas, {

      type: "pie",

      data: {

        labels: [
          "Slow",
          "Moderate",
          "Fast"
        ],

        datasets: [

          {

            data: [
              slowCount,
              moderateCount,
              fastCount
            ],

            backgroundColor: [
              "#c62828",
              "#f9a825",
              "#2e7d32"
            ],

            borderWidth: 1

          }

        ]

      },


      options: {

        responsive: true,

        maintainAspectRatio: false,


        plugins: {

          legend: {

            display: true,

            position: "bottom"

          },


          tooltip: {

            callbacks: {

              label: function(context) {

                const value =
                  context.parsed;

                const total =
                  context.dataset.data.reduce(
                    (sum, number) =>
                      sum + number,
                    0
                  );


                const percentage =
                  total > 0
                    ? ((value / total) * 100).toFixed(1)
                    : 0;


                return `${context.label}: `
                  + `${value} records `
                  + `(${percentage}%)`;

              }

            }

          }

        }

      }

    });

}