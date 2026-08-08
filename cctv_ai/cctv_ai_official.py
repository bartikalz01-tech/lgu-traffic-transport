import os
import threading
from ultralytics import YOLO
from pathlib import Path
from .filter_vehicles import filter_vehicles
from .vehicle_counter import (update_vehicle_counter, report_vehicle_count)
from .calculate_speed import calculate_speed
from .traffic_congestion import calculate_congestion
from ai_storage.get_road_id import get_road_id
from ai_storage.update_traffic_status import update_traffic_status
from .draw_tracking import draw_tracking
from flask import Flask, Response
from flask_cors import CORS
import cv2
import time

shared_frames = {}
frame_lock = threading.Lock()

FRAME_SKIP = 1

app = Flask(__name__)
CORS(app)

shared_statistics = {}
stats_lock = threading.Lock()

VIDEO_FOLDER = Path(__file__).parent / "cctv_feeds"

SNAPSHOT_FOLDER = Path(__file__).parent / "accident_snapshots"
SNAPSHOT_FOLDER.mkdir(parents=True, exist_ok=True)

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

  for _ in range(FRAME_SKIP):
    capture.grab()

  success, frame = capture.read()

  if not success:
    capture.set(cv2.CAP_PROP_POS_MSEC, 7000)

    success, frame = capture.read()

  return frame


def generate(camera_name):

  while True:

    with frame_lock:
      frame = shared_frames.get(camera_name)

    if frame is None:
      time.sleep(0.01)
      continue

    frame = frame.copy()

    success, buffer = cv2.imencode(".jpg", frame)

    if not success:
      continue

    yield(
      b"--frame\r\n"
      b"Content-Type: image/jpeg\r\n\r\n"
      + buffer.tobytes()
      + b"\r\n"
    )

    time.sleep(1 / 30)

@app.route("/video/<camera_name>")
def video(camera_name):

  return Response(
    generate(camera_name),
    mimetype="multipart/x-mixed-replace; boundary=frame"
  )


@app.route("/snapshot/<camera_name>", methods=["POST"])
def snapshot(camera_name):

  with frame_lock:
    frame = shared_frames.get(camera_name)

    if frame is None:
      return {
        "success": False,
        "message": "No current frame available for this camera."
      }, 404

    frame = frame.copy()

  timestamp = time.strftime("%Y%m%d_%H%M%S")

  filename = f"{Path(camera_name).stem}_{timestamp}.jpg"

  filepath = SNAPSHOT_FOLDER / filename

  success = cv2.imwrite(str(filepath), frame)

  if not success:
    return {
      "success": False,
      "message": "Failed to save snapshot"
    }, 500

  captured_at = time.strftime("%Y-%m-%d %H:%M:%S")

  return {
    "success": True,
    "filename": filename,
    "captured_at": captured_at
  }


@app.route("/accident_snapshot/<filename>")
def accident_snapshot(filename):
   
  filepath = SNAPSHOT_FOLDER / filename

  if not filepath.exists():
    return {
      "success": False,
      "message": "Snapshot not found"
    }, 404

  return Response(
    filepath.read_bytes(),
    mimetype="image/jpeg"
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

    if frame_counter % 2 == 0:

      results = model.track(frame, persist=True, tracker="bytetrack.yaml", verbose=False)

      vehicles = filter_vehicles(results)
      calculate_speed(vehicles, stream["name"], fps=stream["fps"])
      update_vehicle_counter(vehicles, stream["name"])

      last_vehicles = vehicles

    if last_vehicles:
      frame = draw_tracking(frame, last_vehicles)

    #cv2.imshow(stream["name"], frame)
    with frame_lock:
      shared_frames[stream["name"]] = frame

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

  print("Traffic AI server running...")
  threading.Event().wait()
  
  

if __name__ == "__main__":
  main()