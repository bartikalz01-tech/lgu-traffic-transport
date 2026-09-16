def calculate_congestion(average_speed):

  # ==========================================
  # CONGESTION SCORE BASED ONLY ON SPEED
  # ==========================================

  if average_speed >= 50:

    congestion_score = 0

  elif average_speed <= 10:

    congestion_score = 100

  else:

    congestion_score = (
      (50 - average_speed) / 40
    ) * 100


  # ==========================================
  # CONGESTION LEVEL
  # ==========================================

  if average_speed >= 50:

    congestion = "low"

  elif average_speed >= 30:

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