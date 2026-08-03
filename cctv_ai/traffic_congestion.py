def calculate_congestion(vehicle_per_minute, average_speed):

  if vehicle_per_minute >= 100:
    flow_score = 50
  else:
    flow_score = (vehicle_per_minute / 100) * 50


  if average_speed <= 10:
    speed_score = 50
  elif average_speed >= 50:
    speed_score = 0
  else:
    speed_score = ((50 - average_speed) / 40) * 50


  congestion_score = flow_score + speed_score

  if congestion_score < 30:
    congestion = "low"
  elif congestion_score < 60:
    congestion = "moderate"
  else:
    congestion = "high"

  
  return congestion_score, congestion