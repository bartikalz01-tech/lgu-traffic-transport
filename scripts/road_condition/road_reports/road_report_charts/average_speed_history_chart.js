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
     * Below 20 km/h
     * = Slow
     *
     * 20 - 39.99 km/h
     * = Moderate
     *
     * 40 km/h and above
     * = Fast
     */

    if (averageSpeed < 20) {

      slowCount++;

    } else if (averageSpeed < 40) {

      moderateCount++;

    } else {

      fastCount++;

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