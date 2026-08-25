from pathlib import Path
from cloudinary import uploader, api
from cloudinary_config import CLOUDINARY_CLOUD_NAME
from datetime import datetime, timedelta

import re
import shutil
import urllib.request

MAX_NORMAL_UPLOAD_BYTES = 100 * 1024 * 1024

def upload_video(file_path, cloudinary_folder, overwrite=False):

  file_path = Path(file_path)

  if not file_path.exists():
    raise FileNotFoundError(f"Video file not found: {file_path}")

  file_size = file_path.stat().st_size

  upload_options = {
    "resource_type": "video",
    "folder": cloudinary_folder,
    "public_id": file_path.stem,
    "overwrite": overwrite,
    "unique_filename": False
  }

  print(
    f"[CLOUDINARY] Uploading: "
    f"{file_path.name}"
  )

  if file_size >= MAX_NORMAL_UPLOAD_BYTES:
    print(
      "[CLOUDINARY] Large video detected. "
      "Using chunked upload."
    )

    result = uploader.upload_large(
      str(file_path),
      chunk_size=20 * 1024 * 1024,
      **upload_options
    )

  else:
    result = uploader.upload(
      str(file_path),
      **upload_options
    )

  print(
    f"[CLOUDINARY] Upload completed: "
    f"{file_path.name}"
  )

  return {
    "success": True,
    "filename": file_path.name,
    "public_id": result.get("public_id"),
    "secure_url": result.get("secure_url"),
    "resource_type": result.get("resource_type"),
    "bytes": result.get("bytes"),
    "format": result.get("format"),
    "cloud_name": CLOUDINARY_CLOUD_NAME
  }


def upload_video_background(file_path, cloudinary_folder, overwrite=False, delete_after_upload=False):

  import threading

  file_path = Path(file_path)

  def worker():

    try:

      result = upload_video(file_path=file_path, cloudinary_folder=cloudinary_folder, overwrite=overwrite)

      print(
        f"[CLOUDINARY] Upload Completed: "
        f"{file_path.name}"
      )

      if delete_after_upload:
        try:

          if file_path.exists():

            file_path.unlink()

            print(
              f"[RECORDING] Local segment "
              f"Deleted after Cloudinary upload: "
              f"{file_path.name}"
            )

        except OSError as delete_error:
          print(
            f"[RECORDING] Cloud upload succeeded, "
            f"but local deletion failed for "
            f"{file_path.name}: "
            f"{delete_error}"
          )

      return result

    except Exception as error:

      print(
        f"[CLOUDINARY] Upload failed"
        f"for {file_path}: {error}"
      )

  thread = threading.Thread(target=worker, daemon=True)

  thread.start()

  return thread


def get_cloudinary_recordings(cloudinary_folder, camera_name):

  camera_stem = Path(camera_name).stem

  prefix = (
    f"{cloudinary_folder}/"
    f"{camera_stem}_"
  )

  print(
    "[CLOUDINARY] Searching recordings "
    f"with prefix: {prefix}"
  )

  resources = []

  next_cursor = None

  while True:

    options = {
      "resource_type": "video",
      "type": "upload",
      "prefix": prefix,
      "max_results": 500
    }

    if next_cursor:
      options["next_cursor"] = next_cursor

    result = api.resources(**options)

    batch = result.get(
      "resources",
      []
    )

    resources.extend(batch)

    next_cursor = result.get(
      "next_cursor"
    )

    if not next_cursor:
      break

  print(
    "[CLOUDINARY] Found "
    f"{len(resources)} recordings "
    f"for {camera_stem}"
  )

  return resources


def get_cloudinary_segment_info(
  resource,
  camera_name
):

  camera_stem = Path(camera_name).stem

  public_id = resource.get(
    "public_id",
    ""
  )

  filename_without_folder = Path(
    public_id
  ).name

  pattern = (
    rf"^{re.escape(camera_stem)}_"
    rf"(\d{{8}}_\d{{6}})$"
  )

  match = re.match(
    pattern,
    filename_without_folder
  )

  if not match:
    print( 
      "[CLOUDINARY] Skipping unexpected " 
      f"public ID: {public_id}" 
    )

    return None

  try:
    segment_start = datetime.strptime(match.group(1), "%Y%m%d_%H%M%S")

  except ValueError:
    return None

  return {
    "public_id": public_id,
    "secure_url": resource.get("secure_url"),
    "segment_start": segment_start,
    "segment_end": segment_start + timedelta(seconds=60),
    "filename": f"{filename_without_folder}.mp4"
  }


def download_cloudinary_video(
  secure_url,
  destination
):

  destination = Path(destination)

  destination.parent.mkdir(
    parents=True,
    exist_ok=True
  )

  print(
    f"[CLOUDINARY] Downloading temporary "
    f"segment: {destination.name}"
  )

  try:
    with urllib.request.urlopen(secure_url, timeout=120) as response:

      with open(destination, "wb") as output_file:

        shutil.copyfileobj(response, output_file)

  except Exception as error:

    if destination.exists():

      try:
        destination.unlink()
      except OSError:
        pass

    raise RuntimeError(
      "Failed to download Cloudinary"
      f"video: {error}"
    ) from error

  if not destination.exists():
    raise RuntimeError(
      "Cloudinary download failed."
    )

  print(
    f"[CLOUDINARY] Temporary segment "
    f"downloaded: {destination.name}"
  )

  return destination