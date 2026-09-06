from ai_storage.database import get_connection

def save_possible_accident(road_id, detected_at, snapshot_filename):

  connection = get_connection()

  cursor = connection.cursor()

  try:

    query = """
      INSERT INTO accident_detections(road_id, detected_at, snapshot_filename)
      VALUES (%s, %s, %s)
    """

    cursor.execute(
      query,
      (
        road_id,
        detected_at,
        snapshot_filename
      )
    )

    connection.commit()

    return {
      "success": True,
      "accident_detection_id": cursor.lastrowid
    }

  except Exception as error:

    if connection:
      connection.rollback()

    print(
      f"Failed to save possible accident: {error}"
    )

    return {
      "success": False,
      "message": str(error)
    }
  
  finally:

    if cursor:
      cursor.close()

    if connection:
      connection.close()  