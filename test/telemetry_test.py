import time 
import json
from psycopg2.extensions import cursor
import paho.mqtt.client as mqtt
from mqtt.publisher import publish
from test_types import TOPICS
from vehicletest import register_vehicle, wait_for_vehicle_registration_response
from test_data import generate_telemetry_data

def telemetry_tests(client:mqtt.Client, cursor:cursor):
    """
    ### 1. Vehicle Telemetry Data Flow via MQTT
        - Simulate sending vehicle telemetry data using a Python script over MQTT.
        - Backend must:
            - Authenticate the vehicle (ensure it is registered).
            - Reject or ignore data from unregistered or unauthenticated vehicles.
            - Process and store telemetry data in the time-series database.
    ### 2. Steps:
        - register the vehicle.
        - Use the `publish` function to send telemetry data.
        - Use the db to fetch saved telemetry data.
        - Ensure that the backend processes and stores the data correctly.
    """
    test_res = False
    # Simulate sending vehicle registration data
    vehicle_registration_test = register_vehicle(client, cursor)
    if not vehicle_registration_test[0]:
        print("Vehicle registration test failed.")
        test_res = False
    else:
        print("Vehicle registration test passed.")
        vehicle = vehicle_registration_test[1]
        # Simulate sending telemetry data
        vehicle_token = wait_for_vehicle_registration_response(client, vehicle)
        if vehicle_token is None:
            print("Vehicle registration response not received in time.")
            test_res = False
            return test_res
        telemetry_items_num = 5
        telemetry = generate_telemetry_data(telemetry_items_num,vehicle[0], vehicle_token)
        fake_telemetry = generate_telemetry_data(telemetry_items_num,vehicle[0], "fake_token")
        topic = TOPICS["TELEMETRY"]
        message = json.dumps(telemetry)
        result = publish(client, topic, message)
        fake_res = publish(client, topic, json.dumps(fake_telemetry))
        if result and fake_res:
            time.sleep(3) # wait for the message to be published
            # check if the telemetry data is saved in the database
            cursor.execute("SELECT * FROM telemetry WHERE vehicle_id = %s AND telemetry_timestamp = %s", (telemetry["vehicleId"], telemetry["timestamp_ms"]))
            telemetry_data = cursor.fetchall()
            if len(telemetry_data)  == telemetry_items_num: #telemetry_items_num is the number of entries that should have been saved
                print("Telemetry data saved successfully in the database.", telemetry_data)
                test_res = True
            else:
                print("Telemetry data not found in the database.")
                test_res = False
        else:
            print(f"Failed to publish telemetry data to {topic}")
            test_res = False
    
    return test_res
