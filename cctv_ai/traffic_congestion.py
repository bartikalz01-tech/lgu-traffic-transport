def calculate_congestion(average_speed):

  # ==========================================
  # CONGESTION SCORE BASED ON SPEED
  # ==========================================

  if average_speed >= 30:

    congestion_score = 0

  elif average_speed <= 15:

    congestion_score = 100

  else:

    congestion_score = (
      (30 - average_speed) / 15
    ) * 100


  # ==========================================
  # CONGESTION LEVEL
  # ==========================================

  if average_speed >= 30:

    congestion = "low"

  elif average_speed >= 20:

    congestion = "moderate"

  else:

    congestion = "high"


  # ==========================================
  # DEBUG OUTPUT
  # ==========================================

  print("\n---------- CONGESTION CALCULATION ----------")
  print(f"Average Speed: {average_speed:.2f} km/h")
  print(f"Congestion Score: {congestion_score:.2f}")
  print(f"Congestion Level: {congestion}")
  print("---------------------------------------------")


  return congestion_score, congestion