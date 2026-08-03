import math

AVERAGE_CAR_LENGTH = 4.5
AVERAGE_TRUCK_LENGTH = 10.0

SPEED_CALIBRATION_FACTOR = 0.22

previous_positions = {}

vehicle_speeds = {}

printed_ids = {}

def calculate_speed(vehicles, camera_name, fps, report=False):

  global previous_positions
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
  
  if camera_name not in vehicle_speeds:
    vehicle_speeds[camera_name] = {}

  camera_positions = previous_positions[camera_name]

  if camera_name not in printed_ids:
    printed_ids[camera_name] = set()

  #total_speed = 0
  #total_vehicles = 0

  for vehicle in vehicles:

    track_id = vehicle["track_id"]
    class_name = vehicle["class_name"]

    if track_id not in printed_ids[camera_name]:
      printed_ids[camera_name].add(track_id)

      #print(
        #f"[{camera_name}] "
        #f"NEW TRACK -> "
        #f"ID {track_id:<4} "
        #f"{vehicle['class_name']}"
      #)

    #class_name = vehicle["class_name"]
    box = vehicle["box"]

    #Bounding box coordinates
    x1, y1, x2, y2 = box.xyxy[0].tolist()

    vehicle_width_pixels = abs(y2 - y1)

    if class_name in ["truck", "bus"]:
      reference_length = AVERAGE_TRUCK_LENGTH
    else:
      reference_length = AVERAGE_CAR_LENGTH

    #center point
    center_x = (x1 + x2) / 2
    center_y = (y1 + y2) / 2

    current_position = (center_x, center_y)

    speed = 0

    #camera_positions = previous_positions[camera_name]

    if track_id in camera_positions:

      previous_x, previous_y = camera_positions[track_id]

      distance = math.sqrt(
        (center_x - previous_x) ** 2 +
        (center_y - previous_y) ** 2
      )

      # For now since I am processing every second.
      # pixels traveled = pixels/sec
      #speed = distance * fps
      meters_per_pixel = reference_length / vehicle_width_pixels

      speed_mps = distance * meters_per_pixel * fps

      raw_speed = speed_mps * 3.6

      speed = raw_speed * SPEED_CALIBRATION_FACTOR
    
    vehicle["speed"] = speed
    
    camera_positions[track_id] = current_position
    #vehicle_speeds[camera_name][track_id] = speed
    camera_speeds = vehicle_speeds[camera_name]

    if track_id not in camera_speeds:
      camera_speeds[track_id] = []

    camera_speeds[track_id].append(speed)

    #print(
      #f"[{camera_name}] "
      #f"Vehicle ID: {track_id:<3} | "
      #f"Current speed: {speed:.2f} px/s"
    #)

    #total_speed += speed
    #total_vehicles += 1

    #print(
      #f"[{camera_name}]"
      #f"Vehicle ID: {vehicle['track_id']} | "
      #f"{class_name} | "
      #f"Speed: {speed:2f} px/s"
    #)
  
  #if total_vehicles > 0:
    #average_speed = total_speed / total_vehicles
  #else:
    #average_speed = 0

  #print(f"\nAverage Speed: {average_speed:.2f} px/s")

  #return average_speed
