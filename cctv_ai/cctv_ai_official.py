import os
import threading
from ultralytics import YOLO
from pathlib import Path
from filter_vehicles import filter_vehicles
from vehicle_counter import (update_vehicle_counter, report_vehicle_count)
#from detect_vehicles import detect_vehicles
from calculate_speed import calculate_speed
from draw_tracking import draw_tracking
import cv2
import time

shared_frames = {}
frame_lock = threading.Lock()

shared_statistics = {}
stats_lock = threading.Lock()

VIDEO_FOLDER = Path(__file__).parent / "cctv_feeds"
#VIDEO_FOLDER = Path(r"C:\xampp\htdocs\cctv_feeds")

MODEL_NAME = "yolov8s.pt"

VIDEO_EXTENSIONS = (
  "*.mp4",
  "*.avi",
  "*.mov"
)

# Responsible for loading YOLO
def load_model():
  print("Loading YOLO model...")

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
    capture.set(cv2.CAP_PROP_POS_FRAMES, 0)

    success, frame = capture.read()

  return frame


def process_camera(stream):

  model = load_model()

  report_start = time.time()

  frame_counter = 0

  last_vehicles = []

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

    frame = draw_tracking(frame, last_vehicles)

    #cv2.imshow(stream["name"], frame)
    with frame_lock:
      shared_frames[stream["name"]] = frame.copy()

    if time.time() - report_start >= 60:
      vehicle_count = report_vehicle_count(stream["name"])
      average_speed = calculate_speed(None, stream["name"], fps=stream["fps"], report=True)

      with stats_lock:

        shared_statistics[stream["name"]] = {
          "vehicle_count": vehicle_count,
          "average_speed": average_speed,
          "fps": int(stream["fps"])
        }

      report_start = time.time()

    #if cv2.waitKey(1) & 0xFF == ord("q"):
      #break

  stream["capture"].release()


def main():
  #model = load_model()

  videos = load_videos()

  streams = open_video_streams(videos)

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

        if time.time() - dashboard_timer >= 60:
          print("=" * 80)
          print("TRAFFIC AI MONITOR ".center(80))
          print("=" * 80)

          with stats_lock:

            for camera, stats in shared_statistics.items():
              print(f"\nCamera : {camera}")

              print("-" * 80)

              print(f"Vehicle Count: {stats['vehicle_count']}")

              print(f"Average Speed : {stats['average_speed']:.2f} px/s")

              print(f"Video FPS     : {stats['fps']}")

          print("\n" + "=" * 80)

          dashboard_timer = time.time()

    if cv2.waitKey(1) & 0xFF == ord("q"):
      break

  cv2.destroyAllWindows()
  

if __name__ == "__main__":
  main()