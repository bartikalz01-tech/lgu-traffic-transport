def filter_vehicles(results):
  vehicle_classes = [2, 3, 5, 7]
  confidence_threshold = 0.40

  vehicles = []

  for result in results:
    
    if result.box.id is None:
      continue

    for box, track_id in zip(result.boxes, result.boxes.id):

      class_id = int(box.cls[0])
      confidence = float(box.conf[0])

      if confidence < confidence_threshold:
        continue

      if class_id not in vehicle_classes:
        continue

      vehicles.append({
        "track_id": int(track_id),
        "class_id": class_id,
        "class_name": result.names[class_id],
        "confidence": confidence,
        "box": box
      })

  return vehicles    