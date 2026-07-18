from ultralytics import YOLO
from pathlib import Path
import cv2
import time

#VIDEO_FOLDER = Path(__file__).parent / "cctv_feeds"
VIDEO_FOLDER = Path(r"C:\xampp\htdocs\cctv_feeds")

MODEL_NAME = "yolov8n.pt"

VIDEO_EXTENSIONS = (
  "*.mp4",
  "*.avi",
  "*.mov"
)

# Responsible for loading YOLO
def load_model():
  print("Loading YOLO model...")

  model = YOLO(MODEL_NAME)

  print("YOLO model loaded successfully.")

  return model

# Responsible for finding CCTV videos
def load_videos():
  videos = []

  for extensions in VIDEO_EXTENSIONS:
    videos.extend(VIDEO_FOLDER.glob(extensions))

  videos = sorted(videos)

  print(f"Found {len(videos)} CCTV Videos.")

  return videos


def process_video(model, video_path):
  print(f"\nProcessing: {video_path.name}")

  results = model.predict(
    source=str(video_path),
    stream=True,
    verbose=False
  )

  frame_count = 0

  for result in results:
    frame_count += 1

  print(f"Finished {video_path.name}")
  print(f"Frames processed: {frame_count}")


def process_all_videos(model, videos):
  for video in videos:
    process_video(model, video)


# Open all cctv videos
def open_video_streams(videos):
  streams = []

  for video in videos:
    capture = cv2.VideoCapture(str(video))

    if not capture.isOpened():
      print(f"Unable to open {video.name}")
      continue

    fps = capture.get(cv2.CAP_PROP_FPS)

    streams.append({
      "name": video.name,
      "capture": capture,
      "fps": fps
    })

    print(f"Opened {video.name} ({fps:2f} fps)")

  return streams

#Read one frame from each CCTV
def read_frame(stream):
  capture = stream["capture"]

  success, frame = capture.read()

  if not success:
    capture.set(cv2.CAP_PROP_POS_FRAMES, 0)

    success, frame = capture.read()

  return frame

# Detect Vehicles
def detect_vehicles(model, frame):
  results = model.predict(frame, verbose=False)

  vehicle_classes = {2, 3, 5, 7}

  confidence_threshold = 0.40

  vehicle_count = 0

  for result in results:

    for box in result.boxes:
      class_id = int(box.cls[0])
      confidence = float(box.conf[0])

      if confidence < confidence_threshold:
        continue

      if class_id in vehicle_classes:
        vehicle_count += 1

  print(f"Detected Vehicles: {vehicle_count}")

  return vehicle_count


# Process one CCTV 
def process_stream(model, stream):
  
  frame = None

  fps = int(stream["fps"])

  for _ in range(fps):
    frame = read_frame(stream)

  if frame is None:
    return

  vehicle_count = detect_vehicles(model, frame)

  print(f"{stream['name']} | Vehicles: {vehicle_count}")


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

    time.sleep(1)
  

if __name__ == "__main__":
  main()