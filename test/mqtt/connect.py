import paho.mqtt.client as mqtt 

#TODO:  get from env
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "$7$101$2XqvPb0X9ZyNy07v$/Dn0tnZ/yKX2IOVWxarHAc63ipjFw4ga/pRJaTOuQeyXxNPq3obtG60Wno3k+HGEOKVoGmfmquVsrYXycfGowQ=="
BROKER_HOSTNAME = "mosquitto"
PORT = 1883
def on_connect(client, userdata, flags, return_code):
    if return_code == 0:
        print("connected")
    else:
        print("could not connect, return code:", return_code)

def connect_mqtt() -> mqtt.Client:
    client = mqtt.Client(client_id="test_client")
    client.username_pw_set(username=ADMIN_USERNAME, password=ADMIN_PASSWORD)
    client.on_connect = on_connect
    client.connect(BROKER_HOSTNAME, PORT)
    client.loop_start()
    return client