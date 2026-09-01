import cv2
import math
import threading
import time

from pathlib import Path
from ultralytics import YOLO


# ============================================================
# VIDEO / MODEL CONFIGURATION
# ============================================================

ACCIDENT_VIDEO = (
  Path(__file__).parent.parent
  / "cctv_feeds"
  / "cctv_sto_niño_accident.mp4"
)

MODEL_NAME = "yolov8s.pt"

# Analyze every frame
ACCIDENT_FRAME_SKIP = 1


# ============================================================
# SHARED ACCIDENT STATE
# ============================================================

accident_frame = None

accident_frame_lock = threading.Lock()

accident_status = {
  "running": False,
  "finished": False,
  "possible_accident": False,
  "sudden_deceleration": False,
  "nearby_vehicle": False,
}


# ============================================================
# VEHICLE TRACKING DATA
# ============================================================

vehicle_history = {}

vehicle_accident_confirmation = {}


# ============================================================
# DETECTION SETTINGS
# ============================================================

HISTORY_SIZE = 10

# Minimum history needed before calculating deceleration
MIN_HISTORY_SIZE = 4

# 40% reduction in movement
DECELERATION_THRESHOLD = 0.40

# Ignore extremely small movements
MIN_MOVEMENT_SPEED = 5

# Maximum pixel distance considered nearby
#NEARBY_DISTANCE_THRESHOLD = 120

VERY_CLOSE_DISTANCE_THRESHOLD = 50

RAPID_DISTANCE_REDUCTION = 15

# Number of consecutive qualifying frames required
ACCIDENT_CONFIRMATION_FRAMES = 5


# ============================================================
# GET CENTER OF VEHICLE
# ============================================================

def get_center(x1, y1, x2, y2):

  center_x = (x1 + x2) / 2
  center_y = (y1 + y2) / 2

  return center_x, center_y


# ============================================================
# DISTANCE BETWEEN TWO POINTS
# ============================================================

def calculate_distance(point_a, point_b):

  return math.sqrt(
    (point_a[0] - point_b[0]) ** 2
    +
    (point_a[1] - point_b[1]) ** 2
  )


# ============================================================
# CALCULATE VEHICLE MOVEMENT
# ============================================================

def calculate_speed(previous_point, current_point):

  if previous_point is None:
    return 0.0

  return calculate_distance(
    previous_point,
    current_point
  )


# ============================================================
# DETECT SUDDEN DECELERATION
# ============================================================

def detect_sudden_deceleration(
  vehicle_id,
  current_speed
):

  history = vehicle_history.get(vehicle_id)

  if not history or len(history) < MIN_HISTORY_SIZE:
    return False

  previous_speed = history[-1]["speed"]

  if previous_speed <= MIN_MOVEMENT_SPEED:
    return False

  speed_change = (
    previous_speed - current_speed
  ) / previous_speed

  print(
    f"[DECELERATION] "
    f"ID: {vehicle_id} | "
    f"Previous: {previous_speed:.2f}px | "
    f"Current: {current_speed:.2f}px | "
    f"Change: {speed_change * 100:.2f}%"
  )

  if speed_change >= DECELERATION_THRESHOLD:

    print(
      f"[DECELERATION DETECTED] "
      f"ID: {vehicle_id} | "
      f"Change: {speed_change * 100:.2f}%"
    )

    return True

  return False


# ============================================================
# DETECT NEARBY VEHICLE
# ============================================================

def detect_nearby_vehicle(
  vehicle_id,
  current_point
):

  nearest_distance = None
  nearest_vehicle = None

  for other_id, history in vehicle_history.items():

    if other_id == vehicle_id:
      continue

    if not history:
      continue

    other_point = history[-1]["point"]

    distance = calculate_distance(
      current_point,
      other_point
    )

    if (
      nearest_distance is None
      or distance < nearest_distance
    ):

      nearest_distance = distance
      nearest_vehicle = other_id

  if nearest_distance is None:

    return False

  print(
    f"[NEARBY] "
    f"ID: {vehicle_id} | "
    f"Nearest Vehicle: {nearest_vehicle} | "
    f"Distance: {nearest_distance:.2f}px"
  )

  if nearest_distance <= NEARBY_DISTANCE_THRESHOLD:

    return True

  return False


# ============================================================
# CALCULATE ACCIDENT FEATURES
# ============================================================

def calculate_accident_features(
  vehicle_id,
  current_point,
  current_speed
):

  sudden_deceleration = (
    detect_sudden_deceleration(
      vehicle_id,
      current_speed
    )
  )

  nearby_vehicle = (
    detect_nearby_vehicle(
      vehicle_id,
      current_point
    )
  )

  possible_accident = (
    sudden_deceleration
    and nearby_vehicle
  )

  return {
    "sudden_deceleration":
      sudden_deceleration,

    "nearby_vehicle":
      nearby_vehicle,

    "possible_accident":
      possible_accident
  }


# ============================================================
# MAIN ACCIDENT DETECTION
# ============================================================

def process_accident_video():

  global accident_frame

  frame_counter = 0

  # ----------------------------------------------------------
  # CHECK VIDEO
  # ----------------------------------------------------------

  if not ACCIDENT_VIDEO.exists():

    print(
      "[ACCIDENT AI] "
      "Accident video not found:"
    )

    print(ACCIDENT_VIDEO)

    return


  print(
    "[ACCIDENT AI] "
    "Loading accident video..."
  )


  # ----------------------------------------------------------
  # LOAD YOLO
  # ----------------------------------------------------------

  model = YOLO(MODEL_NAME)


  # ----------------------------------------------------------
  # OPEN VIDEO
  # ----------------------------------------------------------

  capture = cv2.VideoCapture(
    str(ACCIDENT_VIDEO)
  )

  if not capture.isOpened():

    print(
      "[ACCIDENT AI] "
      "Unable to open accident video."
    )

    return


  # ----------------------------------------------------------
  # RESET STATE
  # ----------------------------------------------------------

  accident_status["running"] = True
  accident_status["finished"] = False

  accident_status["possible_accident"] = False
  accident_status["sudden_deceleration"] = False
  accident_status["nearby_vehicle"] = False

  vehicle_history.clear()
  vehicle_accident_confirmation.clear()


  print(
    "[ACCIDENT AI] "
    "Accident detection started."
  )


  # ==========================================================
  # FRAME PROCESSING LOOP
  # ==========================================================

  while True:

    success, frame = capture.read()


    # --------------------------------------------------------
    # VIDEO FINISHED
    # --------------------------------------------------------

    if not success:

      print(
        "[ACCIDENT AI] "
        "Accident video finished."
      )

      accident_status["running"] = False
      accident_status["finished"] = True

      break


    frame_counter += 1


    # ========================================================
    # ANALYZE CURRENT FRAME
    # ========================================================

    results = model.track(
      frame,
      persist=True,
      tracker="bytetrack.yaml",
      verbose=False,
      imgsz=416,
      conf=0.35
    )


    # ========================================================
    # PROCESS YOLO RESULTS
    # ========================================================

    if results is not None:

      for result in results:

        boxes = result.boxes

        if boxes is None:
          continue

        if boxes.id is None:
          continue


        track_ids = (
          boxes.id
          .int()
          .cpu()
          .tolist()
        )

        coordinates = (
          boxes.xyxy
          .cpu()
          .tolist()
        )

        classes = (
          boxes.cls
          .int()
          .cpu()
          .tolist()
        )


        # ====================================================
        # PROCESS EACH VEHICLE
        # ====================================================

        for track_id, box, class_id in zip(
          track_ids,
          coordinates,
          classes
        ):


          # --------------------------------------------------
          # VEHICLE CLASSES
          # --------------------------------------------------

          if class_id not in [2, 3, 5, 7]:
            continue


          x1, y1, x2, y2 = box


          # --------------------------------------------------
          # GET VEHICLE CENTER
          # --------------------------------------------------

          center = get_center(
            x1,
            y1,
            x2,
            y2
          )


          # --------------------------------------------------
          # CREATE VEHICLE HISTORY
          # --------------------------------------------------

          if track_id not in vehicle_history:

            vehicle_history[track_id] = []


          # --------------------------------------------------
          # CREATE CONFIRMATION COUNTER
          # --------------------------------------------------

          if (
            track_id
            not in vehicle_accident_confirmation
          ):

            vehicle_accident_confirmation[
              track_id
            ] = 0


          history = vehicle_history[track_id]


          # --------------------------------------------------
          # GET PREVIOUS POSITION
          # --------------------------------------------------

          previous_point = None

          if history:

            previous_point = (
              history[-1]["point"]
            )


          # --------------------------------------------------
          # CALCULATE CURRENT MOVEMENT
          # --------------------------------------------------

          current_speed = calculate_speed(
            previous_point,
            center
          )

          # ==================================================
          # CALCULATE ACCIDENT FEATURES
          # ==================================================

          features = calculate_accident_features(
            track_id,
            center,
            current_speed
          )


          # --------------------------------------------------
          # STORE CURRENT MOVEMENT
          # --------------------------------------------------

          history.append({

            "point": center,

            "speed": current_speed

          })


          # --------------------------------------------------
          # LIMIT HISTORY
          # --------------------------------------------------

          if len(history) > HISTORY_SIZE:

            history.pop(0)

          # ==================================================
          # DIAGNOSTIC OUTPUT
          # ==================================================

          print(
            f"[ACCIDENT CHECK] "
            f"Frame: {frame_counter} | "
            f"ID: {track_id} | "
            f"History: {len(history)} | "
            f"Speed: {current_speed:.2f} | "
            f"Sudden Deceleration: "
            f"{features['sudden_deceleration']} | "
            f"Nearby Vehicle: "
            f"{features['nearby_vehicle']} | "
            f"Possible Accident: "
            f"{features['possible_accident']}"
          )


          # ==================================================
          # UPDATE CONFIRMATION
          # ==================================================

          if features["possible_accident"]:

            vehicle_accident_confirmation[
              track_id
            ] += 1

          else:

            vehicle_accident_confirmation[
              track_id
            ] = 0


          # ==================================================
          # CONFIRMATION OUTPUT
          # ==================================================

          print(
            f"[ACCIDENT CONFIRMATION] "
            f"ID: {track_id} | "
            f"Count: "
            f"{vehicle_accident_confirmation[track_id]} / "
            f"{ACCIDENT_CONFIRMATION_FRAMES}"
          )


          # ==================================================
          # ACCIDENT CONFIRMED
          # ==================================================

          if (
            vehicle_accident_confirmation[
              track_id
            ]
            >= ACCIDENT_CONFIRMATION_FRAMES
          ):


            # ------------------------------------------------
            # SET GLOBAL STATUS
            # ------------------------------------------------

            accident_status[
              "possible_accident"
            ] = True

            accident_status[
              "sudden_deceleration"
            ] = True

            accident_status[
              "nearby_vehicle"
            ] = True


            # ------------------------------------------------
            # TERMINAL MESSAGE
            # ------------------------------------------------

            print(
              "\n"
              "========================================\n"
              "       POSSIBLE ACCIDENT DETECTED\n"
              "========================================\n"
              f"Frame: {frame_counter}\n"
              f"Vehicle ID: {track_id}\n"
              f"Confirmation: "
              f"{vehicle_accident_confirmation[track_id]}\n"
              "========================================\n"
            )


          # ==================================================
          # DRAW VEHICLE
          # ==================================================

          cv2.rectangle(
            frame,
            (
              int(x1),
              int(y1)
            ),
            (
              int(x2),
              int(y2)
            ),
            (0, 255, 0),
            2
          )


          # ==================================================
          # DRAW TRACK ID
          # ==================================================

          cv2.putText(
            frame,
            f"ID {track_id}",
            (
              int(x1),
              int(y1) - 10
            ),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (0, 255, 0),
            2
          )


    # ========================================================
    # SHOW POSSIBLE ACCIDENT
    # ========================================================

    if accident_status["possible_accident"]:

      cv2.putText(
        frame,
        "POSSIBLE ACCIDENT",
        (30, 80),
        cv2.FONT_HERSHEY_SIMPLEX,
        1.0,
        (0, 0, 255),
        3
      )


    # ========================================================
    # SAVE CURRENT FRAME
    # ========================================================

    with accident_frame_lock:

      accident_frame = frame.copy()


    # ========================================================
    # SHOW VIDEO
    # ========================================================

    cv2.imshow(
      "Accident Detection CCTV",
      frame
    )


    # ========================================================
    # PRESS Q TO STOP
    # ========================================================

    if cv2.waitKey(1) & 0xFF == ord("q"):

      print(
        "[ACCIDENT AI] "
        "Detection stopped by user."
      )

      break


    time.sleep(0.01)


  # ==========================================================
  # CLEANUP
  # ==========================================================

  capture.release()

  cv2.destroyAllWindows()

  print(
    "[ACCIDENT AI] "
    "Accident detection stopped."
  )


# ============================================================
# RUN DIRECTLY
# ============================================================

if __name__ == "__main__":

  process_accident_video()