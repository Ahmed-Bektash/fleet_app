import paho.mqtt.client as mqtt 
import time 
from mqtt.connect import connect_mqtt 



topic = "Test"
msg_count = 0
def publish(message:str):
    client = connect_mqtt()
    print("Publishing message: ", message)
    return message
# try:
#     while msg_count < 10:
#         time.sleep(1)
#         msg_count += 1
#         result = client.publish(topic, msg_count)
#         status = result[0]
#         if status == 0:
#             print("Message "+ str(msg_count) + " is published to topic " + topic)
#         else:
#             print("Failed to send message to topic " + topic)
#             if not client.is_connected():
#                 print("Client not connected, exiting...")
#                 break
# finally:
#     client.disconnect()
#     client.loop_stop()