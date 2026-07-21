def filter_vehicles(results):
  vehicle_classes = [2, 3, 5, 7]

  vehicles = []

  for result in results:

    print(f"Tracking IDs : {result.boxes.id}")
    print(f"Total Boxes : {len(result.boxes)}")

    print(f"\nDetected Objects:")

    if result.boxes.id is None:

      for box in result.boxes:

        class_id = int(box.cls[0])
        class_name = result.names[class_id]

        print(f"  - {class_name:<15} (Class ID: {class_id})")
      
      print("=" * 40)
      continue
    
    for box, track_id in zip(result.boxes, result.boxes.id):
      class_id = int(box.cls[0])
      class_name = result.names[class_id]

      print(
        f"  - {class_name:<15} "
        f"(Class ID: {class_id})"
        f"Track ID: {int(track_id)}"
      )

      if class_id not in vehicle_classes:
        continue

      vehicles.append({
        "track_id": int(track_id),
        "class_id": class_id,
        "class_name": class_name,
        "box": box
      })

    print("=" * 40) 

  return vehicles