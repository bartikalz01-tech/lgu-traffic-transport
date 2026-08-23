from pathlib import Path
from cloudinary import uploader
from cloudinary_config import CLOUDINARY_CLOUD_NAME

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