import time
from datetime import datetime

def get_cctv_timestamp():
  """
  Returns the current real-world CCTV timestamp.
  """

  return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def get_cctv_time():
  """
  Returns only the current CCTV time.
  """

  return datetime.now().strftime("%H:%M:%S")


def get_cctv_date():
  """
  Returns only the current CCTV date.
  """

  return datetime.now().strftime("%Y-%m-%d")





##def process_camera(stream):

  model = load_model()

  report_start = time.time()

  frame_counter = 0

  last_vehicles = []

  road_id = get_road_id(stream["name"])

  while True:
    frame = read_frame(stream)

    frame_counter += 1

    if frame is None:
      continue

    if frame_counter % 2 == 0:

      results = model.track(frame, persist=True, tracker="bytetrack.yaml", verbose=False)

      vehicles = filter_vehicles(results)
      calculate_speed(vehicles, stream["name"], fps=stream["fps"])
      update_vehicle_counter(vehicles, stream["name"])

      last_vehicles = vehicles

    if last_vehicles:
      frame = draw_tracking(frame, last_vehicles)

    cctv_timestamp = get_cctv_timestamp()

    cv2.putText(
      frame,
      cctv_timestamp,
      (20, 40),
      cv2.FONT_HERSHEY_SIMPLEX,
      0.8,
      (0, 255, 0),
      2,
      cv2.LINE_AA
    )

    frame_timestamp = datetime.strptime(cctv_timestamp, "%Y-%m-%d %H:%M:%S")

    add_frame(stream["name"], frame, frame_timestamp)

    with frame_lock:
      shared_frames[stream["name"]] = frame

    #cv2.imshow(stream["name"], frame)

    if time.time() - report_start >= REPORT_INTERVAL:
      vehicle_count = report_vehicle_count(stream["name"])
      vehicle_per_minute = vehicle_count * (60 / REPORT_INTERVAL)

      average_speed = calculate_speed(None, stream["name"], fps=stream["fps"], report=True)
      congestion_score, congestion = calculate_congestion(vehicle_per_minute, average_speed)

      with stats_lock:

        shared_statistics[stream["name"]] = {
          "vehicle_count" : vehicle_count,
          "vehicle_per_minute" : vehicle_per_minute,
          "average_speed": average_speed,
          "congestion_score": congestion_score,
          "congestion": congestion,
          "fps": int(stream["fps"])
        }

        update_traffic_status(
          road_id=road_id,
          vehicle_flow=vehicle_per_minute,
          average_speed=average_speed,
          traffic_level=congestion
        )

      report_start = time.time()

    #if cv2.waitKey(1) & 0xFF == ord("q"):
      #break

  stream["capture"].release()