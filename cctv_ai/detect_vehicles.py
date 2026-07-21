# Detect Vehicles
def detect_vehicles(results, camera_name):
  #results = model.track(frame, verbose=False)

  vehicle_classes = {2, 3, 5, 7}

  confidence_threshold = 0.40

  vehicle_count = 0

  for result in results:

    for box in result.boxes:
      class_id = int(box.cls[0])
      confidence = float(box.conf[0])

      if confidence < confidence_threshold:
        continue

      if class_id in vehicle_classes:
        vehicle_count += 1

  print(f"[{camera_name}] Detected Vehicles: {vehicle_count}")

  return vehicle_count