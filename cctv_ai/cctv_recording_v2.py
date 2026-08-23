import cv2
import threading
from pathlib import Path
from datetime import datetime, timedelta
from .cloudinary_uploader import upload_video_background

RECORDING_FOLDER = Path(__file__).parent / "cctv_recording"
RECORDING_FOLDER.mkdir(parents=True, exist_ok=True)

HISTORICAL_RECORDING_FOLDER = (Path(__file__).parent / "cctv_historical_records")
HISTORICAL_RECORDING_FOLDER.mkdir(parents=True, exist_ok=True)

CLOUDINARY_RECORDING_FOLDER = ("alertara_test/cctv/recordings")

SEGMENT_SECONDS = 60

RETENTION_SECONDS = 60 * 60

recording_lock = threading.Lock()
camera_recorders = {}

class CameraRecorder:

  def __init__(self, camera_name, fps):

    self.camera_name = camera_name
    self.fps = fps if fps > 0 else 30

    self.writer = None
    self.filepath = None

    self.segment_start = None

    self.width = None
    self.height = None


  def _create_segment(self, frame, timestamp):

    height, width = frame.shape[:2]

    self.width = width
    self.height = height

    self.segment_start = timestamp

    filename = (
      f"{Path(self.camera_name).stem}_"
      f"{timestamp.strftime('%Y%m%d_%H%M%S')}.mp4"
    )

    self.filepath = RECORDING_FOLDER / filename

    fourcc = cv2.VideoWriter_fourcc(*"mp4v")

    self.writer = cv2.VideoWriter(
      str(self.filepath),
      fourcc,
      self.fps,
      (width, height)
    )

    if not self.writer.isOpened():
      self.writer = None
      self.filepath = None
      self.segment_start = None

      raise RuntimeError(
        f"Failed to create recording segment "
        f"for {self.camera_name}" 
      )

    print(
      f"[RECORDING] Started segment: "
      f"{self.filepath.name}"
      f"({self.fps:.2f} FPS)"
    )


  def write_frame(self, frame, timestamp):

    if self.writer is None:
      self._create_segment(
        frame,
        timestamp
      )

    elif (
      timestamp - self.segment_start
    ).total_seconds() >= SEGMENT_SECONDS:

      finished_file = self.filepath

      self.writer.release()

      self.writer = None

      print(
        f"[RECORDING] Finished segment: "
        f"{finished_file.name}"
      )


      try:
        upload_video_background(
          file_path=finished_file,
          cloudinary_folder=CLOUDINARY_RECORDING_FOLDER,
          overwrite=False,
          delete_after_upload=True
        )

        print(
          f"[CLOUDINARY] Upload queued: "
          f"{finished_file.name}"
        )

      except Exception as error:
        print(
          f"[CLOUDINARY] Failed to queue upload"
          f"for {finished_file.name}: {error}"
        )

      self._create_segment(
        frame, timestamp
      )

    self.writer.write(frame)

    self._cleanup_old_segments(timestamp)


  def _cleanup_old_segments(self, current_timestamp):
    cutoff = (current_timestamp - timedelta(seconds=RETENTION_SECONDS))

    camera_prefix = (
      Path(self.camera_name).stem + "_"
    )

    for filepath in RECORDING_FOLDER.glob(
      f"{camera_prefix}*.mp4"
    ):

      try:
        filename_time = filepath.stem.replace(
          camera_prefix,
          ""
        )

        segment_start = datetime.strptime(filename_time, "%Y%m%d_%H%M%S")

        if segment_start < cutoff:

          filepath.unlink()

          print(
            f"[RECORDING] Deleted old segment: "
            f"{filepath.name}"
          )

      except (ValueError, FileNotFoundError):
        pass

  def close(self):

    if self.writer is not None:

      self.writer.release()

      print(
        f"[RECORDING] Closed: "
        f"{self.filepath}"
      )

      self.writer = None



def initialize_camera(camera_name, fps):

  with recording_lock:

    if camera_name not in camera_recorders:

      camera_recorders[camera_name] = CameraRecorder(
        camera_name, fps
      )

      print(
        f"[RECORDING] Initialized "
        f"{camera_name} at {fps:.2f} FPS"
      )


def add_frame(camera_name, frame, timestamp):

  with recording_lock:

    recorder = camera_recorders.get(camera_name)

    if recorder is None:
      recorder = CameraRecorder(camera_name, 30)

      camera_recorders[camera_name] = recorder

    recorder.write_frame(
      frame,
      timestamp
    )


def get_buffer_status(camera_name):

  camera_prefix = (Path(camera_name).stem + "_")

  files = sorted(
    RECORDING_FOLDER.glob(f"{camera_prefix}*.mp4")
  )

  if not files:
    return {
      "success": False,
      "message": "No historical footage available."
    }

  def get_segment_time(filepath):

    filename_time = filepath.stem.replace(camera_prefix, "")

    return datetime.strptime(
      filename_time, "%Y%m%d_%H%M%S"
    )

  first_file = files[0]
  last_file = files[-1]

  first_time = get_segment_time(first_file)
  last_time = get_segment_time(last_file)

  last_end = (last_time + timedelta(seconds=SEGMENT_SECONDS))

  return {
    "success": True,
    "camera": camera_name,
    "from": first_time.strftime("%Y-%m-%d %H:%M:%S"),
    "to": last_end.strftime("%Y-%m-%d %H:%M:%S")
  }


def create_historical_recording(camera_name, from_time, to_time):

  if from_time >= to_time:

    return {
      "success": False,
      "message":
        "The end time must be later "
        "than the start time."
    }


  camera_prefix = (
    Path(camera_name).stem + "_"
  )


  segment_files = sorted(
    RECORDING_FOLDER.glob(
      f"{camera_prefix}*.mp4"
    )
  )


  if not segment_files:

    return {
      "success": False,
      "message":
        "No historical footage available."
    }


  selected_files = []


  for filepath in segment_files:

    try:

      filename_time = (
        filepath.stem.replace(
          camera_prefix,
          ""
        )
      )


      segment_start = datetime.strptime(
        filename_time,
        "%Y%m%d_%H%M%S"
      )


      segment_end = (
        segment_start
        + timedelta(
            seconds=SEGMENT_SECONDS
          )
      )


      if (
        segment_end >= from_time
        and
        segment_start <= to_time
      ):

        selected_files.append(
          filepath
        )


    except ValueError:

      continue


  if not selected_files:

    return {
      "success": False,
      "message":
        "No footage found for the "
        "requested time range."
    }


  output_filename = (
    f"{Path(camera_name).stem}_"
    f"{from_time.strftime('%Y%m%d_%H%M%S')}_"
    f"to_"
    f"{to_time.strftime('%Y%m%d_%H%M%S')}.mp4"
  )


  output_path = (
    HISTORICAL_RECORDING_FOLDER
    / output_filename
  )


  writer = None


  try:

    for segment_file in selected_files:

      capture = cv2.VideoCapture(
        str(segment_file)
      )


      if not capture.isOpened():

        print(
          f"[HISTORICAL] "
          f"Could not open "
          f"{segment_file}"
        )

        continue


      fps = capture.get(
        cv2.CAP_PROP_FPS
      )


      if fps <= 0:

        fps = 30


      width = int(
        capture.get(
          cv2.CAP_PROP_FRAME_WIDTH
        )
      )


      height = int(
        capture.get(
          cv2.CAP_PROP_FRAME_HEIGHT
        )
      )


      if writer is None:

        # Browser-friendly codec attempt:
        fourcc = cv2.VideoWriter_fourcc(
          *"avc1"
        )


        writer = cv2.VideoWriter(
          str(output_path),
          fourcc,
          fps,
          (width, height)
        )


        if not writer.isOpened():

          capture.release()

          return {
            "success": False,
            "message":
              "OpenCV could not create "
              "an H.264 MP4 recording. "
              "The installed OpenCV build "
              "may not contain an H.264 encoder."
          }


      while True:

        success, frame = (
          capture.read()
        )


        if not success:

          break


        writer.write(frame)


      capture.release()


  finally:

    if writer is not None:

      writer.release()


  if not output_path.exists():

    return {
      "success": False,
      "message":
        "Historical recording was "
        "not created."
    }


  return {

    "success": True,

    "filename":
      output_filename,

    "filepath":
      str(output_path),

    "camera":
      camera_name,

    "from_time":
      from_time.strftime(
        "%Y-%m-%d %H:%M:%S"
      ),

    "to_time":
      to_time.strftime(
        "%Y-%m-%d %H:%M:%S"
      ),

    "segments_used":
      len(selected_files)

  }