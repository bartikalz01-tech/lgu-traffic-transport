import os
import threading
from ultralytics import YOLO
from pathlib import Path
from .filter_vehicles import filter_vehicles
from .vehicle_counter import (update_vehicle_counter, report_vehicle_count)
#from detect_vehicles import detect_vehicles
from .calculate_speed import calculate_speed
from .traffic_congestion import calculate_congestion
from ai_storage.get_road_id import get_road_id
from ai_storage.update_traffic_status import update_traffic_status
#from draw_tracking import draw_tracking
from flask import Flask, Response
import cv2
import time

shared_frames = {}
frame_lock = threading.Lock()

app = Flask(__name__)

shared_statistics = {}
stats_lock = threading.Lock()

VIDEO_FOLDER = Path(__file__).parent / "cctv_feeds"
#VIDEO_FOLDER = Path(r"C:\xampp\htdocs\cctv_feeds")

MODEL_NAME = "yolov8s.pt"

REPORT_INTERVAL = 15

VIDEO_EXTENSIONS = (
  "*.mp4",
  "*.avi",
  "*.mov"
)

# Responsible for loading YOLO
def load_model():
  #print("Loading YOLO model...")

  model = YOLO(MODEL_NAME)

  #print("YOLO model loaded successfully.")

  return model

# Responsible for finding CCTV videos
def load_videos():
  videos = []

  for extensions in VIDEO_EXTENSIONS:
    videos.extend(VIDEO_FOLDER.glob(extensions))

  videos = sorted(videos)

  #print(f"Found {len(videos)} CCTV Videos.")

  return videos


# Open all cctv videos
def open_video_streams(videos):
  streams = []

  for video in videos:
    capture = cv2.VideoCapture(str(video)) # Gives tool to each cctv video

    if not capture.isOpened():
      print(f"Unable to open {video.name}")
      continue

    fps = capture.get(cv2.CAP_PROP_FPS)

    capture.set(cv2.CAP_PROP_POS_MSEC, 7000)

    streams.append({
      "name": video.name,
      "capture": capture,
      "fps": fps
    })

    #print(f"Opened {video.name} ({fps:2f} fps)")

  return streams


#Read one frame from each CCTV
def read_frame(stream):
  capture = stream["capture"]

  success, frame = capture.read()

  if not success:
    capture.set(cv2.CAP_PROP_POS_FRAMES, 7000)

    success, frame = capture.read()

  return frame


def generate(camera_name):

  while True:

    with frame_lock:
      frame = shared_frames.get(camera_name)

    if frame is None:
      time.sleep(0.01)
      continue

    success, buffer = cv2.imencode(".jpg", frame)

    if not success:
      continue

    yield(
      b"--frame\r\n"
      b"Content-Type: image/jpeg\r\n\r\n"
      + buffer.tobytes()
      + b"\r\n"
    )

@app.route("/video/<camera_name>")
def video(camera_name):

  return Response(
    generate(camera_name),
    mimetype="multipart/x-mixed-replace; boundary=frame"
  )


def process_camera(stream):

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

    if frame_counter % 3 == 0:

      results = model.track(frame, persist=True, tracker="bytetrack.yaml", verbose=False)

      vehicles = filter_vehicles(results)
      calculate_speed(vehicles, stream["name"], fps=stream["fps"])
      update_vehicle_counter(vehicles, stream["name"])

      last_vehicles = vehicles

    #frame = draw_tracking(frame, last_vehicles)

    #cv2.imshow(stream["name"], frame)
    with frame_lock:
      shared_frames[stream["name"]] = frame.copy()

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


def main():
  #model = load_model()

  videos = load_videos()

  streams = open_video_streams(videos)

  flask_thread = threading.Thread(
    target=lambda: app.run(
      host="0.0.0.0",
      port=5001,
      threaded=True,
      use_reloader=False
    ),
    daemon=True
  )

  flask_thread.start()

  threads = []

  for stream in streams:

    thread = threading.Thread(target=process_camera, args=(stream,), daemon=True)

    thread.start()

    threads.append(thread)

  dashboard_timer = time.time()
  
  while True:

    with frame_lock:
      frames = shared_frames.copy()

      for camera_name, frame in frames.items():

        cv2.imshow(camera_name, frame)

        if time.time() - dashboard_timer >= REPORT_INTERVAL:
          print("=" * 80)
          print("TRAFFIC AI MONITOR ".center(80))
          print("=" * 80)

          with stats_lock:

            for camera, stats in shared_statistics.items():
              print(f"\nCamera : {camera}")

              print("-" * 80)

              print(f"Vehicle Count: {stats['vehicle_count']}")

              print(f"Equivalent Flow:  {stats['vehicle_per_minute']:.0f} veh/min")

              print(f"Average Speed : {stats['average_speed']:.2f} km/h")

              print(f"Congestion Score : {stats['congestion_score']:.1f}/100")

              print(f"Congestion Level : {stats['congestion']}")

              print(f"Video FPS     : {stats['fps']}")

          print("\n" + "=" * 80)

          dashboard_timer = time.time()

    if cv2.waitKey(1) & 0xFF == ord("q"):
      break

  cv2.destroyAllWindows()
  

if __name__ == "__main__":
  main()