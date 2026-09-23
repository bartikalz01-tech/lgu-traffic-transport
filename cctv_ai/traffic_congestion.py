import math

HIGH_TRAFFIC_VEHICLES = 5
MODERATE_TRAFFIC_VEHICLES = 3

CLOSE_DISTANCE_MULTIPLIER = 3.0

def calculate_close_vehicle_groups(vehicles):

  if not vehicles:
    return 0

  vehicle_points = []

  for vehicle in vehicles:

    box = vehicle["box"]

    x1, y1, x2, y2 = (
      box.xyxy[0].tolist()
    )

    center_x = (
      x1 + x2
    ) / 2

    center_y = (
      y1 + y2
    ) / 2

    width = abs(x2 - x1)

    vehicle_points.append({
      "x": center_x,
      "y": center_y,
      "width": width
    })


  if len(vehicle_points) < 2:
    return len(vehicle_points)

  close_vehicle_count = 0

  for i in range(len(vehicle_points)):

    nearby_count = 0

    current = vehicle_points[i]

    for j in range(len(vehicle_points)):

      if i == j:
        continue

      other = vehicle_points[j]

      distance = math.sqrt(
        (current["x"] - other["x"]) ** 2
        +
        (current["y"] - other["y"]) ** 2
      )

      average_width = (
        current["width"] + other["width"]
      ) / 2

      close_distance = (average_width * CLOSE_DISTANCE_MULTIPLIER)

      if distance <= close_distance:
        nearby_count += 1

    if nearby_count > 0:
      close_vehicle_count += 1

  return close_vehicle_count


def calculate_congestion(average_speed, vehicles):

  close_vehicle_count = (
    calculate_close_vehicle_groups(vehicles)
  )

  # ==========================================
  # SPEED SCORE
  # ==========================================

  if average_speed >= 30:

    speed_score = 0

  elif average_speed <= 15:

    speed_score = 100

  else:

    speed_score = (
      (30 - average_speed) / 15
    ) * 100


  if close_vehicle_count >= HIGH_TRAFFIC_VEHICLES:
    density_score = 100

  elif close_vehicle_count >= MODERATE_TRAFFIC_VEHICLES:
    density_score = 60

  elif close_vehicle_count >= 1:
    density_score = 20

  else:
    density_score = 0 


  congestion_score = (
    (speed_score * 0.60)
    +
    (density_score * 0.40)
  )


  # ==========================================
  # CONGESTION LEVEL
  # ==========================================

  if congestion_score >= 70:
    congestion = "high"

  elif congestion_score >= 35:
    congestion = "moderate"

  else:
    congestion = "low"


  # ==========================================
  # DEBUG OUTPUT
  # ==========================================

  print("\n---------- CONGESTION CALCULATION ----------")
  print(f"Average Speed: {average_speed:.2f} km/h")
  print(
    f"Close Vehicles: "
    f"{close_vehicle_count}"
  )
  print(
    f"Speed Score: "
    f"{speed_score:.2f}"
  )
  print(
    f"Density Score: "
    f"{density_score:.2f}"
  )
  print(f"Congestion Score: {congestion_score:.2f}")
  print(f"Congestion Level: {congestion}")
  print("---------------------------------------------")


  return congestion_score, congestion