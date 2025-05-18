import time 
import psycopg2
import requests
import json
from psycopg2.extensions import cursor
import paho.mqtt.client as mqtt
from mqtt.publisher import publish
from mqtt.subscriber import subscribe
from mqtt.connect import connect_mqtt
from test_types import DB_NAME, DB_HOST, DB_USER, DB_PASSWORD, DB_PORT,TOPICS,MQTT_CLIENT_ID
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
        topic = TOPICS["TELEMETRY"]
        message = json.dumps(telemetry)
        result = publish(client, topic, message)
        if result:
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


HEALTH = {
    "db": False,
    "mqtt": False,
    "api": False
}
def is_test_ready():
    """
    Check if the test app is ready to run.
    """
    try:
        if not HEALTH["db"]:
            # Attempt to connect to the database
            db = psycopg2.connect(
                database=DB_NAME,
                host=DB_HOST,
                user=DB_USER,
                password=DB_PASSWORD,
                port=DB_PORT)
            if db.status == 1:
                HEALTH["db"] = True
                db.close()
            else:
                print("Database connection failed.")
                HEALTH["db"] = False
                db.close()
                return False
        if not HEALTH["mqtt"]:
            client = connect_mqtt()
            if client:
                HEALTH["mqtt"] = True
                client.disconnect()
                client.loop_stop()
            else:
                print("MQTT client connection failed.")
                HEALTH["mqtt"] = False
                return False
        if not HEALTH["api"]:
            # connect to the app
            # The API endpoint
            url = "http://app:3000"
            # A GET request to the API
            response = requests.get(url)
            if(response.status_code == 200):
                HEALTH["api"] = True
            else:
                print("API is not running.")
                HEALTH["api"] = False
                return False 
    except Exception as e:
        print(f"one of the connections failed: {e}")
        return False
    return True
def main():
    """
    Run all tests.
    """
    retries = 0
    max_retries = 5
    time.sleep(20) # wait for the services to be up
    while not is_test_ready() and retries < max_retries:
        print("current health status: ", HEALTH)
        retries += 1
        print(f"Retrying... ({retries}/{max_retries})")
        # Wait for a few seconds before retrying
        time.sleep(1)
    print("Test app is ready.")
    if retries == max_retries:
        print("Test app is not ready, tests cannot be executed exiting...")
        return False
    # Run the telemetry tests
    client = connect_mqtt()
    db = psycopg2.connect(
                        database=DB_NAME,
                        host=DB_HOST,
                        user=DB_USER,
                        password=DB_PASSWORD,
                        port=DB_PORT
                        )
    cursor = db.cursor()
    print("Running telemetry tests...")
    telemetry_test_result = telemetry_tests(client, cursor)
    if telemetry_test_result:
        print("Telemetry test passed.")
    else:
        print("Telemetry test failed.")
    client.disconnect()
    client.loop_stop()
    db.close()

if __name__ == "__main__":
    print("Test app is starting.")
    main()
    print("Test app finished running.")
