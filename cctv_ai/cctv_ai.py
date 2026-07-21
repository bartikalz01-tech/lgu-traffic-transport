from ultralytics import YOLO
from pathlib import Path
from filter_vehicles import filter_vehicles
from detect_vehicles import detect_vehicles
from calculate_speed import calculate_speed
import cv2
import time

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


# Process one CCTV 
def process_stream(model, stream):

  frame = None
  results = None
  
  fps = max(1, int(stream["fps"]))

  for _ in range(fps):
    frame = read_frame(stream)

    if frame is None:
      return
    
    results = model.track(frame, persist=True, tracker="bytetrack.yaml", verbose=False)
  
  print("\n" + "=" * 60)
  print(f"CCTV: {stream['name']}")
  print("=" * 60)

  print(f"FPS           : {int(stream['fps'])}")
  print("Detection     : Every 1 second")

  vehicles = filter_vehicles(results)

  vehicle_count = detect_vehicles(vehicles)

  print(f"\nVehicle Count : {vehicle_count}")

  calculate_speed(vehicles, stream["name"])
  
  print("=" * 60)
  print(f"END of {stream['name']}")
  print("=" * 60)


def process_all_streams(model, streams):

  for stream in streams:
    process_stream(model, stream)


def main():
  model = load_model()

  videos = load_videos()

  streams = open_video_streams(videos)

  while True:
    process_all_streams(model, streams)

    print("-" * 60)

    time.sleep(0)
  

if __name__ == "__main__":
  main()