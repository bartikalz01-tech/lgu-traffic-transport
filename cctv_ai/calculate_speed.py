import math
import time

AVERAGE_CAR_LENGTH = 4.5
AVERAGE_TRUCK_LENGTH = 10.0

# --- Sanity guards ---

# Ignore bounding boxes that are too small to provide
# a reasonably stable scale estimate.
MIN_VEHICLE_HEIGHT_PIXELS = 15

# Reject obviously impossible city-road speeds.
MAX_PLAUSIBLE_SPEED_KMH = 80

# YOLO can sometimes take more than 1 second between detections.
# Allow a longer gap before rejecting the measurement.
MAX_GAP_SECONDS = 2.0

previous_positions = {}
previous_timestamps = {}

vehicle_speeds = {}

last_valid_speeds = {}

printed_ids = {}

speed_debug_times = {}


def calculate_speed(vehicles, camera_name, fps, video_timestamp=None, report=False):

	global previous_positions
	global previous_timestamps
	global vehicle_speeds
	global last_valid_speeds

	# ==========================================================
	# REPORT AVERAGE SPEED
	# ==========================================================

	if report:

		speed = vehicle_speeds.get(camera_name, {})

		if len(speed) == 0:
				return 0

		vehicle_averages = []

		for speed_list in speed.values():

				if len(speed_list) == 0:
						continue

				average_vehicle_speed = (
						sum(speed_list) / len(speed_list)
				)

				vehicle_averages.append(
						average_vehicle_speed
				)

		if len(vehicle_averages) == 0:
				return 0

		road_average = (
				sum(vehicle_averages)
				/ len(vehicle_averages)
		)

		vehicle_speeds[camera_name].clear()

		return road_average


	# ==========================================================
	# INITIALIZE CAMERA STORAGE
	# ==========================================================

	if camera_name not in previous_positions:
		previous_positions[camera_name] = {}

	if camera_name not in previous_timestamps:
		previous_timestamps[camera_name] = {}

	if camera_name not in vehicle_speeds:
		vehicle_speeds[camera_name] = {}

	if camera_name not in last_valid_speeds:
		last_valid_speeds[camera_name] = {}

	camera_positions = (
		previous_positions[camera_name]
	)

	camera_timestamps = (
		previous_timestamps[camera_name]
	)

	camera_last_speeds = (
		last_valid_speeds[camera_name]
	)


	# ==========================================================
	# DEBUG TRACKING
	# ==========================================================

	if camera_name not in printed_ids:
		printed_ids[camera_name] = set()

	if video_timestamp is None:
		current_video_time = time.monotonic()
	else:
		current_video_time = video_timestamp

	previous_speed_debug_time = (
		speed_debug_times.get(camera_name)
	)

	if previous_speed_debug_time is not None:

		speed_interval = (
			current_video_time - previous_speed_debug_time
		)

		print(
			f"[SPEED TIMING] "
			f"Camera={camera_name} "
			f"TimeSincePreviousCalculateSpeed="
			f"{speed_interval:.3f}s"
		)

	speed_debug_times[camera_name] = current_video_time


	# ==========================================================
	# PROCESS VEHICLES
	# ==========================================================

	for vehicle in vehicles:

		track_id = vehicle["track_id"]
		class_name = vehicle["class_name"]

		if track_id not in printed_ids[camera_name]:

			printed_ids[camera_name].add(track_id)


		box = vehicle["box"]

		# Bounding box coordinates
		x1, y1, x2, y2 = (
			box.xyxy[0].tolist()
		)


		# ======================================================
		# VEHICLE SIZE
		# ======================================================

		# We use the bounding-box HEIGHT as the reference
		# because the vehicle's apparent height changes with
		# its distance from the camera.

		vehicle_height_pixels = abs(
			y2 - y1
		)


		if class_name in ["truck", "bus"]:

			reference_length = (
				AVERAGE_TRUCK_LENGTH
			)

		else:

			reference_length = (
				AVERAGE_CAR_LENGTH
			)


		# ======================================================
		# CENTER POSITION
		# ======================================================

		center_x = (
			x1 + x2
		) / 2

		center_y = (
			y1 + y2
		) / 2

		current_position = (
			center_x,
			center_y
		)


		speed = camera_last_speeds.get(track_id, 0.0)


		# ======================================================
		# VALID BOUNDING BOX
		# ======================================================

		box_is_valid = (
			vehicle_height_pixels
			>= MIN_VEHICLE_HEIGHT_PIXELS
		)


		# ======================================================
		# CALCULATE SPEED
		# ======================================================

		if (
			track_id in camera_positions
			and box_is_valid
		):

				previous_x, previous_y = (
					camera_positions[track_id]
				)

				previous_time = camera_timestamps.get(track_id, current_video_time)


				# Actual elapsed wall-clock time
				elapsed_seconds = (
					current_video_time - previous_time
				)


				if elapsed_seconds <= 0:

					elapsed_seconds = (
						1.0 / fps
					)


				# Only calculate if the track was
				# seen recently enough.
				if elapsed_seconds <= MAX_GAP_SECONDS:

					# ----------------------------------------------
					# Pixel movement
					# ----------------------------------------------

					distance_pixels = math.sqrt(
							(center_x - previous_x) ** 2
							+
							(center_y - previous_y) ** 2
					)


					# ----------------------------------------------
					# Approximate meters per pixel
					# ----------------------------------------------

					meters_per_pixel = (
							reference_length
							/ vehicle_height_pixels
					)


					# ----------------------------------------------
					# Convert pixel movement to meters
					# ----------------------------------------------

					distance_meters = (
							distance_pixels
							* meters_per_pixel
					)


					# ----------------------------------------------
					# Convert to meters per second
					# ----------------------------------------------

					speed_mps = (
							distance_meters
							/ elapsed_seconds
					)


					# ----------------------------------------------
					# Convert m/s to km/h
					# ----------------------------------------------

					calculate_speed = (
							speed_mps * 3.6
					)


					# ==================================================
					# DEBUG
					# ==================================================

					print(
							f"[SPEED DEBUG] "
							f"Camera={camera_name} "
							f"ID={track_id} "
							f"Distance={distance_pixels:.2f}px "
							f"Elapsed={elapsed_seconds:.3f}s "
							f"BoxHeight={vehicle_height_pixels:.2f}px "
							f"MetersPerPixel={meters_per_pixel:.4f} "
							f"Speed={calculate_speed:.2f}km/h"
					)


					# ==================================================
					# PHYSICAL SANITY CHECK
					# ==================================================

					if calculate_speed <= MAX_PLAUSIBLE_SPEED_KMH:

						speed = calculate_speed

						camera_last_speeds[track_id] = (
							calculate_speed
						)

					else:

						print(
								f"[SPEED REJECTED] "
								f"Camera={camera_name} "
								f"ID={track_id} "
								f"Speed={speed:.2f}km/h"
						)

						speed = camera_last_speeds.get(track_id, 0.0)


		# ==========================================================
		# STORE CURRENT POSITION/TIME
		# ==========================================================

		vehicle["speed"] = speed

		camera_positions[track_id] = (
			current_position
		)

		camera_timestamps[track_id] = current_video_time


		# ==========================================================
		# STORE SPEED HISTORY
		# ==========================================================

		camera_speeds = (
			vehicle_speeds[camera_name]
		)

		if track_id not in camera_speeds:

			camera_speeds[track_id] = []


		# Only store valid positive measurements.
		if speed > 0:

			camera_speeds[track_id].append(
				speed
			)