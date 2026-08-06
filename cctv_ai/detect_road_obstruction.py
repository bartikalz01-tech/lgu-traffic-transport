import time
import math

road_obstruction_history = {}

# COCO IDs
PERSON = 0
BICYCLE = 1
MOTORCYCLE = 3
BENCH = 13
UMBRELLA = 25
HANDBAG = 26
SUITCASE = 28
CHAIR = 56

OBSTRUCTION_CLASSES = {
  BENCH,
  CHAIR,
  SUITCASE
}

VENDOR_OBJECTS = {
  UMBRELLA,
  CHAIR,
  MOTORCYCLE,
  BICYCLE
}

ROAD_ZONE = (
  200,
  150,
  1050,
  720
)

STATIONARY_SECONDS = 8
MOVE_THRESHOLD = 25
NEARBY_DISTANCE = 100

def detect_possible_road_obstruction(results, camera_name):

  if camera_name not in road_obstruction_history:
    road_obstruction_history[camera_name] = {}

  history = road_obstruction_history[camera_name]

  detections = []

  for result in results:

    if result.boxes.id is None:
      continue

    for box, track_id in zip(result.boxes, result.boxes.id):
      class_id = int(box.cls[0])

      x1, y1, x2, y2 = map(int, box.xyxy[0])

      cx = (x1 + x2) // 2
      cy = (y1 + y2) // 2

      detections.append({
        "track_id": int(track_id),
        "class_id": class_id,
        "center": (cx, cy),
        "box": (x1, y1, x2, y2)
      })

  persons = [
    d for d in detections
    if d["class_id"] == PERSON
  ]

  vendor_objects = [
    d for d in detections
    if d["class_id"] in VENDOR_OBJECTS
  ]

  obstruction_objects = [
    d for d in detections
    if d["class_id"] in OBSTRUCTION_CLASSES
  ]

  possible_vendors = []
  possible_obstructions = []

  now = time.time()

  for person in persons:
    px, py = person["center"]

    if not (ROAD_ZONE[0] <= px <= ROAD_ZONE[2] and  ROAD_ZONE[1] <= py <= ROAD_ZONE[3]):
      continue

    nearby = False

    for obj in vendor_objects:
      ox, oy = obj["center"]

      if math.hypot(px - ox, py - oy) <= NEARBY_DISTANCE:
        nearby = True
        break

    if not nearby:
      continue

    track_id = person["track_id"]

    if track_id not in history:
      history[track_id] = {
        "first_seen": now,
        "last_pos": (px, py)
      }
      continue

    hx, hy = history[track_id]["last_pos"]

    movement = math.hypot(px - hx, py - hy)

    if movement < MOVE_THRESHOLD:
      if now - history[track_id]["first_seen"] >= STATIONARY_SECONDS:
        possible_vendors.append(track_id)

    else:
      history[track_id]["first_seen"] = now

    history[track_id]["last_pos"] = (px, py)


  for obj in obstruction_objects:
    ox, oy = obj["center"]

    if not (ROAD_ZONE[0] <= ox <= ROAD_ZONE[2] and ROAD_ZONE[1] <= oy <= ROAD_ZONE[3]):
      continue

    track_id = obj["track_id"]

    if track_id not in history:
      history[track_id] = {
        "first_seen": now,
        "last_pos": (ox, oy)
      }

      continue

    hx, hy = history[track_id]["last_pos"]

    movement = math.hypot(ox - hx, oy - hy)

    if movement < MOVE_THRESHOLD:
      if now - history[track_id]["first_seen"] >= STATIONARY_SECONDS:
        possible_obstructions.append(track_id)
    else:
      history[track_id]["first_seen"] = now

    history[track_id]["last_pos"] = (ox, oy)

  return {
    "vendors": possible_vendors,
    "obstructions": possible_obstructions
  }