from typing import Any
import json
import time
import paho.mqtt.client as mqtt 
from psycopg2.extensions import cursor
from test_data import generate_vehicle_registration_data
from test_types import TOPICS
from mqtt.publisher import publish
from mqtt.subscriber import subscribe

TOKEN:str | None = None
def on_vehicle_reg_response(client, userdata, message):
    """
    Callback function to handle vehicle registration response.
    """
    # set the token to the global variable
    print(f"Vehicle registration response received: {message.payload.decode()}")
    vehicle_token = message.payload.decode()
    global TOKEN
    TOKEN = vehicle_token

def register_vehicle(client:mqtt.Client, db:cursor)->tuple[bool, tuple[Any, ...]]:
    #  get a random fleet id from the fleet table
    # the table should be created and populated using the migrations in the app in the docker-compose file
    db.execute("SELECT * FROM fleet")
    fleet = db.fetchone()
    if fleet is None:
        print("No fleet found in the database.")
        return False,() #test failed
    fleet_id = fleet[0]  # Assuming the first column is the fleet ID
    vehicle_registration_data = generate_vehicle_registration_data(1, fleet_id)[0]
    topic = TOPICS["VEHICLE_REGISTER"]
    message = json.dumps(vehicle_registration_data)
    result = publish(client, topic, message)
    if not result:
        print(f"Failed to publish vehicle registration data to {topic}")
        return False,()
    # check if the vehicle is registered in the database
    db.execute("SELECT * FROM vehicle WHERE vin=%s", (vehicle_registration_data["vin"],))
    vehicle = db.fetchone()
    if vehicle is None:
        print("Vehicle not found in the database.")
        return False,()
    print("Vehicle registered successfully in the database.")
    return True,vehicle #test passed

def wait_for_vehicle_registration_response(client:mqtt.Client, vehicle:tuple[Any, ...], timeout:int=5)->str|None:
    # Subscribe to the vehicle registration response topic
        is_subscribed = subscribe(client, f'{TOPICS["VEHICLE_REGISTER"]}/response/{vehicle[8]}',1,on_vehicle_reg_response)
        if not is_subscribed:
            print("Failed to subscribe to vehicle registration response topic.")
            return None
        # Wait for the vehicle registration response
        now = time.time()
        print("Waiting for vehicle registration response...")
        while TOKEN is None and time.time() - now < 5: #5 seconds timeout
            continue
        # return the token even if it is None
        return TOKEN