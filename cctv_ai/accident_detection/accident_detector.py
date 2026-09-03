from datetime import datetime
from collections import defaultdict
import math
import threading


# ============================================================
# ACCIDENT DETECTION SETTINGS
# ============================================================

HISTORY_SIZE = 10

# Minimum history needed before calculating deceleration
MIN_HISTORY_SIZE = 4

# 40% reduction in movement
DECELERATION_THRESHOLD = 0.40

# Ignore extremely small movements
MIN_MOVEMENT_SPEED = 0.10

# Maximum pixel distance considered nearby
NEARBY_DISTANCE_THRESHOLD = 120

# Number of consecutive qualifying frames required
ACCIDENT_CONFIRMATION_FRAMES = 2


# ============================================================
# PER-CAMERA VEHICLE TRACKING DATA
# ============================================================

vehicle_history = defaultdict(dict)

vehicle_accident_confirmation = defaultdict(dict)


# ============================================================
# PER-CAMERA ACCIDENT STATE
# ============================================================

accident_states = defaultdict(lambda: {
  "possible_accident": False,
  "sudden_deceleration": False,
  "nearby_vehicle": False,
  "vehicle_id": None,
  "detected_at": None
})


# ============================================================
# THREAD LOCK
# ============================================================

accident_lock = threading.Lock()


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
# DETECT SUDDEN DECELERATION
# ============================================================

def detect_sudden_deceleration(
    camera_name,
    vehicle_id,
    current_speed
):

    history = vehicle_history[
        camera_name
    ].get(vehicle_id)

    # Not enough movement history yet
    if not history or len(history) < MIN_HISTORY_SIZE:
        return False

    # Previous frame's movement
    previous_speed = history[-1]["speed"]

    # Vehicle was already moving too slowly.
    # Do not classify tiny movement fluctuations as sudden braking.
    if previous_speed < MIN_MOVEMENT_SPEED:
        return False

    # Calculate percentage of movement lost
    speed_change = (
        previous_speed - current_speed
    ) / previous_speed

    if speed_change >= DECELERATION_THRESHOLD:

        return True

    return False


# ============================================================
# DETECT NEARBY VEHICLE
# ============================================================

def detect_nearby_vehicle(
    camera_name,
    vehicle_id,
    current_point
):

    histories = vehicle_history[
        camera_name
    ]

    nearest_distance = None
    nearest_vehicle = None

    for other_id, history in histories.items():

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

    if nearest_distance <= NEARBY_DISTANCE_THRESHOLD:
        return True

    return False


# ============================================================
# CALCULATE ACCIDENT FEATURES
# ============================================================

def calculate_accident_features(
    camera_name,
    vehicle_id,
    current_point,
    current_speed
):

    sudden_deceleration = (
        detect_sudden_deceleration(
            camera_name,
            vehicle_id,
            current_speed
        )
    )

    nearby_vehicle = (
        detect_nearby_vehicle(
            camera_name,
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
# PROCESS ONE VEHICLE
# ============================================================

def update_accident_detection(
    camera_name,
    vehicle_id,
    current_point,
    current_speed
):

    with accident_lock:

        # ----------------------------------------------------
        # CREATE CAMERA HISTORY
        # ----------------------------------------------------

        if camera_name not in vehicle_history:

            vehicle_history[
                camera_name
            ] = {}

        # ----------------------------------------------------
        # CREATE VEHICLE HISTORY
        # ----------------------------------------------------

        if (
            vehicle_id
            not in vehicle_history[camera_name]
        ):

            vehicle_history[
                camera_name
            ][vehicle_id] = []

        # ----------------------------------------------------
        # CREATE CONFIRMATION COUNTER
        # ----------------------------------------------------

        if (
            camera_name
            not in vehicle_accident_confirmation
        ):

            vehicle_accident_confirmation[
                camera_name
            ] = {}

        if (
          vehicle_id
          not in vehicle_accident_confirmation[
            camera_name
          ]
        ):

          vehicle_accident_confirmation[
              camera_name
          ][vehicle_id] = 0

        history = (
          vehicle_history[
            camera_name
          ][vehicle_id]
        )

        # ====================================================
        # DETECT FEATURES BEFORE STORING CURRENT MOVEMENT
        # ====================================================

        features = calculate_accident_features(
          camera_name,
          vehicle_id,
          current_point,
          current_speed
        )

        # ====================================================
        # STORE CURRENT MOVEMENT
        # ====================================================

        history.append({
            "point": current_point,
            "speed": current_speed
        })

        # ====================================================
        # LIMIT HISTORY
        # ====================================================

        if len(history) > HISTORY_SIZE:

            history.pop(0)

        # ====================================================
        # UPDATE CONFIRMATION
        # ====================================================

        if features["possible_accident"]:

            vehicle_accident_confirmation[
                camera_name
            ][vehicle_id] += 1

        else:

            vehicle_accident_confirmation[
                camera_name
            ][vehicle_id] = 0

        confirmation = (
            vehicle_accident_confirmation[
                camera_name
            ][vehicle_id]
        )

        # ====================================================
        # CHECK ACCIDENT CONFIRMATION
        # ====================================================

        accident_confirmed = (
					confirmation
					>= ACCIDENT_CONFIRMATION_FRAMES
        )

        # ====================================================
        # UPDATE CAMERA STATE
        # ====================================================

        if accident_confirmed:

          detected_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

          accident_states[
            camera_name
          ] = {

            "possible_accident": True,

            "sudden_deceleration": True,

            "nearby_vehicle": True,

            "vehicle_id": vehicle_id,
            "detected_at": detected_at
          }

          print(
            "\n"
            "========================================\n"
            "       POSSIBLE ACCIDENT DETECTED\n"
            "========================================\n"
            f"Camera: {camera_name}\n"
            f"Vehicle ID: {vehicle_id}\n"
            f"Confirmation: "
            f"{confirmation}/"
            f"{ACCIDENT_CONFIRMATION_FRAMES}\n"
            "========================================\n"
          )

        # ====================================================
        # RETURN RESULT
        # ====================================================

        return {

          "possible_accident":
             accident_confirmed,

          "sudden_deceleration":
            features["sudden_deceleration"],

          "nearby_vehicle":
            features["nearby_vehicle"],

          "vehicle_id":
            vehicle_id,

          "confirmation":
            confirmation,

          "detected_at":
            accident_states[camera_name]["detected_at"]
        }


# ============================================================
# GET CAMERA ACCIDENT STATE
# ============================================================

def get_accident_state(camera_name):

    with accident_lock:

        return accident_states[
            camera_name
        ].copy()


# ============================================================
# RESET CAMERA ACCIDENT STATE
# ============================================================

def reset_accident_state(camera_name):

  with accident_lock:

    accident_states[
        camera_name
    ] = {

      "possible_accident": False,

      "sudden_deceleration": False,

      "nearby_vehicle": False,

      "vehicle_id": None,

      "detected_at": None
    }