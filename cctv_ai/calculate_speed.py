import math

previous_positions = {}

vehicle_speeds = {}

def calculate_speed(vehicles, camera_name, report=False):

  global previous_positions
  global vehicle_speeds

  if report:
    speeds = vehicle_speeds.get(camera_name, {})

    if len(speeds) == 0:
      return 0
    
    return sum(speeds.values()) / len(speeds)

  if camera_name not in previous_positions:
    previous_positions[camera_name] = {}
  
  if camera_name not in vehicle_speeds:
    vehicle_speeds[camera_name] = {}

  camera_positions = previous_positions[camera_name]

  #total_speed = 0
  #total_vehicles = 0

  for vehicle in vehicles:

    track_id = vehicle["track_id"]
    #class_name = vehicle["class_name"]
    box = vehicle["box"]

    #Bounding box coordinates
    x1, y1, x2, y2 = box.xyxy[0].tolist()

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
      speed = distance
    
    camera_positions[track_id] = current_position
    vehicle_speeds[camera_name][track_id] = speed

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
