#from ultralytics import YOLO

def calculate_speed(vehicles, camera_name):

  for vehicle in vehicles:

    print(
      f"[{camera_name}]"
      f"Vehicle ID: {vehicle['track_id']} | "
      f"{vehicle['class_name']}"
    )
