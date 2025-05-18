from mqtt.connect import connect_mqtt
import paho.mqtt.client as mqtt 
# Define CallbackOnMessage as a type alias for the on_message callback signature
from typing import Callable
CallbackOnMessage = Callable[[mqtt.Client, object, mqtt.MQTTMessage], None]

    
def subscribe(client:mqtt.Client,topic:str,qos:int,on_message_callback:CallbackOnMessage):
    def on_message(client, userdata, msg):
        on_message_callback(client, userdata, msg)
    client.message_callback_add(topic,on_message)
    subscription = client.subscribe(topic)
    if subscription[0] != 0:
        print(f"Failed to subscribe to topic {topic}, error code: {subscription[0]}")
        return False
    else:
        print(f"Subscribed to topic {topic} with QoS {qos}")
    
    return True