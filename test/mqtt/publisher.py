import paho.mqtt.client as mqtt 
from mqtt.connect import connect_mqtt 

def publish(client:mqtt.Client ,topic:str,message:str):
    print("Publishing message: ", message, " to topic: ", topic)
    result = client.publish(topic, message,qos=1)
    if result.rc != mqtt.MQTT_ERR_SUCCESS:
        print(f"Failed to publish message to topic {topic}, error code: {result.rc}")
        return False
    else:
        print(f"Message published to topic {topic} with QoS {1}")
 
    return result[0] == 0