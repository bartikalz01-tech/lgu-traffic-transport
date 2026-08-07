from ai_storage.database import get_connection

def update_traffic_status(road_id, vehicle_flow, average_speed, traffic_level):

  connection = get_connection()

  cursor = connection.cursor()

  update_query = """
    UPDATE road_traffic_status
    SET
      vehicle_flow = %s,
      avg_speed = %s,
      traffic_level = %s,
      updated_at = NOW()
    WHERE
      road_id = %s
  """

  cursor.execute(update_query, (vehicle_flow, average_speed, traffic_level, road_id))

  insert_query =  """
    INSERT INTO road_traffic_logs(
      road_id,
      vehicle_flow,
      avg_speed,
      traffic_level
    )
    VALUES (
      %s,
      %s,
      %s,
      %s
    )
  """

  cursor.execute(insert_query, (road_id, vehicle_flow, average_speed, traffic_level))

  connection.commit()

  cursor.close()
  connection.close()