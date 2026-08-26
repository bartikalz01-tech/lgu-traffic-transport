import cv2
from ..cloudinary_uploader import upload_image
from pathlib import Path
from datetime import datetime

SNAPSHOT_FOLDER = (
  Path(__file__).parent / "snapshots"
)

SNAPSHOT_FOLDER.mkdir(
  parents=True,
  exist_ok=True
)

CLOUDINARY_VIOLATION_FOLDER = (
  "alertara_test/cctv/violation_snapshots"
)


def create_violation_snapshot(camera_name, frame):

  if frame is None:
    return {
      "success": False,
      "message": "No CCTV frame available."
    }

  timestamp = datetime.now()

  camera_name_only = Path(camera_name).stem

  filename = (
    f"{camera_name_only}_"
    f"{timestamp.strftime('%Y%m%d_%H%M%S')}.jpg"
  )

  filepath = SNAPSHOT_FOLDER / filename

  success = cv2.imwrite(
    str(filepath),
    frame
  )

  if not success:
    return {
      "success": False,
      "message": "Failed to save CCTV snapshot."
    }

  cloudinary_result = upload_image(
    file_path=filepath,
    cloudinary_folder=CLOUDINARY_VIOLATION_FOLDER,
    overwrite=False
  )

  return {
    "success": True,
    "filename": filename,
    "filepath": str(filepath),
    "captured_at": timestamp.strftime(
      "%Y-%m-%d %H:%M:%S"
    ),
    "cloudinary_public_id": cloudinary_result["public_id"],
    "cloudinary_url": cloudinary_result["secure_url"]
  }