import paho.mqtt.client as mqtt
import time
from test_types import BROKER_HOSTNAME, PORT, ADMIN_USERNAME, ADMIN_PASSWORD,MQTT_CLIENT_ID



def connect_mqtt() -> mqtt.Client:
    on_connect = lambda client, userdata, flags, rc: print(f"Connected with result code {rc}")
    client = mqtt.Client(client_id=MQTT_CLIENT_ID)
    client.username_pw_set(username=ADMIN_USERNAME, password=ADMIN_PASSWORD)
    res = client.connect(BROKER_HOSTNAME, PORT)
    if res != 0:
        print(f"Failed to connect to MQTT broker, error code: {res}")
        raise ConnectionError(f"Failed to connect to MQTT broker, error code: {res}")
    client.on_connect = on_connect
    # Wait for the connection to be established
    loop_res = client.loop_start()
    if loop_res != 0:
        print(f"Failed to start MQTT loop, error code: {loop_res}")
        client.disconnect()
        client.loop_stop()
        raise ConnectionError(f"Failed to start MQTT loop, error code: {loop_res}")
    time.sleep(3)  # Wait for the connection to be established
    now = time.time() 
    while not client.is_connected() and time.time() - now < 5: #5 seconds timeout
        print("Waiting for MQTT client to connect...")
    return client