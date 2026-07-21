#from ultralytics import YOLO

def calculate_speed(results, camera_name):

  #results = model.track(frame, persist=True, verbose=False)

  for result in results:

    if result.boxes.id is None:
      continue

    for box, track_id in zip(result.boxes, result.boxes.id):
      class_id = int(box.cls[0])

      print(
        f"[{camera_name}]"
        f"Vehicle ID: {int(track_id)} | "
        f"{result.names[class_id]}"
      )

  return results  
