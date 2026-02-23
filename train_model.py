import pandas as pd
import mysql.connector
import joblib
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# Connect to MySQL
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="lgu4_traffic_transport"
)

query = "SELECT * FROM traffic_metrics"
df = pd.read_sql(query, conn)

print(df.head())

# Features
X = df[[
    "vehicles_per_min",
    "pedestrians",
    "avg_speed",
    "lane_usage",
    "avg_wait_time",
    "time_of_day",
    "day_of_week"
]]

# Target
y = df["congestion_level"]

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Create model
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

# Train
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print("Model Accuracy:", accuracy)

# Save trained model
joblib.dump(model, "traffic_rf_model.pkl")
print("Model saved as traffic_rf_model.pkl")

print("Model trained successfully!")