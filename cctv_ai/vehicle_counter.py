
vehicle_history = {}

def update_vehicle_counter(vehicles, camera_name):

  if camera_name not in vehicle_history:
    vehicle_history[camera_name] = set()

  for vehicle in vehicles:
    vehicle_history[camera_name].add(
      vehicle["track_id"]
    )


def report_vehicle_count(camera_name):
  
  if camera_name not in vehicle_history:
    return 0
  
  count = len(vehicle_history[camera_name])

  vehicle_history[camera_name].clear()

  return count