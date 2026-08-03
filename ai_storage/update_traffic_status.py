from ai_storage.database import get_connection

def update_traffic_status(road_id, vehicle_flow, average_speed, traffic_level):

  connection = get_connection()

  cursor = connection.cursor()

  query = """
    UPDATE road_traffic_status
    SET
      vehicle_flow = %s,
      avg_speed = %s,
      traffic_level = %s,
      updated_at = NOW()
    WHERE
      road_id = %s
  """

  cursor.execute(query, (vehicle_flow, average_speed, traffic_level, road_id))

  connection.commit()

  cursor.close()
  connection.close()