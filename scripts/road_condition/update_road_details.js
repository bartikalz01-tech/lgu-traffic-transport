export function updateRoadCondition(road, dom) {

  dom.currentCameraName.textContent = road.camera_name;

  dom.roadVideo.src = `http://127.0.0.1:5001/video/${road.video_filename}`;

  dom.detailCameraId.textContent = `CAM-${road.road_name}-${road.camera_name}`;

  dom.detailLocation.textContent = road.road_name;

  dom.detailTrafficLevel.textContent = road.traffic_level;

  dom.detailVehicleFlow.textContent = road.vehicle_flow;

  dom.detailAverageSpeed.textContent = `${road.avg_speed} km/h`;

  const level = road.traffic_level.toLowerCase();

  dom.detailTrafficLevel.classList.remove(
    "low",
    "moderate",
    "high"
  );

  dom.detailTrafficLevel.classList.add(level);

  const item = dom.detailTrafficLevel.closest(".prediction-item");

  item.classList.remove(
    "low",
    "moderate",
    "high"
  );

  item.classList.add(level);
}