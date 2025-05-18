import time 
import psycopg2
import requests
import json
from psycopg2.extensions import cursor
import paho.mqtt.client as mqtt
from mqtt.publisher import publish
from mqtt.subscriber import subscribe
from mqtt.connect import connect_mqtt
from test_types import DB_NAME, DB_HOST, DB_USER, DB_PASSWORD, DB_PORT

from telemetry_test import telemetry_tests
    
    


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
