import cv2

def draw_tracking(frame, vehicles):

  for vehicle in vehicles:

    box = vehicle["box"]

    x1, y1, x2, y2 = map(int, box.xyxy[0])

    track_id = vehicle["track_id"]

    class_name = vehicle["class_name"]

    speed = vehicle.get("speed", 0)

    cv2.rectangle(
      frame,
      (x1, y1),
      (x2, y2),
      (0, 255, 0),
      2
    )

    label = (
      f"{class_name} "
      f"ID: {track_id} "
      f"{speed:.1f} px/s"
    )

    cv2.putText(
      frame,
      label,
      (x1, y1 - 10),
      cv2.FONT_HERSHEY_SIMPLEX,
      0.6,
      (0, 255, 0),
      2
    )
  
  return frame