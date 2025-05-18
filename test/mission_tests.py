import requests
from psycopg2.extensions import cursor
import paho.mqtt.client as mqtt
import random as radom
import time
from vehicletest import register_vehicle, wait_for_vehicle_registration_response

def create_mission_tests(client:mqtt.Client, cursor:cursor):
    """
    ### 2. Mission Request
        - simulate a mission request.
        - Backend must:
        - Accept and log the mission request.
        - Forward the mission to the vehicle via MQTT.
        - Handle the vehicle’s mission response over MQTT.

    **Expected Results:**
    - Mission appears in the database with initial and updated statuses.
    """
    vehicle_registration_test = register_vehicle(client, cursor)
    if not vehicle_registration_test[0]:
        print("Vehicle registration test failed.")
        test_res = False
        return test_res
    else:
        print("Vehicle registration test passed.")
        vehicle = vehicle_registration_test[1]
        # Simulate sending telemetry data
        vehicle_token = wait_for_vehicle_registration_response(client, vehicle)
        if vehicle_token is None:
            print("Vehicle registration response not received in time.")
            test_res = False
            return test_res
    mission_name = f'm{radom.randint(100,1000)}'
    mission_start_time_ms = str(int(time.time() * 1000))
    response = requests.post("http://app:3000/missions", 
                json={
                    "vehicle_id" : vehicle[0],
                    "mission_name":mission_name,
                    "mission_type": "delivery",
                    "mission_description": "deliver ite a to place b",
                    "mission_start_time": mission_start_time_ms,
                    "mission_location": "dubai",
                    "token": vehicle_token
                    })
    if response.status_code == 200:
        # check if the mission is saved in the database
        cursor.execute("SELECT * FROM mission WHERE vehicle_id = %s AND mission_name = %s", (vehicle[0], "m200"))
        mission_data = cursor.fetchall()
        if len(mission_data) > 0:
            print("Mission data saved successfully in the database.", mission_data)
            test_res = True
        else:
            print("Mission data not found in the database.")
            test_res = False
    else:
        print("Failed to create mission request.")
        test_res = False
    return test_res

    """
    ### 3. Mission Response Handling
    - Simulate mission response via MQTT.
    - Backend must:
        - Verify the authenticity of the response.
        - Update the database with the appropriate mission status.
    ### 4. Mission Status Update
    - Simulate mission progress updates over MQTT.
    - Backend must:
        - Update the mission status in the database with timestamps.

    **Expected Results:**
        - The database reflects mission progress accurately.
    """
    vehicle_registration_test = register_vehicle(client, cursor)
    if not vehicle_registration_test[0]:
        print("Vehicle registration test failed.")
        test_res = False
        return test_res
    else:
        print("Vehicle registration test passed.")
        vehicle = vehicle_registration_test[1]
        # Simulate sending telemetry data
        vehicle_token = wait_for_vehicle_registration_response(client, vehicle)
        if vehicle_token is None:
            print("Vehicle registration response not received in time.")
            test_res = False
            return test_res

    response = requests.post("http://app:3000/missions", 
                json={
                    "vehicle_id" : vehicle[0],
                    "mission_name":"m200",
                    "mission_type": "delivery",
                    "mission_description": "deliver ite a to place b",
                    "mission_start_time": "1747513029000",
                    "mission_location": "dubai",
                    "token": vehicle_token
                    })
    if response.status_code == 200:
        # check if the mission is saved in the database
        cursor.execute("SELECT * FROM mission WHERE vehicle_id = %s AND mission_name = %s", (vehicle[0], "m200"))
        mission_data = cursor.fetchall()
        if len(mission_data) > 0:
            print("Mission data saved successfully in the database.", mission_data)
            test_res = True
        else:
            print("Mission data not found in the database.")
            test_res = False
    else:
        print("Failed to create mission request.")
        test_res = False
    return test_res