import cv2

def draw_tracking(frame, vehicles, accident_vehicle_id=None):

  for vehicle in vehicles:

    box = vehicle["box"]

    x1, y1, x2, y2 = map(int, box.xyxy[0])

    track_id = vehicle["track_id"]

    class_name = vehicle["class_name"]

    speed = vehicle.get("speed", 0)

    is_accident_vehicle = (
      accident_vehicle_id is not None
      and track_id == accident_vehicle_id
    )

    if is_accident_vehicle:
      box_color = (0, 0, 255)

      label = (
        f"POSSIBLE ACCIDENT | "
        f"{class_name} "
        f"ID: {track_id} "
        f"{speed:.1f} km/h"
      )

    else:
      box_color = (0, 255, 0)

      label = (
        f"{class_name} "
        f"ID: {track_id} "
        f"{speed:.1f} km/h"
      )

    cv2.rectangle(
      frame,
      (x1, y1),
      (x2, y2),
      box_color,
      2
    )

    cv2.putText(
      frame,
      label,
      (x1, y1 - 10),
      cv2.FONT_HERSHEY_SIMPLEX,
      0.6,
      box_color,
      2
    )
  
  return frame