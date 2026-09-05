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


# ============================================================
# 3-STAGE ACCIDENT DETECTION
# ============================================================

ACCIDENT_CANDIDATE_THRESHOLD = 3

# Maximum number of frames allowed between qualifying
# observations while building a candidate.
CANDIDATE_MAX_GAP = 3


# ============================================================
# PER-CAMERA VEHICLE TRACKING DATA
# ============================================================

vehicle_history = defaultdict(dict)


# ============================================================
# PER-CAMERA ACCIDENT CANDIDATE DATA
# ============================================================

vehicle_accident_candidates = defaultdict(dict)


# ============================================================
# PER-CAMERA ACCIDENT STATE
# ============================================================

accident_states = defaultdict(lambda: {
    "state": "NORMAL",

    "possible_accident": False,

    "sudden_deceleration": False,

    "nearby_vehicle": False,

    "vehicle_id": None,

    "detected_at": None,

    "candidate_score": 0
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

    if not history or len(history) < MIN_HISTORY_SIZE:
        return False

    previous_speed = history[-1]["speed"]

    if previous_speed < MIN_MOVEMENT_SPEED:
        return False

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

  if nearest_distance is None:
    return False

  return (
    nearest_distance
    <= NEARBY_DISTANCE_THRESHOLD
  )


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
# GET / CREATE CANDIDATE
# ============================================================

def get_candidate(
    camera_name,
    vehicle_id
):

  if (
    vehicle_id
    not in vehicle_accident_candidates[camera_name]
  ):

    vehicle_accident_candidates[
        camera_name
    ][vehicle_id] = {

        "score": 0,

        "gap": 0,

        "state": "NORMAL"
    }

  return vehicle_accident_candidates[
    camera_name
  ][vehicle_id]


# ============================================================
# RESET CANDIDATE
# ============================================================

def reset_candidate(
  camera_name,
  vehicle_id
):

  vehicle_accident_candidates[
      camera_name
  ][vehicle_id] = {

    "score": 0,

    "gap": 0,

    "state": "NORMAL"
  }


# ============================================================
# UPDATE ACCIDENT DETECTION
# ============================================================

def update_accident_detection(
  camera_name,
  vehicle_id,
  current_point,
  current_speed
):

  with accident_lock:

    # ====================================================
    # CREATE CAMERA HISTORY
    # ====================================================

    if camera_name not in vehicle_history:

      vehicle_history[
         camera_name
      ] = {}

    # ====================================================
    # CREATE VEHICLE HISTORY
    # ====================================================

    if (
      vehicle_id
      not in vehicle_history[camera_name]
    ):

      vehicle_history[
          camera_name
      ][vehicle_id] = []

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
    # GET CANDIDATE
    # ====================================================

    candidate = get_candidate(
      camera_name,
      vehicle_id
    )

    # ====================================================
    # STAGE 1 / STAGE 2
    #
    # NORMAL → CANDIDATE
    # ====================================================

    if features["possible_accident"]:

      candidate["score"] += 1

      candidate["gap"] = 0

      candidate["state"] = "CANDIDATE"

    else:

      # No qualifying evidence this frame
      if candidate["score"] > 0:

          candidate["gap"] += 1

      # Evidence disappeared for too long.
      if candidate["gap"] > CANDIDATE_MAX_GAP:

          reset_candidate(
              camera_name,
              vehicle_id
          )

          candidate = get_candidate(
              camera_name,
              vehicle_id
          )

    # ====================================================
    # STAGE 3
    #
    # CANDIDATE → CONFIRMED
    # ====================================================

    accident_confirmed = (
      candidate["score"]
      >= ACCIDENT_CANDIDATE_THRESHOLD
    )

    # ====================================================
    # UPDATE STATE
    # ====================================================

    if accident_confirmed:

      candidate["state"] = "CONFIRMED"

      detected_at = (
          datetime.now().strftime(
              "%Y-%m-%d %H:%M:%S"
          )
      )

      accident_states[
          camera_name
      ] = {

        "state": "CONFIRMED",

        "possible_accident": True,

        "sudden_deceleration": True,

        "nearby_vehicle": True,

        "vehicle_id": vehicle_id,

        "detected_at": detected_at,

        "candidate_score":
            candidate["score"]
      }

    elif candidate["score"] > 0:

      accident_states[
        camera_name
      ] = {

        "state": "CANDIDATE",

        "possible_accident": False,

        "sudden_deceleration":
            features[
                "sudden_deceleration"
            ],

        "nearby_vehicle":
            features[
                "nearby_vehicle"
            ],

        "vehicle_id": vehicle_id,

        "detected_at": None,

        "candidate_score":
            candidate["score"]
      }

    else:
      accident_states[
        camera_name
      ] = {

        "state": "NORMAL",

        "possible_accident": False,

        "sudden_deceleration":
            features[
                "sudden_deceleration"
            ],

        "nearby_vehicle":
            features[
                "nearby_vehicle"
            ],

        "vehicle_id": vehicle_id,

        "detected_at": None,

        "candidate_score": 0
      }

    # ====================================================
    # RETURN RESULT
    # ====================================================

    return {

        "state":
            accident_states[
                camera_name
            ]["state"],

        "possible_accident":
            accident_confirmed,

        "sudden_deceleration":
            features[
                "sudden_deceleration"
            ],

        "nearby_vehicle":
            features[
                "nearby_vehicle"
            ],

        "vehicle_id":
            vehicle_id,

        "candidate_score":
            candidate["score"],

        "candidate_threshold":
            ACCIDENT_CANDIDATE_THRESHOLD,

        "detected_at":
            accident_states[
                camera_name
            ]["detected_at"]
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

      "state": "NORMAL",

      "possible_accident": False,

      "sudden_deceleration": False,

      "nearby_vehicle": False,

      "vehicle_id": None,

      "detected_at": None,

      "candidate_score": 0
    }

    vehicle_accident_candidates[
      camera_name
    ].clear()