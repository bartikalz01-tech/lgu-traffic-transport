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
from .cctv_clock import get_cctv_timestamp
from .cctv_recording_v2 import (initialize_camera, add_frame, create_historical_recording, get_buffer_status)
from .violation_evidence.violation_snapshot import (create_violation_snapshot)
from .accident_evidence.accident_snapshot import (create_accident_snapshots)
from flask import Flask, Response, request, send_file
from flask_cors import CORS
from datetime import datetime, timedelta
import cv2
import time

shared_frames = {}

frame_lock = threading.Lock()

ai_frames = {}

ai_frame_locks = {}

AI_FRAME_SKIP = 2

FRAME_SKIP = 1

app = Flask(__name__)
CORS(app)

shared_statistics = {}
stats_lock = threading.Lock()

VIDEO_FOLDER = Path(__file__).parent / "cctv_feeds"

MODEL_NAME = "yolov8s.pt"

REPORT_INTERVAL = 15

streams = []

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

    initialize_camera(video.name, fps)

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


@app.route("/accident_evidence/snapshots/<camera_name>", methods=["POST"])
def accident_snapshot(camera_name):
   
  with frame_lock:
    frame = shared_frames.get(camera_name)

    if frame is None:
      return {
        "success": False,
        "message": "No Current frame available for this camera."
      }, 404

    frame = frame.copy()

  result = create_accident_snapshots(camera_name, frame)

  if not result["success"]:
    return result, 500

  return result



@app.route("/accident_evidence/snapshots/file/<filename>", methods=["GET"])
def get_accident_snapshot(filename):
  filepath = (Path(__file__).parent / "accident_evidence" / "snapshots" / filename)

  if not filepath.exists():
    return {
      "success": False,
      "message": "Accident Snapshot not found"
    }, 404

  return send_file(
    filepath,
    mimetype="image/jpeg"
  )

@app.route("/accident_evidence/recording/<camera_name>", methods=["POST"])
def accident_recording(camera_name):
  try:
    cctv_timestamp = get_cctv_timestamp()

    to_datetime = datetime.strptime(cctv_timestamp, "%Y-%m-%d %H:%M:%S")

    from_datetime = to_datetime - timedelta(minutes=2)

    print(f"[ACCIDENT] Preparing recording for ")
    print(f"{camera_name}")

    print(f"[ACCIDENT] From: ")
    print(f"{from_datetime}")

    print(f"[ACCIDENT] To: ")
    print(f"{to_datetime}")

    results = create_historical_recording(camera_name=camera_name, from_time=from_datetime, to_time=to_datetime)

    if not results:
      return results, 404

    return {
      "success": True,
      "filename": results["filename"],
      "filepath": results["filepath"],
      "camera": camera_name,
      "from_time": from_datetime.strftime("%Y-%m-%d %H:%M:%S"),
      "to_time": to_datetime.strftime("%Y-%m-%d %H:%M:%S"),
      "segment_used": results.get("segments_used", 0)
    }

  except Exception as error:

    print(f"[ACCIDENT] Recording error: {error}")

    return {
      "success": False,
      "message": "Unable to create accident recording"
    }, 500



@app.route("/violation_evidence/snapshots/<camera_name>", methods=["POST"])
def violation_snapshot(camera_name):

  with frame_lock:
    frame = shared_frames.get(camera_name)

    if frame is None:
      return {
        "success": False,
        "message": "No current frame available for this camera."
      }, 404

    frame = frame.copy()

  result = create_violation_snapshot(camera_name, frame)

  if not result["success"]:
    return result, 500

  return result


@app.route("/violation_evidence/snapshots/file/<filename>", methods=["GET"])
def get_violation_snapshot(filename):

  filepath = (Path(__file__).parent / "violation_evidence" / "snapshots"/ filename)

  if not filepath.exists():
    return {
      "success": False,
      "message": "Violation snapshot not found"
    }, 404

  return send_file(
    filepath,
    mimetype="image/jpeg"
  )



@app.route("/recording/file/<filename>")
def historical_recording(filename):
  filepath = Path(__file__).parent / "cctv_historical_records" / filename

  if not filepath.exists():
    return {
      "success": False,
      "message": "Historical recording not found."
    }, 404

  return send_file(
    filepath,
    mimetype="video/mp4",
    as_attachment=False
  )


@app.route("/recording/request/<camera_name>", methods=["POST"])
def request_historical_recording(camera_name):

  data = request.get_json()

  if not data:
    return {
      "success": False,
      "message": "Request body is required"
    }, 400

  from_time = data.get("from_time")
  to_time = data.get("to_time")

  if not from_time or not to_time:
    return {
      "success": False,
      "message": "from_time and to_time are required."
    }, 400

  try:
    from_datetime = datetime.strptime(from_time, "%Y-%m-%d %H:%M:%S")
    to_datetime = datetime.strptime(to_time, "%Y-%m-%d %H:%M:%S")

  except ValueError:

    return {
      "success": False,
      "message": (
        "The end time must be later ",
        "than the start time."
      )
    }, 400

  result = create_historical_recording(camera_name=camera_name, from_time=from_datetime, to_time=to_datetime)

  if not result["success"]:
    return result, 404

  return result


@app.route("/recording/buffer/<camera_name>", methods=["GET"])
def recording_buffer_status(camera_name):

  return get_buffer_status(camera_name)


def capture_camera(stream):

  camera_name = stream["name"]
  capture = stream["capture"]
  fps = stream["fps"]

  print(
    f"[CAPTURE] Started {camera_name} "
    f"at {fps:.2f} FPS"
  )

  initialize_camera(camera_name, fps)

  while True:

    success, frame = capture.read()

    if not success:
      print(
        f"[CAPTURE] Reached end of "
        f"{camera_name}, restarting..."
      )

      capture.set(cv2.CAP_PROP_POS_MSEC, 7000)

      continue

    cctv_timestamp = get_cctv_timestamp()

    frame_timestamp = datetime.strptime(cctv_timestamp, "%Y-%m-%d %H:%M:%S")

    recording_frame = frame.copy()

    cv2.putText(
      recording_frame,
      cctv_timestamp,
      (20, 40),
      cv2.FONT_HERSHEY_SIMPLEX,
      0.8,
      (0, 255, 0),
      2,
      cv2.LINE_AA
    )

    add_frame(
      camera_name,
      recording_frame,
      frame_timestamp
    )

    if camera_name not in ai_frame_locks:

      ai_frame_locks[camera_name] = (
        threading.Lock()
      )

    with ai_frame_locks[camera_name]:

      ai_frames[camera_name] = frame.copy()


def process_camera(stream):

  camera_name = stream["name"]
  fps = stream["fps"]

  model = load_model()

  report_start = time.time()

  frame_counter = 0

  last_vehicles = []

  road_id = get_road_id(camera_name)

  print(
    f"[AI] Started processing"
    f"{camera_name}"
  )

  while True:

    if camera_name not in ai_frame_locks:
      time.sleep(0.01)
      continue

    with ai_frame_locks[camera_name]:
      frame = ai_frames.get(camera_name)

      if frame is not None:
        frame = frame.copy()

    if frame is None:
      time.sleep(0.01)
      continue

    frame_counter += 1

    if frame_counter % AI_FRAME_SKIP == 0:
      results = model.track(
        frame,
        persist=True,
        tracker="bytetrack.yaml",
        verbose=False
      )

      vehicles = filter_vehicles(results)

      calculate_speed(
        vehicles,
        camera_name,
        fps=fps
      )

      update_vehicle_counter(
        vehicles,
        camera_name
      )

      last_vehicles = vehicles

    if last_vehicles:
      frame = draw_tracking(frame, last_vehicles)

    cctv_timestamp = (
      get_cctv_timestamp()
    )

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

    with frame_lock:
      shared_frames[
        camera_name
      ] = frame

    if(time.time() - report_start >= REPORT_INTERVAL):
      vehicle_count = (
        report_vehicle_count(camera_name)
      )

      vehicle_per_minute = (vehicle_count * (60 / REPORT_INTERVAL))

      average_speed = (
        calculate_speed(
          None,
          camera_name,
          fps=fps,
          report=True
        )
      )

      (
        congestion_score,
        congestion
      ) = calculate_congestion(
        vehicle_per_minute,
        average_speed
      )

      with stats_lock:

        shared_statistics[camera_name] = {
          "vehicle_count": vehicle_count,
          "vehicle_per_minute": vehicle_per_minute,
          "average_speed": average_speed,
          "congestion_score": congestion_score,
          "congestion": congestion,
          "fps": int(fps)
        }

        update_traffic_status(
          road_id=road_id,
          vehicle_flow=vehicle_per_minute,
          average_speed=average_speed,
          traffic_level=congestion
        )

      report_start = time.time()


def main():
  #model = load_model()

  global streams

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

    capture_thread = threading.Thread(target=capture_camera, args=(stream,), daemon=True)

    capture_thread.start()

    threads.append(capture_thread)

    ai_thread = threading.Thread(target=process_camera, args=(stream,), daemon=True)

    ai_thread.start()

    threads.append(ai_thread)

  print("Traffic AI server running...")
  threading.Event().wait()
  
  

if __name__ == "__main__":
  main()