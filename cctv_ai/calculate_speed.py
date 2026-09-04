import math
import time

AVERAGE_CAR_LENGTH = 4.5
AVERAGE_TRUCK_LENGTH = 10.0

SPEED_CALIBRATION_FACTOR = 0.22

# --- Sanity guards (this is the actual bug fix) ---

# Ignore bounding boxes that are too thin/degenerate to give a reliable
# meters-per-pixel estimate (partial detections, edge clipping, occlusion).
MIN_VEHICLE_WIDTH_PIXELS = 15

# Any single-frame reading above this is physically implausible for city
# road traffic and almost certainly a tracking glitch, not a real vehicle.
MAX_PLAUSIBLE_SPEED_KMH = 80

# If a track hasn't been seen for longer than this, don't trust the
# distance between "previous" and "current" position for a speed calc -
# the vehicle was probably lost/occluded for multiple frames, not one.
MAX_GAP_SECONDS = 1.0

previous_positions = {}
previous_timestamps = {}

vehicle_speeds = {}

printed_ids = {}


def calculate_speed(vehicles, camera_name, fps, report=False):

    global previous_positions
    global previous_timestamps
    global vehicle_speeds

    if report:
        speed = vehicle_speeds.get(camera_name, {})

        if len(speed) == 0:
            return 0

        vehicle_averages = []

        for speed_list in speed.values():

            if len(speed_list) == 0:
                continue

            average_vehicle_speed = sum(speed_list) / len(speed_list)

            vehicle_averages.append(average_vehicle_speed)

        if len(vehicle_averages) == 0:
            return 0

        road_average = sum(vehicle_averages) / len(vehicle_averages)

        vehicle_speeds[camera_name].clear()

        return road_average

    if camera_name not in previous_positions:
        previous_positions[camera_name] = {}

    if camera_name not in previous_timestamps:
        previous_timestamps[camera_name] = {}

    if camera_name not in vehicle_speeds:
        vehicle_speeds[camera_name] = {}

    camera_positions = previous_positions[camera_name]
    camera_timestamps = previous_timestamps[camera_name]

    if camera_name not in printed_ids:
        printed_ids[camera_name] = set()

    now = time.monotonic()

    for vehicle in vehicles:

        track_id = vehicle["track_id"]
        class_name = vehicle["class_name"]

        if track_id not in printed_ids[camera_name]:
            printed_ids[camera_name].add(track_id)

        box = vehicle["box"]

        # Bounding box coordinates
        x1, y1, x2, y2 = box.xyxy[0].tolist()

        vehicle_width_pixels = abs(y2 - y1)

        if class_name in ["truck", "bus"]:
            reference_length = AVERAGE_TRUCK_LENGTH
        else:
            reference_length = AVERAGE_CAR_LENGTH

        # center point
        center_x = (x1 + x2) / 2
        center_y = (y1 + y2) / 2

        current_position = (center_x, center_y)

        speed = 0

        # Guard 1: skip degenerate/too-thin boxes. Dividing reference_length
        # by a near-zero pixel value is what produces most of the absurd
        # speed spikes.
        box_is_valid = vehicle_width_pixels >= MIN_VEHICLE_WIDTH_PIXELS

        if track_id in camera_positions and box_is_valid:

            previous_x, previous_y = camera_positions[track_id]
            previous_time = camera_timestamps.get(track_id, now)

            # Guard 2: use the ACTUAL elapsed time since this track was
            # last seen, instead of assuming exactly 1/fps has passed.
            # If the vehicle was briefly lost/occluded, previous_position
            # may be several frames old - assuming 1 frame here is what
            # made the code overestimate speed after any gap.
            elapsed_seconds = now - previous_time

            if elapsed_seconds <= 0:
                elapsed_seconds = 1.0 / fps

            if elapsed_seconds <= MAX_GAP_SECONDS:

                distance = math.sqrt(
                    (center_x - previous_x) ** 2 +
                    (center_y - previous_y) ** 2
                )

                meters_per_pixel = reference_length / vehicle_width_pixels

                speed_mps = distance * meters_per_pixel / elapsed_seconds

                raw_speed = speed_mps * 3.6

                speed = raw_speed * SPEED_CALIBRATION_FACTOR

                # Guard 3: physical sanity cap. Whatever slipped through
                # guards 1 and 2, a reading this high on a city road is
                # a tracking/measurement glitch, not a real vehicle -
                # drop it rather than let it poison the average/peak.
                if speed > MAX_PLAUSIBLE_SPEED_KMH:
                    speed = 0

        vehicle["speed"] = speed

        camera_positions[track_id] = current_position
        camera_timestamps[track_id] = now

        camera_speeds = vehicle_speeds[camera_name]

        if track_id not in camera_speeds:
            camera_speeds[track_id] = []

        # Only record genuine, plausible readings into the rolling average.
        # (speed == 0 here means "no reliable reading this frame", not
        # "vehicle is stationary" - a stationary vehicle would still
        # produce a valid near-zero speed the frame before this guard.)
        if speed > 0:
            camera_speeds[track_id].append(speed)