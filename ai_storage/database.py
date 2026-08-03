import mysql.connector

def get_connection():
  return mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="lgu4_traffic_transport"
  )