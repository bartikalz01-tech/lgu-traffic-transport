
export async function setScheduleDiversionRoute(container) {
  
  container.innerHTML = `
    <button class="exit-diversion-schedule js-exit-schedule">
      <i class="fas fa-times"></i>
    </button>

    <div class="diversion-schedule-container">
      <div class="schedule-header">
        <i class="fas fa-calendar-alt"></i>
        <div>
          <h3>Schedule Activation</h3>
          <p>Set the operational window for this diversion.</p>
        </div>
      </div>

      <div class="schedule-body">
        <div class="date-input-group">
          <label for="startDate"><i class="fas fa-play"></i> Start Date and Time</label>
          <input type="datetime-local" id="startDate" class="schedule-input">
        </div>

        <div class="date-input-group">
          <label for="endDate"><i class="fas fa-stop"></i> End Date and Time</label>
          <input type="datetime-local" id="endDate" class="schedule-input">
        </div>

        <div class="schedule-notice">
          <i class="fas fa-info-circle"></i>
          <p>Once activated, the diversion will be visible to routing system during this period.</p>
        </div>
      </div>

      <div class="schedule-footer">
        <button class="btn btn-danger js-exit-schedule">Cancel</button>
        <button class="btn btn-primary" id="confirmDiversionRoute">Confirm Activation</button>
      </div>
    </div>
  `;

  const confirmBtn = container.querySelector("#confirmDiversionRoute");

  confirmBtn.addEventListener("click", async () => {

    const overlay = document.getElementById("scheduleOverlay");

    const diversionId = overlay.dataset.diversionId;
    const start = document.getElementById("startDate").value;
    const end = document.getElementById("endDate").value;

    if(!start || !end) {
      alert("Please select start and end date");
      return;
    }

    const payload = {
      diversion_id: diversionId,
      start_datetime: start,
      end_datetime: end
    };

    try {
      const response = await fetch("/lgu-traffic-transport/api/save_diversion_schedule.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if(result.status === "success") {
        alert("Schedule saved!");

        overlay.classList.add("schedule-hidden");
        overlay.innerHTML = "";
      } else {
        alert("Failed to save schedule");
      }
    } catch(error) {
      console.error("Error saving schedule:", error);
    }
  });
}