import cv2
import threading
from pathlib import Path
from datetime import datetime, timedelta
from collections import deque

RECORDING_FOLDER = Path(__file__).parent / "cctv_recording"
RECORDING_FOLDER.mkdir(parents=True, exist_ok=True)

BUFFER_SECONDS = 10 * 60

recording_lock = threading.Lock()

frame_buffers = {}
camera_fps = {}

def initialize_camera(camera_name, fps):
  """
  Initialize the historical frame buffer for a camera.
  """

  with recording_lock:

    if camera_name not in frame_buffers:
      frame_buffers[camera_name] = deque()

    camera_fps[camera_name] = fps if fps > 0 else 30


def add_frame(camera_name, frame, timestamp):
  """
  Add a processed CCTV frame to the rolling historical buffer.

  timestamp must be a datetime object.
  """

  with recording_lock:

    if camera_name not in frame_buffers:
      frame_buffers[camera_name] = deque()

    buffer = frame_buffers[camera_name]

    buffer.append({
      "timestamp": timestamp,
      "frame": frame.copy()
    })

    cutoff = timestamp - timedelta(seconds=BUFFER_SECONDS)

    while buffer and buffer[0]["timestamp"] < cutoff:
      buffer.popleft()


def get_buffer_status(camera_name):

  with recording_lock:

    buffer = frame_buffers.get(camera_name)

    if not buffer:
      return {
        "success": False,
        "messaeg": "No historical footage available."
      }

    return {
      "success": True,
      "camera": camera_name,
      "from": buffer[0]["timestamp"].strftime("%Y-%m-%d %H:%M:%S"),
      "to": buffer[-1]["timestamp"].strftime("%Y-%m-%d %H:%M:%S"),
      "frames": len(buffer)
    }



def create_historical_recording(camera_name, from_time, to_time):
  """
  Create an MP4 from previously buffered CCTV frames.

  from_time and to_time must be datetime objects.
  """

  with recording_lock:

    buffer = frame_buffers.get(camera_name)

    if not buffer:
      return {
        "success": False,
        "message": "No historical footage available."
      }

    selected_frames = [
      item
      for item in buffer
      if from_time <= item["timestamp"] <= to_time
    ]

    if not selected_frames:
      return {
        "success": False,
        "message": ("No footage found for the requested time range.")
      }

    first_frame = selected_frames[0]["frame"]

    height, width = first_frame.shape[:2]

    fps = camera_fps.get(camera_name, 30)

    safe_camera_name = Path(camera_name).stem

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    filename = (
      f"{safe_camera_name}_"
      f"{from_time.strftime('%Y%m%d_%H%M%S')}_"
      f"to_"
      f"{to_time.strftime('%Y%m%d_%H%M%S')}.mp4"
    )

    filepath = RECORDING_FOLDER / filename

    fourcc = cv2.VideoWriter_fourcc(*"mp4v")

    writer = cv2.VideoWriter(
      str(filepath),
      fourcc,
      fps,
      (width, height)
    )

    if not writer.isOpened():

      return {
        "success": False,
        "message": "Failed to create historical recording."
      }

    try:
      for item in selected_frames:
        writer.write(item["frame"])

    finally:
      writer.release()
      
    return {
      "success": True,
      "filename": filename,
      "filepath": str(filepath),
      "camera": camera_name,
      "from_time": from_time.strftime("%Y-%m-%d %H:%M:%S"),
      "to_time": to_time.strftime("%Y-%m-%d %H:%M:%S"),
      "frames": len(selected_frames)
    }