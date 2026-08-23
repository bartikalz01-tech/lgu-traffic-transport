from pathlib import Path

from cctv_ai.cloudinary_uploader import upload_video

CCTV_RECORDING_FOLDER = (
  Path(__file__).resolve().parent
  / "cctv_recording"
)

CLOUDINARY_FOLDER = (
  "alertara_test/cctv/recordings"
)

VIDEO_EXTENSIONS = (
  "*.mp4",
  "*.avi",
  "*.mov"
)

def main():

  recordings = []

  for extension in VIDEO_EXTENSIONS:
    recordings.extend(
      CCTV_RECORDING_FOLDER.glob(extension)
    )

  recordings = sorted(recordings)

  if not recordings:
    print(
      "[CLOUDINARY] No CCTV recording "
      "segment found."
    )
    return

  print(
    f"[CLOUDINARY] FOUND"
    f"{len(recordings)} CCTV recording segments."
  )

  for recording in recordings:

    try:
      result = upload_video(file_path=recording, cloudinary_folder=CLOUDINARY_FOLDER, overwrite=False) 

      print(
        f"[CLOUDINARYH] Upload: "
        f"{result['filename']}"
      )

      print(
        f"[CLOUDINARY] URL "
        f"{result['secure_url']}"
      )

    except Exception as error:

      print(
        f"[CLOUDINARY] Failed: "
        f"{recording.name}"
      )

      print(error)

if __name__ == "__main__":
  main()