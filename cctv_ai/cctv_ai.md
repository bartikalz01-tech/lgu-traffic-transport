# CCTV AI Implementations

### CCTV AI Features (Done)

1. #### Yolo can now detect vehicles
2. #### Calculations on Vehicle Per Minute
   - First it filters the vehicles that can be identified on counting mechanism on this <mark>filter_vehicles.py</mark>.

   - Then *update_vehicle_counter()* on 
   <mark>vehicle_counter.py</mark>, will count the vehicles spotted using unique ids that came to *filter_vehicles()*, the key thing is the *set()* code that makes the ids unique and make the counting vehicles accurate. It pushes data onto *vehicle_history* variable. 

   - On the *report_vehicle_count()*, it outputs the reported vehicles with the usage of 
   *len(vehicle_history[camera_name])* ,


3. #### The calculations on average speed
    - The actual calculations will be studied later.

    - So in general context, it calculates based vehicles previous position and current position.


4. #### The calculations on traffic congestion

   - Based on average speed.

*********

### Plans for CCTV AI
