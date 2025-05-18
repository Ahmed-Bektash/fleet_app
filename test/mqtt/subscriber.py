from mqtt.connect import connect_mqtt


def subscribe(topic:str):
    client = connect_mqtt()
    print("subscribe message: ", topic)
    return topic