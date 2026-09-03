import cv2
import threading
from pathlib import Path
from datetime import datetime, timedelta
from .cloudinary_uploader import (
  upload_video_background,
  get_cloudinary_recordings,
  get_cloudinary_segment_info,
  download_cloudinary_video
)

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

      try:
        upload_video_background(
          file_path=finished_file,
          cloudinary_folder=CLOUDINARY_RECORDING_FOLDER,
          overwrite=False,
          delete_after_upload=True
        )

      except Exception as error:
        pass

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

      except (ValueError, FileNotFoundError):
        pass

  def close(self):

    if self.writer is not None:

      self.writer.release()

      self.writer = None



def initialize_camera(camera_name, fps):

  with recording_lock:

    if camera_name not in camera_recorders:

      camera_recorders[camera_name] = CameraRecorder(
        camera_name, fps
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

  camera_stem = Path(camera_name).stem

  # =====================================================
  # 1. CHECK LOCAL SEGMENTS
  # =====================================================

  local_files = sorted(
    RECORDING_FOLDER.glob(
      f"{camera_stem}_*.mp4"
    )
  )

  local_segments = []

  for filepath in local_files:

    try:

      filename_time = (
        filepath.stem.replace(
          f"{camera_stem}_",
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

      local_segments.append({
        "segment_start": segment_start,
        "segment_end": segment_end,
        "source": "local"
      })

    except ValueError:

      continue


  # =====================================================
  # 2. CHECK CLOUDINARY SEGMENTS
  # =====================================================

  cloudinary_segments = []

  try:

    resources = get_cloudinary_recordings(
      CLOUDINARY_RECORDING_FOLDER,
      camera_name
    )

    for resource in resources:

      info = get_cloudinary_segment_info(
        resource,
        camera_name
      )

      if not info:
        continue

      cloudinary_segments.append({
        "segment_start":
          info["segment_start"],

        "segment_end":
          info["segment_end"],

        "source":
          "cloudinary"
      })

  except Exception as error:

    pass


  # =====================================================
  # 3. COMBINE LOCAL + CLOUDINARY
  # =====================================================

  all_segments = (
    local_segments +
    cloudinary_segments
  )


  # Remove duplicate segment timestamps.
  # Prefer local copy if it still exists.
  unique_segments = {}

  for segment in all_segments:

    segment_start = segment["segment_start"]

    if segment_start not in unique_segments:

      unique_segments[
        segment_start
      ] = segment

    elif (
      unique_segments[
        segment_start
      ]["source"] == "cloudinary"
      and
      segment["source"] == "local"
    ):

      unique_segments[
        segment_start
      ] = segment


  all_segments = list(
    unique_segments.values()
  )


  # =====================================================
  # 4. NO FOOTAGE
  # =====================================================

  if not all_segments:

    return {
      "success": False,
      "message": "No historical footage available."
    }


  # =====================================================
  # 5. SORT BY TIME
  # =====================================================

  all_segments.sort(
    key=lambda segment:
      segment["segment_start"]
  )


  first_segment = all_segments[0]
  last_segment = all_segments[-1]


  # =====================================================
  # 6. BUFFER RANGE
  # =====================================================

  return {

    "success":
      True,

    "camera":
      camera_name,

    "segments":
      len(all_segments),

    "local_segments":
      len([
        segment
        for segment in all_segments
        if segment["source"] == "local"
      ]),

    "cloudinary_segments":
      len([
        segment
        for segment in all_segments
        if segment["source"] == "cloudinary"
      ]),

    "from":
      first_segment[
        "segment_start"
      ].strftime(
        "%Y-%m-%d %H:%M:%S"
      ),

    "to":
      last_segment[
        "segment_end"
      ].strftime(
        "%Y-%m-%d %H:%M:%S"
      )
  }


def create_historical_recording(
    camera_name,
    from_time,
    to_time
):

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


  # =====================================================
  # 1. SEARCH LOCAL RECORDING SEGMENTS
  # =====================================================

  local_files = sorted(
      RECORDING_FOLDER.glob(
          f"{camera_prefix}*.mp4"
      )
  )


  available_segments = []


  for filepath in local_files:

      try:

          filename_time = filepath.stem.replace(
              camera_prefix,
              ""
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

              available_segments.append({
                  "segment_start":
                      segment_start,

                  "segment_end":
                      segment_end,

                  "filepath":
                      filepath,

                  "source":
                      "local"
              })

      except ValueError:

          continue


  # =====================================================
  # 2. SEARCH CLOUDINARY FOR MISSING SEGMENTS
  # =====================================================

  try:

    cloudinary_resources = (
        get_cloudinary_recordings(
            CLOUDINARY_RECORDING_FOLDER,
            camera_name
        )
    )

  except Exception as error:
      cloudinary_resources = []


  existing_times = {
      segment["segment_start"]
      for segment in available_segments
  }


  cloudinary_segments = []


  for resource in cloudinary_resources:

      info = get_cloudinary_segment_info(
          resource,
          camera_name
      )

      if not info:
          continue


      segment_start = info["segment_start"]

      segment_end = info["segment_end"]


      if (
          segment_end >= from_time
          and
          segment_start <= to_time
      ):

          # Local copy takes priority.
          if segment_start in existing_times:
              continue


          cloudinary_segments.append({
              "segment_start":
                  segment_start,

              "segment_end":
                  segment_end,

              "secure_url":
                  info["secure_url"],

              "public_id":
                  info["public_id"],

              "filename":
                  info["filename"],

              "source":
                  "cloudinary"
          })


  # =====================================================
  # 3. COMBINE LOCAL + CLOUDINARY SOURCES
  # =====================================================

  all_segments = (
      available_segments
      +
      cloudinary_segments
  )


  all_segments.sort(
      key=lambda item:
          item["segment_start"]
  )


  if not all_segments:

      return {
          "success": False,
          "message":
              "No footage found for the "
              "requested time range."
      }


  # =====================================================
  # 4. OUTPUT FILE
  # =====================================================

  output_filename = (
      f"{Path(camera_name).stem}_"
      f"{from_time.strftime('%Y%m%d_%H%M%S')}_"
      f"to_"
      f"{to_time.strftime('%Y%m%d_%H%M%S')}.mp4"
  )


  output_path = (
      HISTORICAL_RECORDING_FOLDER
      /
      output_filename
  )


  writer = None


  # =====================================================
  # 5. TEMPORARY CLOUDINARY DOWNLOADS
  # =====================================================

  temporary_files = []


  try:

      for index, segment in enumerate(
          all_segments
      ):

          segment_file = None


          # ---------------------------------------------
          # LOCAL SEGMENT
          # ---------------------------------------------

          if segment["source"] == "local":

              segment_file = (
                  segment["filepath"]
              )


          # ---------------------------------------------
          # CLOUDINARY SEGMENT
          # ---------------------------------------------

          elif (
              segment["source"]
              ==
              "cloudinary"
          ):

              temporary_filename = (
                  f"cloud_segment_"
                  f"{index}.mp4"
              )

              temporary_path = (
                  HISTORICAL_RECORDING_FOLDER
                  /
                  temporary_filename
              )


              try:

                  segment_file = (
                      download_cloudinary_video(
                          segment["secure_url"],
                          temporary_path
                      )
                  )

                  temporary_files.append(
                      segment_file
                  )

              except Exception as error:

                  continue


          if (
              segment_file is None
              or
              not Path(segment_file).exists()
          ):
              continue


          # =================================================
          # OPEN SEGMENT
          # =================================================

          capture = cv2.VideoCapture(
              str(segment_file)
          )


          if not capture.isOpened():

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


          # =================================================
          # CREATE OUTPUT
          # =================================================

          if writer is None:

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


          # =================================================
          # COPY FRAMES
          # =================================================

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


      # =====================================================
      # DELETE TEMPORARY CLOUDINARY DOWNLOADS
      # =====================================================

      for temporary_file in temporary_files:

          try:

              if temporary_file.exists():

                  temporary_file.unlink()

          except Exception as error:
                  pass


  # =====================================================
  # 6. VERIFY OUTPUT
  # =====================================================

  if not output_path.exists():

      return {
          "success": False,
          "message":
              "Historical recording was "
              "not created."
      }


  duration_seconds = int(
      (
          to_time
          -
          from_time
      ).total_seconds()
  )


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

    "duration_seconds":
        duration_seconds,

    "segments_used":
        len(all_segments)

  }