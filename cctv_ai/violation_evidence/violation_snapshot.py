import cv2
from pathlib import Path
from datetime import datetime

SNAPSHOT_FOLDER = (
  Path(__file__).parent / "snapshots"
)

SNAPSHOT_FOLDER.mkdir(
  parents=True,
  exist_ok=True
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

  return {
    "success": True,
    "filename": filename,
    "filepath": str(filepath),
    "captured_at": timestamp.strftime(
        "%Y-%m-%d %H:%M:%S"
    )
  }