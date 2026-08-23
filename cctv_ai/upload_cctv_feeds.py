from pathlib import Path

from cctv_ai.cloudinary_uploader import upload_video

CCTV_FEEDS_FOLDER = (
  Path(__file__).resolve().parent
  / "cctv_feeds"
)

CLOUDINARY_FOLDER = ("alertara_test/cctv/feeds")

VIDEO_EXTENSIONS = (
  "*.mp4",
  "*.avi",
  "*.mov"
)

def main():

  videos = []

  for extension in VIDEO_EXTENSIONS:

    videos.extend(CCTV_FEEDS_FOLDER.glob(extension))

  videos = sorted(videos)

  if not videos:
    print("[CLOUDINARY] No CCTV source videos found")

    return

  print(
    f"[CLOUDINARY] Found "
    f"{len(videos)} CCTV source videos."
  )

  for video in videos:

    try:
      result = upload_video(
        file_path=video,
        cloudinary_folder=CLOUDINARY_FOLDER,
        overwrite=False
      )

      print(
        f"[CLOUDINARY] URL: "
        f"{result['secure_url']}"
      )

    except Exception as error:

      print(
        f"[CLOUDINARY] Failed: "
        f"{video.name}"
      )

      print(error)


if __name__ == "__main__":
  main()