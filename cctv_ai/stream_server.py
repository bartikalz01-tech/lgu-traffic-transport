from flask import Flask, Response
import cv2
from cctv_ai.cctv_ai_official import shared_frames, frame_lock

app = Flask(__name__)

def generate(camera_name):

  while True:
    with frame_lock:
      print("Current keys:", list(shared_frames.keys()))

      frame = shared_frames.get(camera_name)

      if frame is None:
        print("No frame for:", camera_name)
        continue

      success, buffer = cv2.imencode(".jpg", frame)

      if not success:
        continue

      yield (
        b"--frame\r\n"
        b"Content-Type: image/jpeg\r\n\r\n"
        + buffer.tobytes()
        + b"\r\n"
      )



@app.route("/video/<camera_name>")
def video(camera_name):

  return Response(
    generate(camera_name),
    mimetype="multipart/x-mixed-replace; boundary=frame"
  )


if __name__ == "__main__":

  app.run(
    host="0.0.0.0",
    port=5001,
    threaded=True
  )