from ai_storage.database import get_connection

def get_road_id(video_filename):

  connection = get_connection()
  cursor = connection.cursor(dictionary=True)

  query = """
    SELECT road_id
    FROM roads
    WHERE video_filename = %s
  """

  cursor.execute(query, (video_filename,))
  road = cursor.fetchone()

  cursor.close()
  connection.close()

  if road is None:
    return None

  return road["road_id"]